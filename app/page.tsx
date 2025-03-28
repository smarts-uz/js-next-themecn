"use client";
import { useEffect } from "react";
import LandingPage from "@/components/landing-page";
import ThemeDock from "@/components/theme-dock/theme-dock";
import { useThemeStore } from "@/lib/store";
import { getThemeFromUrl } from "@/lib/theme-url";

export default function Home() {
  // Apply theme from URL on client-side navigation
  useEffect(() => {
    try {
      // Get theme from URL
      const urlTheme = getThemeFromUrl();
      const store = useThemeStore.getState();

      if (urlTheme) {
        console.log("Applying theme from URL");
        // Apply the entire theme state at once
        store.applyThemeState(urlTheme);

        // Explicitly handle dark mode class
        if (urlTheme.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // No theme in URL, explicitly apply the default theme
        console.log("No theme in URL, applying default theme");
        store.resetTheme();
      }
    } catch (error) {
      console.error("Error applying theme from URL:", error);
    }
  }, []);

  return (
    <main className="min-h-screen">
      <LandingPage />
      <ThemeDock />
    </main>
  );
}
