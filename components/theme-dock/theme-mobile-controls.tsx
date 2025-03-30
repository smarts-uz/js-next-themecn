import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Type, MoreVertical, Ruler } from "lucide-react";

export interface MobileMoreProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBorderRadiusClick: () => void;
  onHarmonyClick: () => void;
  onTypographyClick: () => void;
}

export const ThemeMobileMore = ({
  isOpen,
  onOpenChange,
  onBorderRadiusClick,
  onHarmonyClick,
  onTypographyClick,
}: MobileMoreProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
        >
          <MoreVertical size={18} />
          <span className="sr-only">More options</span>
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
          <span className="font-medium">More Options</span>
        </div>
        <div className="py-1">
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
