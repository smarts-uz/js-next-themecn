"use client";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useEffect, Suspense } from "react";
import { getThemeFromUrl } from "@/lib/theme-url";
import { useThemeStore } from "@/lib/store";

function ThemeProviderContent({ children, ...props }: ThemeProviderProps) {
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

export function ThemeProvider(props: ThemeProviderProps) {
  return (
    <Suspense>
      <ThemeProviderContent {...props} />
    </Suspense>
  );
}
