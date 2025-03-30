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
import { Square } from "lucide-react";
import { BorderRadiusControl } from "@/components/border-radius-control";

export const ThemeBorderRadius = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                data-border-radius-button="true"
              >
                <Square size={18} />
                <span className="sr-only">Border Radius</span>
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
              <div className="mb-2 font-medium" style={{ color: "#1a1a1a" }}>
                Border Radius
              </div>
              <BorderRadiusControl />
            </PopoverContent>
          </Popover>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-gray-900 text-white border-none">
        Border Radius
      </TooltipContent>
    </Tooltip>
  );
};
