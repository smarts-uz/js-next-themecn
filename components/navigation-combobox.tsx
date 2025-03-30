"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navigationOptions = [
  {
    value: "/",
    label: "Landing",
  },
  {
    value: "/dashboard",
    label: "Dashboard",
  },
];

export function NavigationCombobox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const theme = searchParams.get("theme");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(pathname);

  React.useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  const handleSelect = (currentValue: string) => {
    const newUrl =
      theme !== null ? `${currentValue}?theme=${theme}` : currentValue;
    setValue(newUrl);
    setOpen(false);
    router.push(newUrl);
  };

  // Find the matching route by checking if the pathname starts with the route's value
  const findMatchingRoute = () => {
    const route = navigationOptions.find(
      (option) =>
        pathname === option.value || // Exact match
        (pathname.startsWith(option.value) && option.value !== "/") // Starts with but not homepage
    );

    // Special case for homepage
    if (!route && pathname === "/") {
      return navigationOptions.find((option) => option.value === "/");
    }

    return route;
  };

  const matchingRoute = findMatchingRoute();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[160px] justify-between cursor-pointer"
        >
          {matchingRoute?.label || "Navigate"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {navigationOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
