import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Type,
  LockOpenIcon as LockClosedIcon,
  LockOpenIcon,
} from "lucide-react";
import { useThemeStore } from "@/lib/store";

export const ThemeTypography = ({ fontOptions }: { fontOptions: string[] }) => {
  const { fonts, updateFont } = useThemeStore();
  const [fontsLocked, setFontsLocked] = useState(false);

  // Handle font changes when fonts are locked or unlocked
  const handleFontChange = (key: "heading" | "body", value: string) => {
    if (fontsLocked) {
      // If fonts are locked, update both heading and body fonts
      updateFont("heading", value);
      updateFont("body", value);
    } else {
      // If fonts are unlocked, update only the specified font
      updateFont(key, value);
    }
  };

  return (
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
                <span className="font-medium" style={{ color: "#1a1a1a" }}>
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
            </PopoverContent>
          </Popover>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gray-900 text-white border-none">
        Typography
      </TooltipContent>
    </Tooltip>
  );
};
