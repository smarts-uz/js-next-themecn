"use client";

import { useState, useRef } from "react";
import { useThemeStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { converter } from "culori";
import type { Oklch, Hsl } from "culori";

function parseGlobalsCss(cssText: string): {
  light: Record<string, string>;
  dark: Record<string, string>;
  type: "hsl" | "oklch";
} | null {
  try {
    const light: Record<string, string> = {};
    const dark: Record<string, string> = {};
    let type: "hsl" | "oklch" = "hsl";

    // Try to identify if it's OKLCH or HSL format
    if (cssText.includes("oklch(")) {
      type = "oklch";
    }

    // Extract root variables
    const rootMatch = cssText.match(/:root\s*{([^}]*)}/);
    if (rootMatch && rootMatch[1]) {
      const rootVars = rootMatch[1].match(/--([^:]+):\s*([^;]+);/g);
      if (rootVars) {
        rootVars.forEach((varDef) => {
          const varMatch = varDef.match(/--([^:]+):\s*([^;]+);/);
          if (varMatch) {
            const name = varMatch[1].trim();
            const value = varMatch[2].trim();
            light[name] = value;
          }
        });
      }
    }

    // Extract dark mode variables
    const darkMatch = cssText.match(/\.dark\s*{([^}]*)}/);
    if (darkMatch && darkMatch[1]) {
      const darkVars = darkMatch[1].match(/--([^:]+):\s*([^;]+);/g);
      if (darkVars) {
        darkVars.forEach((varDef) => {
          const varMatch = varDef.match(/--([^:]+):\s*([^;]+);/);
          if (varMatch) {
            const name = varMatch[1].trim();
            const value = varMatch[2].trim();
            dark[name] = value;
          }
        });
      }
    }

    return { light, dark, type };
  } catch (error) {
    console.error("Error parsing CSS:", error);
    return null;
  }
}

interface ImportMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ImportMenu({ open, onOpenChange }: ImportMenuProps) {
  const { applyThemeState } = useThemeStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const [cssContent, setCssContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use either external or internal state for controlling the dialog
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCssContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!cssContent.trim()) {
      toast.error("Please provide CSS content to import");
      return;
    }

    const result = parseGlobalsCss(cssContent);
    if (!result) {
      toast.error("Failed to parse CSS content");
      return;
    }

    // Extract variables and create theme state
    const { light, dark, type } = result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeState: any = {
      colors: {},
      darkColors: {},
      isDarkMode: false,
    };

    // Helper to convert CSS value to HSL for internal format
    const convertToHSL = (value: string, varType: "hsl" | "oklch"): string => {
      if (varType === "hsl") {
        try {
          console.log(`Parsing HSL value: ${value}`);

          // Handle various HSL formats including:
          // - hsl(0, 0%, 100%)
          // - hsl(0 0% 100%)
          // - 0 0% 100%
          // - hsl(0deg 0% 100%)
          let hslMatch;

          // Format with parentheses and commas: hsl(0, 0%, 100%)
          if (value.includes(",")) {
            hslMatch = value.match(
              /hsl\(\s*(\d+)(?:deg)?\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)/
            );
            if (hslMatch) {
              const h = parseInt(hslMatch[1], 10);
              const s = parseFloat(hslMatch[2]);
              const l = parseFloat(hslMatch[3]);
              const result = `${h} ${s}% ${l}%`;
              console.log(`Parsed HSL (comma format): ${result}`);
              return result;
            }
          }

          // Format with parentheses but no commas: hsl(0 0% 100%)
          hslMatch = value.match(
            /hsl\(\s*(\d+)(?:deg)?\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*\)/
          );
          if (hslMatch) {
            const h = parseInt(hslMatch[1], 10);
            const s = parseFloat(hslMatch[2]);
            const l = parseFloat(hslMatch[3]);
            const result = `${h} ${s}% ${l}%`;
            console.log(`Parsed HSL (space format): ${result}`);
            return result;
          }

          // Format without parentheses: 0 0% 100%
          hslMatch = value.match(
            /^(\d+)(?:deg)?\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/
          );
          if (hslMatch) {
            const h = parseInt(hslMatch[1], 10);
            const s = parseFloat(hslMatch[2]);
            const l = parseFloat(hslMatch[3]);
            const result = `${h} ${s}% ${l}%`;
            console.log(`Parsed HSL (raw format): ${result}`);
            return result;
          }

          console.log(`HSL format not recognized: ${value}`);
        } catch (error) {
          console.error("Error parsing HSL:", error);
        }

        // Old implementation as fallback
        const fallbackMatch = value.match(
          /(?:hsl\()?(\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%)(?:\))?/
        );
        if (fallbackMatch) {
          console.log(`Parsed HSL (fallback): ${fallbackMatch[1]}`);
          return fallbackMatch[1];
        }
      } else if (varType === "oklch") {
        try {
          // Handle more formats of OKLCH values with a more flexible regex
          // This will match patterns like:
          // - oklch(0.9 0.1 270)
          // - oklch(0.9, 0.1, 270)
          // - oklch(0.9 0.1 270deg)
          // - oklch(90% 0.1 270)
          const oklchMatch = value.match(
            /oklch\(\s*([0-9.]+%?)\s*[,\s]\s*([0-9.]+%?)\s*[,\s]\s*([0-9.]+)(?:deg)?\s*\)/
          );

          if (oklchMatch) {
            let l = parseFloat(oklchMatch[1]);
            let c = parseFloat(oklchMatch[2]);
            const h = parseFloat(oklchMatch[3]);

            // Handle percentage values for lightness
            if (oklchMatch[1].includes("%")) {
              l = l / 100;
            }

            // Handle percentage values for chroma
            if (oklchMatch[2].includes("%")) {
              c = c / 100;
            }

            console.log(`Converting OKLCH: l=${l}, c=${c}, h=${h}`);

            // Create an OKLCH color object with proper typing
            const color: Oklch = { mode: "oklch", l, c, h };

            // Convert to HSL format
            const hsl = converter("hsl")(color) as Hsl | undefined;
            if (hsl) {
              const h = Math.round(hsl.h || 0);
              const s = Math.round((hsl.s || 0) * 100);
              const l = Math.round((hsl.l || 0) * 100);
              const hslValue = `${h} ${s}% ${l}%`;
              console.log(`Converted to HSL: ${hslValue}`);
              return hslValue;
            } else {
              console.log("HSL conversion failed");
            }
          } else {
            console.log(`OKLCH pattern not matched in value: ${value}`);
          }
        } catch (error) {
          console.error("Error converting OKLCH to HSL:", error);
        }
      }

      // Return a default value if parsing fails
      return "0 0% 100%";
    };

