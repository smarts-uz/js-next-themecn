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
import { Palette, Check, Plus } from "lucide-react";
import { useThemeStore } from "@/lib/store";

interface Props {
  onSaveThemeClick: () => void;
}

export const ThemePresets = ({ onSaveThemeClick }: Props) => {
  const { predefinedThemes, currentTheme, setCurrentTheme } = useThemeStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200"
                data-themes-button="true"
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
                  onClick={onSaveThemeClick}
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
                    style={{
                      color: "#374151",
                      borderRadius: "0",
                    }}
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
      <TooltipContent side="top" className="bg-gray-900 text-white border-none">
        Theme Presets
      </TooltipContent>
    </Tooltip>
  );
};
