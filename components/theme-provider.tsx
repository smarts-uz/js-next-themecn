"use client";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useEffect } from "react";
import { getThemeFromUrl } from "@/lib/theme-url";
import { useThemeStore } from "@/lib/store";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    const urlTheme = getThemeFromUrl();

    if (urlTheme) {
      const store = useThemeStore.getState();
      // Apply theme from URL
      store.applyThemeState(urlTheme);

      // Explicitly handle dark mode class
      if (urlTheme.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <NextThemesProvider defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}
