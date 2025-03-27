// Define theme-related types for the application

export type ColorKey =
  | "background"
  | "foreground"
  | "primary"
  | "secondary"
  | "accent"
  | "destructive"
  | "mutedForeground";

export interface BaseColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  destructive: string;
}

export type ColorKeyType = ColorKey;

export type ColorMode = "light" | "dark";

export type ThemeColorKey =
  | "foreground"
  | "background"
  | "primary"
  | "secondary"
  | "accent"
  | "mutedForeground";
export type FontKey = "heading" | "body";
export type ColorHarmony = "monochromatic";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

// Add these types and predefined themes to the store
export type ThemePreset = {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
  borderRadius?: number;
};

export interface ThemeState {
  colors: ThemeColors;
  darkColors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: number;
  isDarkMode: boolean;
  selectedHarmony: ColorHarmony;
  exportMenuOpen: boolean;
  shareMenuOpen: boolean;
  // Add this to the ThemeState interface
  predefinedThemes: ThemePreset[];
  currentTheme: string;
}
