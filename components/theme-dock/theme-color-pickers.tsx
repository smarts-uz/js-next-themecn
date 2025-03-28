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
import { ColorPicker } from "@/components/color-picker";
import { useThemeStore } from "@/lib/store";

export const ThemeColorPickers = () => {
  const { updateThemeColor, getHexColor } = useThemeStore();

  return (
    <>
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
                  onChange={(color) => updateThemeColor("foreground", color)}
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
                  onChange={(color) => updateThemeColor("background", color)}
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
                  onChange={(color) => updateThemeColor("primary", color)}
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
                  onChange={(color) => updateThemeColor("secondary", color)}
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
                  onChange={(color) => updateThemeColor("accent", color)}
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
    </>
  );
};
