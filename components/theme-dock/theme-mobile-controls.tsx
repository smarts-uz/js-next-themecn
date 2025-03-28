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
  Droplet,
  LayoutTemplate,
  Square,
  Palette,
  Sun,
  Moon,
  Download,
  Type,
} from "lucide-react";
import { useThemeStore } from "@/lib/store";

interface MobileMoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplatesClick: () => void;
  onBorderRadiusClick: () => void;
  onHarmonyClick: () => void;
  onThemesClick: () => void;
  onTypographyClick?: () => void;
}

export const ThemeMobileMore = ({
  isOpen,
  onOpenChange,
  onTemplatesClick,
  onBorderRadiusClick,
  onHarmonyClick,
  onThemesClick,
  onTypographyClick,
}: MobileMoreProps) => {
  const { isDarkMode, toggleDarkMode, setExportMenuOpen } = useThemeStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
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
                <span className="sr-only">More</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-2"
              side="top"
              align="end"
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
              <div className="grid grid-cols-3 gap-2 w-full">
                {/* Templates */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    onOpenChange(false);
                    onTemplatesClick();
                  }}
                >
                  <LayoutTemplate size={20} />
                  <span className="text-xs">Templates</span>
                </Button>

                {/* Border Radius */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    onOpenChange(false);
                    onBorderRadiusClick();
                  }}
                >
                  <Square size={20} />
                  <span className="text-xs">Border Radius</span>
                </Button>

                {/* Color Harmony */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    onOpenChange(false);
                    onHarmonyClick();
                  }}
                >
                  <Droplet size={20} />
                  <span className="text-xs">Color Harmony</span>
                </Button>

                {/* Themes */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    onOpenChange(false);
                    onThemesClick();
                  }}
                >
                  <Palette size={20} />
                  <span className="text-xs">Themes</span>
                </Button>

                {/* Typography */}
                {onTypographyClick && (
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                    onClick={() => {
                      onOpenChange(false);
                      onTypographyClick();
                    }}
                  >
                    <Type size={20} />
                    <span className="text-xs">Typography</span>
                  </Button>
                )}

                {/* Dark Mode */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    toggleDarkMode();
                    onOpenChange(false);
                  }}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="text-xs">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </Button>

                {/* Export */}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center space-y-1 h-20 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setExportMenuOpen(true);
                    onOpenChange(false);
                  }}
                >
                  <Download size={20} />
                  <span className="text-xs">Export</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gray-900 text-white border-none">
        More Options
      </TooltipContent>
    </Tooltip>
  );
};