    // Map common variable names to theme state properties
    const variableMap: Record<string, string> = {
      background: "background",
      foreground: "foreground",
      card: "card",
      "card-foreground": "cardForeground",
      popover: "popover",
      "popover-foreground": "popoverForeground",
      primary: "primary",
      "primary-foreground": "primaryForeground",
      secondary: "secondary",
      "secondary-foreground": "secondaryForeground",
      muted: "muted",
      "muted-foreground": "mutedForeground",
      accent: "accent",
      "accent-foreground": "accentForeground",
      destructive: "destructive",
      border: "border",
      input: "input",
      ring: "ring",
      "chart-1": "chart1",
      "chart-2": "chart2",
      "chart-3": "chart3",
      "chart-4": "chart4",
      "chart-5": "chart5",
      sidebar: "sidebar",
      "sidebar-foreground": "sidebarForeground",
      "sidebar-primary": "sidebarPrimary",
      "sidebar-primary-foreground": "sidebarPrimaryForeground",
      "sidebar-accent": "sidebarAccent",
      "sidebar-accent-foreground": "sidebarAccentForeground",
      "sidebar-border": "sidebarBorder",
      "sidebar-ring": "sidebarRing",
    };

    // Process light mode variables
    Object.entries(light).forEach(([name, value]) => {
      const propName = variableMap[name];
      if (propName) {
        const convertedValue = convertToHSL(value, type);
        console.log(
          `Light Variable: ${name} -> ${propName}, Original: ${value}, Converted: ${convertedValue}`
        );
        themeState.colors[propName] = convertedValue;
      }
    });

    // Process dark mode variables
    Object.entries(dark).forEach(([name, value]) => {
      const propName = variableMap[name];
      if (propName) {
        const convertedValue = convertToHSL(value, type);
        console.log(
          `Dark Variable: ${name} -> ${propName}, Original: ${value}, Converted: ${convertedValue}`
        );
        themeState.darkColors[propName] = convertedValue;
      }
    });

    // Check for radius
    if (light["radius"]) {
      const radiusMatch = light["radius"].match(/(\d+(?:\.\d+)?)/);
      if (radiusMatch) {
        themeState.borderRadius = parseFloat(radiusMatch[1]);
      }
    }

    // Check what the final theme state looks like
    console.log("Final Theme State:", JSON.stringify(themeState, null, 2));

    // Apply the theme state
    applyThemeState(themeState);

    // Count how many variables were imported
    const lightCount = Object.keys(themeState.colors).length;
    const darkCount = Object.keys(themeState.darkColors).length;

    setIsOpen(false);
    setCssContent("");
    toast.success(
      `Theme imported successfully with ${lightCount} light variables and ${darkCount} dark variables`
    );
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".css"
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white text-black rounded-md border-0 shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-black font-semibold">
              Import Theme from CSS Variables
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Upload or paste your globals.css file to import theme variables.
              Both HSL and OKLCH formats are supported.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 cursor-pointer bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setCssContent(text);
                    toast.success("Content pasted from clipboard");
                  } catch {
                    toast.error("Failed to read from clipboard");
                  }
                }}
                className="flex-1 cursor-pointer bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-full"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Paste from Clipboard
              </Button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-md bg-[#f5f7f9] border border-gray-200 overflow-auto max-h-[400px] text-sm text-gray-800 font-mono">
                <textarea
                  placeholder="Paste your globals.css content here..."
                  className="min-h-[300px] w-full font-mono text-sm bg-transparent border-none p-0 resize-none focus:outline-none"
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                />
              </pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-md text-gray-700 text-sm">
            <p className="font-medium mb-1">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Supports both HSL and OKLCH color formats</li>
              <li>Will extract variables from :root and .dark selectors</li>
              <li>Requires standard shadcn/ui variable naming</li>
            </ul>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="bg-white dark:bg-white dark:hover:bg-gray-100 dark:hover:text-gray-800 cursor-pointer text-gray-800 border border-gray-200 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="bg-gray-900 cursor-pointer text-white hover:bg-black rounded-md border-0"
            >
              Import Theme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
