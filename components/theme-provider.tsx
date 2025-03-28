"use client";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useState, useEffect } from "react";
import { ThemeLoading } from "./theme-loading";
import { getThemeFromUrl } from "@/lib/theme-url";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // Check if there's a theme in the URL
    const urlTheme = getThemeFromUrl();

    // Apply theme and hide loader after a minimum delay
    const timer = setTimeout(
      () => {
        setIsLoading(false);
      },
      urlTheme ? 1000 : 500
    ); // Longer delay if loading from URL

    return () => clearTimeout(timer);
  }, []);

  // Show only the loading indicator until theme is ready
  if (isLoading) {
    return <ThemeLoading />;
  }

  return (
    <NextThemesProvider defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
}
