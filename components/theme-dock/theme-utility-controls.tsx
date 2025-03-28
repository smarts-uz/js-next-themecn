import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle, Sun, Moon, Download } from "lucide-react";
import { useThemeStore } from "@/lib/store";

interface Props {
  onExportClick: () => void;
  showRandomizeOnly?: boolean;
}

export const ThemeUtilityControls = ({
  onExportClick,
  showRandomizeOnly = false,
}: Props) => {
  const { isDarkMode, toggleDarkMode, generateHarmonyColors } = useThemeStore();

  // If showRandomizeOnly is true, only render the Randomize button
  if (showRandomizeOnly) {
    return (
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
    );
  }

  return (
    <>
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
            onClick={onExportClick}
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
    </>
  );
};
