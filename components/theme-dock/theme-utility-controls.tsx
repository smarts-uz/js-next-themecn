import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle, Sun, Moon, Download, Upload } from "lucide-react";
import { useThemeStore } from "@/lib/store";
import { useState } from "react";
import { ImportMenu } from "@/components/import-menu";

interface Props {
  onExportClick: () => void;
  showRandomizeOnly?: boolean;
}

export const ThemeUtilityControls = ({
  onExportClick,
  showRandomizeOnly = false,
}: Props) => {
  const { isDarkMode, toggleDarkMode, generateHarmonyColors } = useThemeStore();
  const [importMenuOpen, setImportMenuOpen] = useState(false);

  // If showRandomizeOnly is true, only render the Randomize button
  if (showRandomizeOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
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
      {/* Import Menu Component */}
      <ImportMenu open={importMenuOpen} onOpenChange={setImportMenuOpen} />

      {/* Randomize Colors */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
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
            className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
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

      {/* Import Theme Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
            onClick={() => setImportMenuOpen(true)}
          >
            <Upload size={18} />
            <span className="sr-only">Import Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Import Theme
        </TooltipContent>
      </Tooltip>

      {/* Export Theme */}
      {!showRandomizeOnly && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
              onClick={onExportClick}
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
      )}
    </>
  );
};
