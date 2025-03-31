import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Type, MoreVertical, Ruler, Upload } from "lucide-react";

export interface MobileMoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBorderRadiusClick: () => void;
  onHarmonyClick: () => void;
  onTypographyClick: () => void;
  onImportClick?: () => void;
}

export const ThemeMobileMore = ({
  isOpen,
  onOpenChange,
  onBorderRadiusClick,
  onHarmonyClick,
  onTypographyClick,
  onImportClick,
}: MobileMoreProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
        >
          <MoreVertical size={18} />
          <span className="sr-only">More Options</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-50 rounded-md p-0 border border-gray-200"
        side="top"
        align="end"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="py-1">
          {onImportClick && (
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              onClick={() => {
                onImportClick();
                onOpenChange(false);
              }}
              style={{
                color: "#374151",
                borderRadius: "0",
              }}
            >
              <div className="flex items-center gap-2">
                <Upload size={16} />
                <span>Import Theme</span>
              </div>
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            onClick={() => {
              onBorderRadiusClick();
              onOpenChange(false);
            }}
            style={{
              color: "#374151",
              borderRadius: "0",
            }}
          >
            <div className="flex items-center gap-2">
              <Ruler size={16} />
              <span>Border Radius</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            onClick={() => {
              onHarmonyClick();
              onOpenChange(false);
            }}
            style={{
              color: "#374151",
              borderRadius: "0",
            }}
          >
            <div className="flex items-center gap-2">
              <Palette size={16} />
              <span>Color Harmony</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            onClick={() => {
              onTypographyClick();
              onOpenChange(false);
            }}
            style={{
              color: "#374151",
              borderRadius: "0",
            }}
          >
            <div className="flex items-center gap-2">
              <Type size={16} />
              <span>Typography</span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
