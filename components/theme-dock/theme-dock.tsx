"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useThemeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PaintBucket,
  Check,
  LockOpenIcon as LockClosedIcon,
  LockOpenIcon,
} from "lucide-react";
import { BorderRadiusControl } from "@/components/border-radius-control";
import { ExportMenu } from "@/components/export-menu";
import { ShareMenu } from "@/components/share-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import {
  LightDrawer,
  LightDrawerContent,
  LightDrawerHeader,
  LightDrawerTitle,
} from "@/components/ui/light-drawer";
import { ThemeColorPickers } from "@/components/theme-dock/theme-color-pickers";
import { ThemeTypography } from "@/components/theme-dock/theme-typography";
import { ThemeHarmonies } from "@/components/theme-dock/theme-harmonies";
import { ThemeBorderRadius } from "@/components/theme-dock/theme-border-radius";
import { ThemeUtilityControls } from "@/components/theme-dock/theme-utility-controls";
import { ThemeMobileMore } from "@/components/theme-dock/theme-mobile-controls";

type FontKey = "heading" | "body";

// Create a client-only version of the component to prevent hydration issues
const ThemeDock = () => {
  const {
    fonts,
    selectedHarmony,
    updateFont,
    setSelectedHarmony,
    setExportMenuOpen,
    shareMenuOpen,
    setShareMenuOpen,
  } = useThemeStore();

  const isMobile = useIsMobile();
  const [dockVisible, setDockVisible] = useState(true);
  const dockRef = useRef<HTMLDivElement>(null);
  const [fontsLocked, setFontsLocked] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const [mobileBorderRadiusOpen, setMobileBorderRadiusOpen] = useState(false);
  const [mobileHarmonyOpen, setMobileHarmonyOpen] = useState(false);
  const [mobileTypographyOpen, setMobileTypographyOpen] = useState(false);

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
  const fontOptions = useMemo(
    () => [
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
    ],
    []
  );

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
  }, [fontOptions]);

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

  // Add an effect to ensure popover is closed when any drawer is open
  useEffect(() => {
    if (mobileBorderRadiusOpen || mobileHarmonyOpen || mobileTypographyOpen) {
      setMobileMoreOpen(false);
    }
  }, [mobileBorderRadiusOpen, mobileHarmonyOpen, mobileTypographyOpen]);

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

  // Render mobile close button for drawer
  const MobileCloseButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="ghost"
      className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span className="sr-only">Close</span>
    </Button>
  );

  return (
    <>
      <ExportMenu />
      <ShareMenu open={shareMenuOpen} onOpenChange={setShareMenuOpen} />

      {/* Mobile drawers */}
      {isMobile && (
        <>
          {/* Border Radius Drawer */}
          <LightDrawer
            open={mobileBorderRadiusOpen}
            onOpenChange={(open) => setMobileBorderRadiusOpen(open)}
          >
            <LightDrawerContent className="bg-white border-t border-gray-200">
              <LightDrawerHeader>
                <LightDrawerTitle>Border Radius</LightDrawerTitle>
              </LightDrawerHeader>
              <div className="px-4 pb-6">
                <BorderRadiusControl />
              </div>
            </LightDrawerContent>
          </LightDrawer>

          {/* Color Harmony Drawer */}
          <LightDrawer
            open={mobileHarmonyOpen}
            onOpenChange={(open) => setMobileHarmonyOpen(open)}
          >
            <LightDrawerContent className="bg-white border-t border-gray-200">
              <LightDrawerHeader>
                <LightDrawerTitle>Color Harmony</LightDrawerTitle>
              </LightDrawerHeader>
              <div className="px-4 pb-6">
                <div className="py-1">
                  {harmonyOptions.map((harmony) => (
                    <Button
                      key={harmony.value}
                      variant="ghost"
                      className="w-full justify-start text-left h-12 px-3 mb-1 relative hover:bg-gray-100 hover:text-gray-900 rounded-md"
                      onClick={() => {
                        setSelectedHarmony(harmony.value);
                        setMobileHarmonyOpen(false);
                      }}
                    >
                      <span>{harmony.name}</span>
                      {selectedHarmony === harmony.value && (
                        <Check
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </LightDrawerContent>
          </LightDrawer>

          {/* Typography Drawer */}
          <LightDrawer
            open={mobileTypographyOpen}
            onOpenChange={(open) => setMobileTypographyOpen(open)}
          >
            <LightDrawerContent className="bg-white border-t border-gray-200">
              <LightDrawerHeader>
                <LightDrawerTitle>Typography</LightDrawerTitle>
              </LightDrawerHeader>
              <div className="px-4 pb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium" style={{ color: "#1a1a1a" }}>
                    Typography
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setFontsLocked(!fontsLocked)}
                    style={{ borderRadius: "4px" }}
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
                      onValueChange={(value) => handleFontChange("body", value)}
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
              </div>
            </LightDrawerContent>
          </LightDrawer>
        </>
      )}

      {/* Main dock container */}
      <div className="fixed bottom-4 left-0 right-0 z-50">
        <div
          ref={dockRef}
          className={`mx-auto max-w-fit px-4 transition-all duration-300 ${
            dockVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <TooltipProvider>
            <div className="bg-[#f5f5f5] backdrop-blur-xl border border-gray-200 rounded-full shadow-lg p-1.5 flex items-center gap-2">
              {isMobile ? (
                // Mobile layout
                <>
                  {/* All main color pickers */}
                  <ThemeColorPickers />

                  <div className="h-5 w-px bg-gray-200" />

                  {/* Randomize button */}
                  <ThemeUtilityControls
                    onExportClick={() => setExportMenuOpen(true)}
                    showRandomizeOnly={true}
                  />

                  <div className="h-5 w-px bg-gray-200"></div>

                  {/* More options menu */}
                  {!mobileBorderRadiusOpen &&
                  !mobileHarmonyOpen &&
                  !mobileTypographyOpen ? (
                    <ThemeMobileMore
                      isOpen={mobileMoreOpen}
                      onOpenChange={setMobileMoreOpen}
                      onBorderRadiusClick={() =>
                        setMobileBorderRadiusOpen(true)
                      }
                      onHarmonyClick={() => setMobileHarmonyOpen(true)}
                      onTypographyClick={() => setMobileTypographyOpen(true)}
                    />
                  ) : (
                    <MobileCloseButton
                      onClick={() => {
                        setMobileMoreOpen(false);
                        setMobileBorderRadiusOpen(false);
                        setMobileHarmonyOpen(false);
                        setMobileTypographyOpen(false);
                      }}
                    />
                  )}
                </>
              ) : (
                // Desktop layout
                <>
                  {/* Color pickers */}
                  <ThemeColorPickers />

                  <div className="h-5 w-px bg-gray-200"></div>

                  {/* Color Harmony Selector */}
                  <ThemeHarmonies />

                  {/* Border Radius */}
                  <ThemeBorderRadius />

                  {/* Fonts */}
                  <ThemeTypography fontOptions={fontOptions} />

                  {/* Utility Controls */}
                  <ThemeUtilityControls
                    onExportClick={() => setExportMenuOpen(true)}
                  />
                </>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ThemeDock), { ssr: false });
