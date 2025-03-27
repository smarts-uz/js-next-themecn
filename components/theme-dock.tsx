"use client";

import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PaintBucket,
  Type,
  Download,
  Sun,
  Moon,
  Shuffle,
  Square,
  Palette,
  Plus,
  Check,
  Droplet,
  LayoutTemplate,
  LockOpenIcon as LockClosedIcon,
  LockOpenIcon,
} from "lucide-react";
import { BorderRadiusControl } from "@/components/border-radius-control";
import { ExportMenu } from "@/components/export-menu";
import { ShareMenu } from "@/components/share-menu";
import { ColorPicker } from "@/components/color-picker";
import { useMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

type FontKey = "heading" | "body";

// Create a client-only version of the component to prevent hydration issues
const ThemeDock = () => {
  const {
    fonts,
    isDarkMode,
    selectedHarmony,
    updateThemeColor,
    updateFont,
    toggleDarkMode,
    setSelectedHarmony,
    generateHarmonyColors,
    setExportMenuOpen,
    getHexColor,
    shareMenuOpen,
    setShareMenuOpen,
    predefinedThemes,
    currentTheme,
    setCurrentTheme,
    saveCurrentAsTheme,
  } = useThemeStore();

  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobile = useMobile();
  const [dockVisible, setDockVisible] = useState(true);
  const [saveThemeDialogOpen, setSaveThemeDialogOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const dockRef = useRef<HTMLDivElement>(null);
  const [fontsLocked, setFontsLocked] = useState(false);

  // Toggle dock visibility with keyboard shortcut (Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "D") {
        setDockVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Font options
  const fontOptions = [
    "Geist",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Oswald",
    "Merriweather",
    "Playfair Display",
    "Source Sans Pro",
    "Ubuntu",
    "Nunito",
    "Rubik",
    "Work Sans",
    "PT Sans",
    "Mulish",
    "Quicksand",
    "Fira Sans",
    "Cabin",
  ];

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontOptions
      .map((font) => font.replace(/ /g, "+"))
      .join("&family=")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleSaveTheme = () => {
    if (newThemeName.trim()) {
      saveCurrentAsTheme(newThemeName.trim());
      setSaveThemeDialogOpen(false);
      setNewThemeName("");
    }
  };

  // Template navigation
  const templates = [
    { name: "Landing Page", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCurrentTemplate = () => {
    const currentPath = pathname || "/";
    const template = templates.find((t) => t.path === currentPath);
    return template?.name || "Select Template";
  };

  const navigateToTemplate = (path: string) => {
    // Get the current theme parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");

    // Append the theme parameter to the path if it exists
    const newPath = themeParam ? `${path}?theme=${themeParam}` : path;

    router.push(newPath);
  };

  // Handle font changes when fonts are locked or unlocked
  const handleFontChange = (key: FontKey, value: string) => {
    if (fontsLocked) {
      // If fonts are locked, update both heading and body fonts
      updateFont("heading", value);
      updateFont("body", value);
    } else {
      // If fonts are unlocked, update only the specified font
      updateFont(key, value);
    }
  };

  // Color harmony options
  const harmonyOptions = [
    { name: "Monochromatic", value: "monochromatic" as const },
  ];

  if (!dockVisible) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-50 rounded-full w-10 h-10 p-0 shadow-lg bg-background/80 backdrop-blur-xl border border-border/30 hover:scale-110 transition-transform duration-200"
        onClick={() => setDockVisible(true)}
      >
        <PaintBucket size={18} />
      </Button>
    );
  }

  return (
    <>
      <ExportMenu />
      <ShareMenu open={shareMenuOpen} onOpenChange={setShareMenuOpen} />

      {/* Save Theme Dialog */}
      <Dialog open={saveThemeDialogOpen} onOpenChange={setSaveThemeDialogOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          style={{
            backgroundColor: "white",
            color: "#1a1a1a",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#1a1a1a", fontWeight: "600" }}>
              Save Current Theme
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="theme-name"
                className="text-right"
                style={{ color: "#374151" }}
              >
                Name
              </label>
              <Input
                id="theme-name"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="My Custom Theme"
                className="col-span-3"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  color: "#1f2937",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveThemeDialogOpen(false)}
              style={{
                backgroundColor: "white",
                color: "#4b5563",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTheme}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Save Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main dock container */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 md:px-8">
        <div
          ref={dockRef}
          className="bg-white backdrop-blur-xl border border-gray-200 rounded-full shadow-lg mx-auto overflow-visible"
          style={{ padding: "8px 12px" }}
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center justify-center overflow-x-auto py-1 px-1 scrollbar-hide">
              {/* Foreground Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-border/50"
                            style={{
                              backgroundColor: getHexColor("foreground"),
                            }}
                          />
                          <span className="sr-only">Foreground</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Foreground Color</span>
                        </div>
                        <ColorPicker
                          color={getHexColor("foreground")}
                          onChange={(color) =>
                            updateThemeColor("foreground", color)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Foreground Color
                </TooltipContent>
              </Tooltip>

              {/* Background Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-border/50"
                            style={{
                              backgroundColor: getHexColor("background"),
                            }}
                          />
                          <span className="sr-only">Background</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Background Color</span>
                        </div>
                        <ColorPicker
                          color={getHexColor("background")}
                          onChange={(color) =>
                            updateThemeColor("background", color)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Background Color
                </TooltipContent>
              </Tooltip>

              {/* Primary Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary" />
                          <span className="sr-only">Primary</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Primary Color</span>
                        </div>
                        <ColorPicker
                          color={getHexColor("primary")}
                          onChange={(color) =>
                            updateThemeColor("primary", color)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Primary Color
                </TooltipContent>
              </Tooltip>

              {/* Secondary Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <div className="w-7 h-7 rounded-full bg-secondary" />
                          <span className="sr-only">Secondary</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Secondary Color</span>
                        </div>
                        <ColorPicker
                          color={getHexColor("secondary")}
                          onChange={(color) =>
                            updateThemeColor("secondary", color)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Secondary Color
                </TooltipContent>
              </Tooltip>

              {/* Accent Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <div className="w-7 h-7 rounded-full bg-accent" />
                          <span className="sr-only">Accent</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Accent Color</span>
                        </div>
                        <ColorPicker
                          color={getHexColor("accent")}
                          onChange={(color) =>
                            updateThemeColor("accent", color)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Accent Color
                </TooltipContent>
              </Tooltip>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {/* Templates Selector */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <LayoutTemplate size={18} />
                          <span className="sr-only">Templates</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-56 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        ></div>
                        <div className="py-1">
                          {templates.map((template) => (
                            <Button
                              key={template.path}
                              variant="ghost"
                              className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900"
                              onClick={() => navigateToTemplate(template.path)}
                              style={{ color: "#374151", borderRadius: "0" }}
                            >
                              <span>{template.name}</span>
                              {pathname === template.path && (
                                <Check
                                  size={16}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                />
                              )}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Templates
                </TooltipContent>
              </Tooltip>

              {/* Color Harmony Selector */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <Droplet size={18} />
                          <span className="sr-only">Color Harmony</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-56 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Color Harmony</span>
                        </div>
                        <div className="py-1">
                          {harmonyOptions.map((harmony) => (
                            <Button
                              key={harmony.value}
                              variant="ghost"
                              className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900"
                              onClick={() => setSelectedHarmony(harmony.value)}
                              style={{ color: "#374151", borderRadius: "0" }}
                            >
                              <span>{harmony.name}</span>
                              {selectedHarmony === harmony.value && (
                                <Check
                                  size={16}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                />
                              )}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Color Harmony
                </TooltipContent>
              </Tooltip>

              {/* Theme Selector */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <Palette size={18} />
                          <span className="sr-only">Themes</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-56 p-0"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="p-2 flex items-center justify-between"
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            color: "#1a1a1a",
                          }}
                        >
                          <span className="font-medium">Theme Presets</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => setSaveThemeDialogOpen(true)}
                            style={{ borderRadius: "4px" }}
                          >
                            <Plus size={16} />
                            <span className="sr-only">Save Current Theme</span>
                          </Button>
                        </div>
                        <div className="py-1">
                          {predefinedThemes.map((theme) => (
                            <Button
                              key={theme.name}
                              variant="ghost"
                              className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900"
                              onClick={() => setCurrentTheme(theme.name)}
                              style={{ color: "#374151", borderRadius: "0" }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.primary,
                                  }}
                                />
                                <span>{theme.name}</span>
                              </div>
                              {currentTheme === theme.name && (
                                <Check
                                  size={16}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                />
                              )}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Theme Presets
                </TooltipContent>
              </Tooltip>

              {/* Border Radius */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <Square size={18} />
                          <span className="sr-only">Radius</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-4"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div
                          className="mb-2 font-medium"
                          style={{ color: "#1a1a1a" }}
                        >
                          Border Radius
                        </div>
                        <BorderRadiusControl />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Border Radius
                </TooltipContent>
              </Tooltip>

              {/* Fonts */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                        >
                          <Type size={18} />
                          <span className="sr-only">Fonts</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-4"
                        side="top"
                        align="center"
                        sideOffset={16}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          color: "#1a1a1a",
                        }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className="font-medium"
                            style={{ color: "#1a1a1a" }}
                          >
                            Typography
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFontsLocked(!fontsLocked)}
                            className={`h-8 px-2 flex items-center gap-1 ${
                              fontsLocked ? "bg-primary/10" : ""
                            }`}
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #d1d5db",
                              backgroundColor: fontsLocked
                                ? "rgba(79, 70, 229, 0.1)"
                                : "white",
                              color: "#4b5563",
                            }}
                          >
                            {fontsLocked ? (
                              <>
                                <LockClosedIcon className="h-3.5 w-3.5" />
                                <span>Locked</span>
                              </>
                            ) : (
                              <>
                                <LockOpenIcon className="h-3.5 w-3.5" />
                                <span>Unlocked</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="grid gap-6">
                          <div>
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "#374151" }}
                            >
                              Heading Font
                            </label>
                            <Select
                              value={fonts.heading}
                              onValueChange={(value) =>
                                handleFontChange("heading", value)
                              }
                            >
                              <SelectTrigger
                                className="w-full"
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #d1d5db",
                                  color: "#1f2937",
                                  borderRadius: "6px",
                                }}
                              >
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "6px",
                                  color: "#1a1a1a",
                                }}
                              >
                                {fontOptions.map((font) => (
                                  <SelectItem
                                    key={font}
                                    value={font}
                                    style={{
                                      fontFamily: font,
                                      color: "#374151",
                                    }}
                                  >
                                    {font}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "#374151" }}
                            >
                              Body Font
                            </label>
                            <Select
                              value={fonts.body}
                              onValueChange={(value) =>
                                handleFontChange("body", value)
                              }
                            >
                              <SelectTrigger
                                className="w-full"
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #d1d5db",
                                  color: "#1f2937",
                                  borderRadius: "6px",
                                }}
                              >
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "6px",
                                  color: "#1a1a1a",
                                }}
                              >
                                {fontOptions.map((font) => (
                                  <SelectItem
                                    key={font}
                                    value={font}
                                    style={{
                                      fontFamily: font,
                                      color: "#374151",
                                    }}
                                  >
                                    {font}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Typography
                </TooltipContent>
              </Tooltip>

              {/* Randomize Colors */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                    onClick={generateHarmonyColors}
                  >
                    <Shuffle size={18} />
                    <span className="sr-only">Randomize</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Randomize Colors
                </TooltipContent>
              </Tooltip>

              {/* Dark Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                  >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="sr-only">
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </TooltipContent>
              </Tooltip>

              {/* Export Theme */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExportMenuOpen(true)}
                    className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                  >
                    <Download size={18} />
                    <span className="sr-only">Export Theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-none"
                >
                  Export Theme
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ThemeDock), { ssr: false });
