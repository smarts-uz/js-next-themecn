import { useRouter, usePathname } from "next/navigation";
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
import { LayoutTemplate, Check } from "lucide-react";

export const ThemeTemplates = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Template navigation
  const templates = [
    { name: "Landing Page", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const navigateToTemplate = (path: string) => {
    // Get the current theme parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");

    // Append the theme parameter to the path if it exists
    const newPath = themeParam ? `${path}?theme=${themeParam}` : path;

    router.push(newPath);
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
                data-template-button="true"
              >
                <LayoutTemplate size={18} />
                <span className="sr-only">Templates</span>
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
                className="p-2 flex items-center"
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  color: "#1a1a1a",
                }}
              ></div>
              <div className="py-1">
                {templates.map((template) => (
                  <Button
                    key={template.path}
                    variant="ghost"
                    className="w-full justify-start text-left h-9 px-2 relative hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => navigateToTemplate(template.path)}
                    style={{
                      color: "#374151",
                      borderRadius: "0",
                    }}
                  >
                    <span>{template.name}</span>
                    {pathname === template.path && (
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
        Templates
      </TooltipContent>
    </Tooltip>
  );
};
