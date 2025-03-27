"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/lib/store";
import { Copy, Check, Palette } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CSSVariable {
  name: string;
  value: string;
  type: "color" | "size" | "other";
}

export function CSSVariablesShowcase() {
  const [variables, setVariables] = useState<CSSVariable[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const { fonts, isDarkMode } = useThemeStore();

  useEffect(() => {
    let isMounted = true;

    // Get all CSS variables when component mounts
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const cssVars: CSSVariable[] = [];

    // List of CSS variable prefixes we want to capture
    const prefixes = [
      "background",
      "foreground",
      "card",
      "popover",
      "primary",
      "secondary",
      "muted",
      "accent",
      "destructive",
      "border",
      "input",
      "ring",
      "radius",
      "chart",
      "sidebar",
    ];

    // Extract all CSS variables that match our prefixes
    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle[i];
      if (prop.startsWith("--")) {
        const name = prop.substring(2); // Remove the -- prefix

        // Check if this variable matches any of our prefixes
        if (prefixes.some((prefix) => name.startsWith(prefix))) {
          const value = computedStyle.getPropertyValue(prop).trim();

          // Determine the type of variable
          let type: "color" | "size" | "other" = "other";

          if (name.includes("radius")) {
            type = "size";
          } else if (
            !name.includes("font") &&
            (value.includes("hsl") ||
              value.includes("%") ||
              /^\d+ \d+% \d+%$/.test(value))
          ) {
            type = "color";
          }

          cssVars.push({ name, value, type });
        }
      }
    }

    // Sort variables by name
    cssVars.sort((a, b) => {
      // Group by main category first
      const aBase = a.name.split("-")[0];
      const bBase = b.name.split("-")[0];

      if (aBase !== bBase) {
        return aBase.localeCompare(bBase);
      }

      // Then sort by full name
      return a.name.localeCompare(b.name);
    });

    if (isMounted) {
      setVariables(cssVars);
    }

    return () => {
      isMounted = false;
    };
  }, [isDarkMode]); // Re-run when dark mode changes

  // Group variables by their main category
  const groupedVariables: Record<string, CSSVariable[]> = {};

  variables.forEach((variable) => {
    const category = variable.name.split("-")[0];
    if (!groupedVariables[category]) {
      groupedVariables[category] = [];
    }
    groupedVariables[category].push(variable);
  });

  const handleCopy = (variable: CSSVariable) => {
    const textToCopy = `var(--${variable.name})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(variable.name);

    toast(`${textToCopy} copied to clipboard`);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  // Function to render a color swatch
  const renderSwatch = (variable: CSSVariable) => {
    if (variable.type === "color") {
      return (
        <div
          className="w-full h-12 rounded-md border border-border"
          style={{
            background: variable.value.includes("hsl")
              ? variable.value
              : `hsl(${variable.value})`,
          }}
        />
      );
    }

    return (
      <div className="w-full h-12 rounded-md border border-border flex items-center justify-center text-sm font-mono">
        {variable.value}
      </div>
    );
  };

  return (
    <section id="css-variables" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            style={{ fontFamily: fonts.heading }}
          >
            Theme Variables Explorer
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            style={{ fontFamily: fonts.body }}
          >
            Explore all the CSS variables available in your current theme. Click
            on any color to copy its variable to your clipboard.
          </p>
        </div>

        {/* Detailed Variables Section */}
        <div className="grid gap-8">
          {Object.entries(groupedVariables).map(([category, vars]) => (
            <Card
              key={category}
              className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors"
            >
              <CardHeader className="bg-card border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle className="capitalize">{category}</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-primary/5">
                    {vars.length} variables
                  </Badge>
                </div>
                <CardDescription>
                  {category === "chart" &&
                    "Chart color variables for data visualization"}
                  {category === "primary" &&
                    "Primary brand colors and their variants"}
                  {category === "secondary" &&
                    "Secondary colors for UI elements"}
                  {category === "background" &&
                    "Background colors for different contexts"}
                  {category === "foreground" &&
                    "Text colors for different contexts"}
                  {category === "sidebar" &&
                    "Sidebar-specific styling variables"}
                  {category === "card" && "Card component styling variables"}
                  {category === "accent" &&
                    "Accent colors for highlights and focus states"}
                  {category === "muted" &&
                    "Muted colors for subtle UI elements"}
                  {category === "border" && "Border colors and styling"}
                  {category === "radius" && "Border radius values"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vars.map((variable) => (
                    <div
                      key={variable.name}
                      className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                      onClick={() => handleCopy(variable)}
                    >
                      {renderSwatch(variable)}
                      <div className="p-3 flex items-center justify-between">
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            --{variable.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate font-mono">
                            {variable.value}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {copied === variable.name ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
