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

interface ThemeColorPickersProps {
  showPrimaryOnly?: boolean;
}

export const ThemeColorPickers = ({
  showPrimaryOnly = false,
}: ThemeColorPickersProps) => {
  const { updateThemeColor, getHexColor } = useThemeStore();

  // Handle color change and update theme
  const handleColorChange = (
    colorKey: "primary" | "secondary" | "background" | "foreground",
    color: string
  ) => {
    // Normalize color format (ensure lowercase hex)
    const normalizedColor = color.toLowerCase();

    // Ensure the color is a valid hex format
    if (/^#[0-9a-f]{6}$/i.test(normalizedColor)) {
      // Get current color for comparison
      const currentColor = getHexColor(colorKey).toLowerCase();

      // Calculate color difference to prevent insignificant updates
      const isDifferentEnough = isColorDifferentEnough(
        normalizedColor,
        currentColor
      );

      // Only update if the color actually changed and the difference is significant
      if (normalizedColor !== currentColor && isDifferentEnough) {
        console.log(
          `Updating ${colorKey} from ${currentColor} to ${normalizedColor}`
        );
        updateThemeColor(colorKey, normalizedColor);
      }
    } else {
      console.warn(`Invalid color format: ${color}`);
    }
  };

  // Helper function to check if colors are different enough to warrant an update
  // This prevents minor rounding issues from causing unnecessary updates
  const isColorDifferentEnough = (color1: string, color2: string): boolean => {
    // If they're exactly the same, no need to update
    if (color1 === color2) return false;

    // Parse hex colors to RGB
    const parseHex = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb1 = parseHex(color1);
    const rgb2 = parseHex(color2);

    // Calculate squared difference for each channel
    const rDiff = Math.pow(rgb1.r - rgb2.r, 2);
    const gDiff = Math.pow(rgb1.g - rgb2.g, 2);
    const bDiff = Math.pow(rgb1.b - rgb2.b, 2);

    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(rDiff + gDiff + bDiff);

    // Return true if distance exceeds threshold (values below 2 are barely perceptible)
    return distance > 1.5;
  };

  // If showPrimaryOnly is true, only render the Primary Color picker
  if (showPrimaryOnly) {
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
                  onChange={(color) => handleColorChange("primary", color)}
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
    );
  }

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
                  onChange={(color) => handleColorChange("foreground", color)}
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
                  onChange={(color) => handleColorChange("background", color)}
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
                  onChange={(color) => handleColorChange("primary", color)}
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
      {/* <Tooltip>
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
      </Tooltip> */}

      {/* Accent Color */}
      {/* <Tooltip>
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
      </Tooltip> */}
    </>
  );
};
