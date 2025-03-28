import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ThemeColorKey,
  ThemeColors,
  ThemeState,
  FontKey,
  ColorHarmony,
  ThemePreset,
} from "@/types/theme";

// Convert RGB to OKLCH
function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  // Convert RGB to linear RGB
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

  // Convert XYZ to Lab
  const lab = xyzToLab(x, y, z);

  // Convert Lab to LCH
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: lab.l, c, h };
}

// Convert XYZ to Lab
function xyzToLab(
  x: number,
  y: number,
  z: number
): { l: number; a: number; b: number } {
  // D65 reference white
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  // Convert XYZ to Lab
  const fx =
    x > 0.008856 ? Math.pow(x / xn, 1 / 3) : (7.787 * x) / xn + 16 / 116;
  const fy =
    y > 0.008856 ? Math.pow(y / yn, 1 / 3) : (7.787 * y) / yn + 16 / 116;
  const fz =
    z > 0.008856 ? Math.pow(z / zn, 1 / 3) : (7.787 * z) / zn + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { l, a, b };
}

// Convert OKLCH to RGB
function oklchToRgb(
  l: number,
  c: number,
  h: number
): { r: number; g: number; b: number } {
  // Convert LCH to Lab
  const a = c * Math.cos((h * Math.PI) / 180);
  const bValue = c * Math.sin((h * Math.PI) / 180);

  // Convert Lab to XYZ
  const xyz = labToXyz(l, a, bValue);

  // Convert XYZ to RGB
  return xyzToRgb(xyz.x, xyz.y, xyz.z);
}

// Convert Lab to XYZ
function labToXyz(
  l: number,
  a: number,
  b: number
): { x: number; y: number; z: number } {
  // D65 reference white
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const x =
    fx > 0.206893 ? xn * Math.pow(fx, 3) : ((fx - 16 / 116) / 7.787) * xn;
  const y =
    fy > 0.206893 ? yn * Math.pow(fy, 3) : ((fy - 16 / 116) / 7.787) * yn;
  const z =
    fz > 0.206893 ? zn * Math.pow(fz, 3) : ((fz - 16 / 116) / 7.787) * zn;

  return { x, y, z };
}

// Convert XYZ to RGB
function xyzToRgb(
  x: number,
  y: number,
  z: number
): { r: number; g: number; b: number } {
  // Convert XYZ to linear RGB
  let r = 3.2406 * x - 1.5372 * y - 0.4986 * z;
  let g = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  let b = 0.0557 * x - 0.204 * y + 1.057 * z;

  // Apply gamma correction
  r = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  g = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
  b = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

  // Clamp and convert to 0-255
  r = Math.max(0, Math.min(1, r)) * 255;
  g = Math.max(0, Math.min(1, g)) * 255;
  b = Math.max(0, Math.min(1, b)) * 255;

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

// Convert hex to OKLCH string for URL
export function hexToOklchString(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Convert to OKLCH
  const oklch = rgbToOklch(r, g, b);

  // Format for URL (compact representation)
  return `${Math.round(oklch.l)}.${Math.round(oklch.c)}.${Math.round(oklch.h)}`;
}

// Convert OKLCH string from URL to hex
export function oklchStringToHex(oklch: string): string {
  // Parse the OKLCH values
  const [l, c, h] = oklch.split(".").map(Number);

  // Convert to RGB
  const rgb = oklchToRgb(l, c, h);

  // Convert to hex
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// Convert hex to HSL string format for shadcn
function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 3) {
    r = Number.parseInt(hex[0] + hex[0], 16);
    g = Number.parseInt(hex[1] + hex[1], 16);
    b = Number.parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = Number.parseInt(hex.substring(0, 2), 16);
    g = Number.parseInt(hex.substring(2, 4), 16);
    b = Number.parseInt(hex.substring(4, 6), 16);
  }

  // Convert RGB to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to degrees, percentage, percentage
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Convert HSL to hex
function hslToHex(hsl: string): string {
  try {
    const [h, s, l] = hsl
      .split(" ")
      .map((part) => Number.parseFloat(part.replace("%", "")));

    const hDecimal = h / 360;
    const sDecimal = s / 100;
    const lDecimal = l / 100;

    let r, g, b;

    if (sDecimal === 0) {
      r = g = b = lDecimal;
    } else {
      const q =
        lDecimal < 0.5
          ? lDecimal * (1 + sDecimal)
          : lDecimal + sDecimal - lDecimal * sDecimal;
      const p = 2 * lDecimal - q;

      r = hueToRgb(p, q, hDecimal + 1 / 3);
      g = hueToRgb(p, q, hDecimal);
      b = hueToRgb(p, q, hDecimal - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (e) {
    console.error("Error converting HSL to hex:", e);
    return "#000000";
  }
}

const hueToRgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// Generate a contrasting color in HSL format
function getContrastHSL(hsl: string): string {
  const [h, s, l] = hsl
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // For simplicity, we'll just adjust the lightness for contrast
  const newL = l > 50 ? 10 : 98;

  return `${h} ${s}% ${newL}%`;
}

// Add this new function to calculate a contrasting color based on the background color
// Add this after the existing getContrastHSL function

// Calculate a contrasting color that ensures good readability
function calculateContrastingColor(
  hsl: string,
  colorKey?: ThemeColorKey
): string {
  try {
    const [h, s, l] = hsl
      .split(" ")
      .map((part) => Number.parseFloat(part.replace("%", "")));

    let newL: number;

    // Adjust lightness specifically for muted-foreground
    if (colorKey === "mutedForeground") {
      newL = l > 60 ? Math.max(l - 40, 10) : Math.min(l + 40, 50); // Ensure it's always a bit darker
    } else {
      // For very light colors (high lightness), use a dark foreground
      // For dark colors (low lightness), use a light foreground
      // The threshold of 60% is a common accessibility guideline
      newL = l > 60 ? 10 : 95;
    }

    // For very saturated colors, we might want todesaturate the foreground slightly
    const newS = s > 70 ? 10 : s;

    return `${h} ${newS}% ${newL}%`;
  } catch (e) {
    console.error("Error calculating contrasting color:", e);
    return "0 0% 100%"; // Default to white as a fallback
  }
}

// Let's add a helper function to ensure consistent dark mode colors
// Add this function after the calculateContrastingColor function (around line 200):

// Ensure consistent dark mode colors derived from light mode colors
function deriveDarkModeColors(lightColors: ThemeColors): ThemeColors {
  const darkColors = { ...lightColors }; // Start with a copy

  // Extract color components from primary color
  const [primaryH, primaryS, primaryL] = lightColors.primary
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // Extract color components from secondary color
  const [secondaryH, secondaryS, secondaryL] = lightColors.secondary
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // Extract color components from accent color
  const [accentH, accentS, accentL] = lightColors.accent
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // Create a dark background with the same hue as the primary
  darkColors.background = `${primaryH} 30% 8%`;

  // Card and popover slightly lighter than background
  darkColors.card = `${primaryH} 30% 12%`;
  darkColors.popover = darkColors.card;

  // Light foreground with slight tint from primary hue
  darkColors.foreground = `${primaryH} 10% 95%`;
  darkColors.cardForeground = darkColors.foreground;
  darkColors.popoverForeground = darkColors.foreground;

  // For primary color, preserve the original hue and saturation but adjust lightness
  // Keep primary vibrant in dark mode - don't dim it too much
  darkColors.primary = `${primaryH} ${Math.max(primaryS, 60)}% ${Math.min(
    Math.max(primaryL, 50),
    60
  )}%`;
  darkColors.ring = darkColors.primary;

  // Primary foreground should contrast with the bright primary
  darkColors.primaryForeground = calculateContrastingColor(darkColors.primary);

  // Secondary color - darker and more subdued
  darkColors.secondary = `${secondaryH} ${Math.max(secondaryS, 10)}% ${Math.max(
    15,
    Math.min(25, secondaryL - 70)
  )}%`;
  darkColors.secondaryForeground = calculateContrastingColor(
    darkColors.secondary
  );

  // Muted color based on secondary
  darkColors.muted = darkColors.secondary;
  darkColors.mutedForeground = `${secondaryH} 15% 65%`;

  // Accent color - preserve hue but adjust for dark mode
  darkColors.accent = `${accentH} ${Math.max(accentS, 60)}% ${Math.min(
    Math.max(accentL - 20, 40),
    60
  )}%`;
  darkColors.accentForeground = calculateContrastingColor(darkColors.accent);

  // Border colors
  darkColors.border = `${primaryH} 25% 18%`;
  darkColors.input = darkColors.border;

  // Sidebar colors
  darkColors.sidebar = darkColors.background;
  darkColors.sidebarForeground = darkColors.foreground;
  darkColors.sidebarPrimary = darkColors.primary;
  darkColors.sidebarPrimaryForeground = darkColors.primaryForeground;
  darkColors.sidebarAccent = darkColors.accent;
  darkColors.sidebarAccentForeground = darkColors.accentForeground;
  darkColors.sidebarBorder = darkColors.border;
  darkColors.sidebarRing = darkColors.ring;

  // Generate monochromatic chart colors for dark mode
  const chartColors = generateChartColors(
    darkColors.primary,
    darkColors.secondary,
    darkColors.accent,
    true
  );
  darkColors.chart1 = chartColors.chart1;
  darkColors.chart2 = chartColors.chart2;
  darkColors.chart3 = chartColors.chart3;
  darkColors.chart4 = chartColors.chart4;
  darkColors.chart5 = chartColors.chart5;

  return darkColors;
}

function generateChartColors(
  primary: string,
  secondary: string,
  accent: string,
  isDarkMode = false
): {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
} {
  // Extract color components from primary color
  const [primaryH, primaryS, primaryL] = primary
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // For monochromatic theme, use the same hue with different lightness/saturation levels
  // This ensures the chart colors are truly monochromatic
  if (isDarkMode) {
    // For dark mode, create more vibrant, higher contrast monochromatic colors
    return {
      chart1: primary, // Primary color as is
      chart2: `${primaryH} ${Math.min(primaryS + 5, 90)}% ${Math.min(
        primaryL + 15,
        70
      )}%`, // Lighter, more saturated
      chart3: `${primaryH} ${Math.min(primaryS + 10, 95)}% ${Math.min(
        primaryL + 25,
        80
      )}%`, // Even lighter
      chart4: `${primaryH} ${Math.max(primaryS - 10, 40)}% ${Math.max(
        primaryL - 15,
        30
      )}%`, // Darker, less saturated
      chart5: `${primaryH} ${Math.max(primaryS - 20, 30)}% ${Math.max(
        primaryL - 25,
        20
      )}%`, // Even darker
    };
  } else {
    // For light mode, create a monochromatic palette
    return {
      chart1: primary, // Primary color as is
      chart2: `${primaryH} ${Math.max(primaryS - 15, 30)}% ${Math.min(
        primaryL + 15,
        75
      )}%`, // Lighter, less saturated
      chart3: `${primaryH} ${Math.max(primaryS - 30, 20)}% ${Math.min(
        primaryL + 25,
        85
      )}%`, // Even lighter
      chart4: `${primaryH} ${Math.min(primaryS + 10, 90)}% ${Math.max(
        primaryL - 15,
        25
      )}%`, // Darker, more saturated
      chart5: `${primaryH} ${Math.min(primaryS + 5, 85)}% ${Math.max(
        primaryL - 25,
        20
      )}%`, // Even darker
    };
  }
}

// Generate a random hex color
function getRandomHexColor(): string {
  const hex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `#${hex}`;
}

// Apply CSS variables to the document
function applyCSSVariables(
  colors: ThemeColors,
  borderRadius: number,
  fonts: { heading: string; body: string }
) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Apply OKLCH values directly to CSS variables
  // Format the CSS variable names to match the OKLCH variables in globals.css

  // Map the theme colors to the correct CSS variables
  root.style.setProperty("--background", formatToOklch(colors.background));
  root.style.setProperty("--foreground", formatToOklch(colors.foreground));
  root.style.setProperty("--card", formatToOklch(colors.card));
  root.style.setProperty(
    "--card-foreground",
    formatToOklch(colors.cardForeground)
  );
  root.style.setProperty("--popover", formatToOklch(colors.popover));
  root.style.setProperty(
    "--popover-foreground",
    formatToOklch(colors.popoverForeground)
  );
  root.style.setProperty("--primary", formatToOklch(colors.primary));
  root.style.setProperty(
    "--primary-foreground",
    formatToOklch(colors.primaryForeground)
  );
  root.style.setProperty("--secondary", formatToOklch(colors.secondary));
  root.style.setProperty(
    "--secondary-foreground",
    formatToOklch(colors.secondaryForeground)
  );
  root.style.setProperty("--muted", formatToOklch(colors.muted));
  root.style.setProperty(
    "--muted-foreground",
    formatToOklch(colors.mutedForeground)
  );
  root.style.setProperty("--accent", formatToOklch(colors.accent));
  root.style.setProperty(
    "--accent-foreground",
    formatToOklch(colors.accentForeground)
  );
  root.style.setProperty("--destructive", formatToOklch(colors.destructive));
  root.style.setProperty(
    "--destructive-foreground",
    formatToOklch(colors.destructiveForeground)
  );
  root.style.setProperty("--border", formatToOklch(colors.border));
  root.style.setProperty("--input", formatToOklch(colors.input));
  root.style.setProperty("--ring", formatToOklch(colors.ring));

  // Chart colors
  root.style.setProperty("--chart-1", formatToOklch(colors.chart1));
  root.style.setProperty("--chart-2", formatToOklch(colors.chart2));
  root.style.setProperty("--chart-3", formatToOklch(colors.chart3));
  root.style.setProperty("--chart-4", formatToOklch(colors.chart4));
  root.style.setProperty("--chart-5", formatToOklch(colors.chart5));

  // Sidebar colors
  root.style.setProperty("--sidebar", formatToOklch(colors.sidebar));
  root.style.setProperty(
    "--sidebar-foreground",
    formatToOklch(colors.sidebarForeground)
  );
  root.style.setProperty(
    "--sidebar-primary",
    formatToOklch(colors.sidebarPrimary)
  );
  root.style.setProperty(
    "--sidebar-primary-foreground",
    formatToOklch(colors.sidebarPrimaryForeground)
  );
  root.style.setProperty(
    "--sidebar-accent",
    formatToOklch(colors.sidebarAccent)
  );
  root.style.setProperty(
    "--sidebar-accent-foreground",
    formatToOklch(colors.sidebarAccentForeground)
  );
  root.style.setProperty(
    "--sidebar-border",
    formatToOklch(colors.sidebarBorder)
  );
  root.style.setProperty("--sidebar-ring", formatToOklch(colors.sidebarRing));

  // Set border radius
  root.style.setProperty("--radius", `${borderRadius / 16}rem`);

  // Set font families
  root.style.setProperty("--font-heading", fonts.heading);
  root.style.setProperty("--font-body", fonts.body);
}

// Convert HSL values to OKLCH for CSS variables
function formatToOklch(hslValue: string): string {
  // This is a simplified mapping - in production you'd use proper color space conversion
  const parts = hslValue.split(" ");
  const h = parseInt(parts[0] || "0");
  const s = parseInt((parts[1] || "0%").replace("%", "")) / 100;
  const l = parseInt((parts[2] || "0%").replace("%", "")) / 100;

  // Simple mapping for now
  // 1. For lightness in OKLCH, map directly but keep in 0-1 range
  const oklchL = l.toFixed(3);

  // 2. For chroma, derive from saturation (0-0.3 range in OKLCH)
  const oklchC = (s * 0.3).toFixed(3);

  // 3. Hue can be directly mapped (both use degrees)
  const oklchH = h;

  return `oklch(${oklchL} ${oklchC} ${oklchH})`;
}

// Find the defaultTheme object and replace the colors with these new values:

// Also update the defaultTheme to match the examples more closely:

// Updated default theme with a more vibrant primary color and neutral secondary/accent
const defaultTheme: ThemeState = {
  colors: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    card: "0 0% 100%",
    cardForeground: "240 10% 3.9%",
    popover: "0 0% 100%",
    popoverForeground: "240 10% 3.9%",
    primary: "262.1 83.3% 57.8%",
    primaryForeground: "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    secondaryForeground: "240 5.9% 10%",
    muted: "240 4.8% 95.9%",
    mutedForeground: "240 3.8% 46.1%",
    accent: "262.1 55% 88%", // Much lighter version of primary color
    accentForeground: "240 5.9% 10%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "262.1 83.3% 57.8%",
    chart1: "262.1 83.3% 57.8%", // Primary color
    chart2: "173 58% 39%",
    chart3: "197 37% 24%",
    chart4: "43 74% 66%",
    chart5: "27 87% 67%",
    sidebar: "240 4.8% 95.9%",
    sidebarForeground: "240 5.9% 10%",
    sidebarPrimary: "262.1 83.3% 57.8%",
    sidebarPrimaryForeground: "0 0% 98%",
    sidebarAccent: "262.1 55% 88%", // Matching the updated accent
    sidebarAccentForeground: "240 5.9% 10%",
    sidebarBorder: "240 5.9% 90%",
    sidebarRing: "262.1 83.3% 57.8%",
  },

  darkColors: {
    background: "220 30% 10%", // Dark blue-gray
    foreground: "220 15% 95%", // Light gray with slight blue tint
    card: "220 30% 13%", // Slightly lighter than background
    cardForeground: "220 15% 95%", // Same as foreground
    popover: "220 30% 13%", // Same as card
    popoverForeground: "220 15% 95%", // Same as foreground
    primary: "262.1 83.3% 58%", // Keep primary vibrant (purple)
    primaryForeground: "0 0% 100%", // White text on primary
    secondary: "220 25% 20%", // Dark muted blue-gray
    secondaryForeground: "220 15% 95%", // Light text
    muted: "220 25% 20%", // Same as secondary
    mutedForeground: "220 15% 65%", // Medium gray for muted text
    accent: "262.1 83.3% 58%", // Same as primary for consistency
    accentForeground: "0 0% 100%", // White text on accent
    destructive: "0 70% 45%", // Dark red
    destructiveForeground: "0 0% 100%", // White text on destructive
    border: "220 25% 18%", // Slightly lighter than background
    input: "220 25% 18%", // Same as border
    ring: "262.1 83.3% 58%", // Same as primary
    chart1: "262.1 83.3% 58%", // Primary (purple)
    chart2: "330 80% 60%", // Pink
    chart3: "180 80% 50%", // Teal
    chart4: "40 80% 60%", // Gold
    chart5: "120 70% 50%", // Green
    sidebar: "220 30% 10%", // Same as background
    sidebarForeground: "220 15% 95%", // Same as foreground
    sidebarPrimary: "262.1 83.3% 58%", // Same as primary
    sidebarPrimaryForeground: "0 0% 100%", // White text
    sidebarAccent: "262.1 83.3% 58%", // Same as accent
    sidebarAccentForeground: "0 0% 100%", // White text
    sidebarBorder: "220 25% 18%", // Same as border
    sidebarRing: "262.1 83.3% 58%", // Same as ring
  },
  fonts: {
    heading: "Geist",
    body: "Geist",
  },
  borderRadius: 8,
  isDarkMode: false,
  selectedHarmony: "monochromatic",
  exportMenuOpen: false,
  shareMenuOpen: false,
  // Update the first predefined theme to match our new default
  predefinedThemes: [
    {
      name: "Default",
      colors: {
        background: "#ffffff",
        foreground: "#0f0f0f",
        primary: "#8b5cf6",
        secondary: "#f5f5f5",
        accent: "#ddd6fe", // Very light purple to match our updated HSL accent color
        chart1: "#8b5cf6", // Same as primary
        chart2: "#1ea896", // Complementary-ish
        chart3: "#0f3c4c", // Triadic-ish
        chart4: "#e6b422", // Analogous
        chart5: "#f97316", // Analogous
      },
      fonts: {
        heading: "Geist",
        body: "Geist",
      },
    },
    {
      name: "Midnight",
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        primary: "#3b82f6",
        secondary: "#1e40af",
        accent: "#60a5fa",
        chart1: "#3b82f6", // Same as primary
        chart2: "#2a61d2", // Blend between primary and secondary
        chart3: "#1e40af", // Same as secondary
        chart4: "#3f73d4", // Blend between secondary and accent
        chart5: "#60a5fa", // Same as accent
      },
    },
    {
      name: "Forest",
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        primary: "#16a34a",
        secondary: "#f1f5f1",
        accent: "#22c55e",
        chart1: "#16a34a", // Same as primary
        chart2: "#4ec77b", // Blend between primary and secondary
        chart3: "#86efac", // Same as secondary
        chart4: "#54da85", // Blend between secondary and accent
        chart5: "#22c55e", // Same as accent
      },
    },
    {
      name: "Sunset",
      colors: {
        background: "#fffbeb",
        foreground: "#1e293b",
        primary: "#f59e0b",
        secondary: "#fef9ed",
        accent: "#d97706",
        chart1: "#f59e0b", // Same as primary
        chart2: "#f8b82c", // Blend between primary and secondary
        chart3: "#fcd34d", // Same as secondary
        chart4: "#eba529", // Blend between secondary and accent
        chart5: "#d97706", // Same as accent
      },
    },
    {
      name: "Monochrome",
      colors: {
        background: "#ffffff",
        foreground: "#0f0f0f",
        primary: "#404040",
        secondary: "#f5f5f5",
        accent: "#737373",
        chart1: "#404040", // Same as primary
        chart2: "#8a8a8a", // Blend between primary and secondary
        chart3: "#d4d4d4", // Same as secondary
        chart4: "#a4a4a4", // Blend between secondary and accent
        chart5: "#737373", // Same as accent
      },
    },
    {
      name: "Gold",
      colors: {
        background: "#ffffff",
        foreground: "#1a1a1a",
        primary: "#eab308",
        secondary: "#f5f5f5",
        accent: "#eab308",
        chart1: "#eab308", // Primary
        chart2: "#ca8a04", // Darker gold
        chart3: "#facc15", // Lighter gold
        chart4: "#fde047", // Very light gold
        chart5: "#a16207", // Dark gold/brown
      },
    },
    {
      name: "Red",
      colors: {
        background: "#ffffff",
        foreground: "#0f0f0f",
        primary: "#ef4444",
        secondary: "#f5f5f5",
        accent: "#ef4444",
        chart1: "#ef4444", // Primary red
        chart2: "#b91c1c", // Darker red
        chart3: "#f87171", // Lighter red
        chart4: "#fca5a5", // Very light red
        chart5: "#7f1d1d", // Dark red
      },
    },
  ],
  currentTheme: "Default",
};

const getShareableUrl = (themeState: ThemeState) => {
  if (typeof window === "undefined") return "";

  const baseUrl = window.location.origin + window.location.pathname;
  const themeParams = new URLSearchParams();

  // Add colors
  Object.entries(themeState.colors).forEach(([key, value]) => {
    themeParams.set(`color-${key}`, hexToOklchString(hslToHex(value)));
  });

  // Add fonts
  themeParams.set("font-heading", themeState.fonts.heading);
  themeParams.set("font-body", themeState.fonts.body);

  // Add border radius
  themeParams.set("borderRadius", themeState.borderRadius.toString());

  // Add dark mode
  themeParams.set("darkMode", themeState.isDarkMode.toString());

  // Construct the new URL
  const shareableUrl = `${baseUrl}?${themeParams.toString()}`;

  return shareableUrl;
};

// Add the missing export and initialization code at the end

export type ThemeStore = ThemeState & {
  updateThemeColor: (key: ThemeColorKey, value: string) => void;
  updateBorderRadius: (value: number) => void;
  updateFont: (key: FontKey, value: string) => void;
  resetTheme: () => void;
  toggleDarkMode: () => void;
  setSelectedHarmony: (harmony: ColorHarmony) => void;
  generateHarmonyColors: () => void;
  setExportMenuOpen: (isOpen: boolean) => void;
  setShareMenuOpen: (isOpen: boolean) => void;
  getHexColor: (colorKey: ThemeColorKey) => string;
  generateCSSVariables: () => string;
  generateTailwindConfig: () => string;
  generateJSONConfig: () => string;
  getShareableUrl: () => string;
  applyThemeState: (themeState: Partial<ThemeState>) => void;
  setCurrentTheme: (themeName: string) => void;
  addCustomTheme: (theme: ThemePreset) => void;
  saveCurrentAsTheme: (name: string) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      ...defaultTheme,

      updateThemeColor: (key: ThemeColorKey, hexValue: string) => {
        // Convert hex to HSL
        const hslValue = hexToHSL(hexValue);

        set((state) => {
          // Create copies of both light and dark mode colors
          const lightColors = { ...state.colors };
          const darkColors = { ...state.darkColors };
          const isDarkMode = state.isDarkMode;

          // Update the main color
          if (key === "foreground") {
            // Update all foreground colors to be derivatives of the main foreground
            lightColors.foreground = hslValue;
            lightColors.cardForeground = hslValue;
            lightColors.popoverForeground = hslValue;

            // Don't set component foregrounds to match the main foreground
            // Instead, we'll calculate contrasting colors for each component background

            // Update dark mode foreground colors
            darkColors.foreground = getContrastHSL(hslValue);
            darkColors.cardForeground = darkColors.foreground;
            darkColors.popoverForeground = darkColors.foreground;
          }
          // For the "primary" key handling:
          else if (key === "primary") {
            lightColors.primary = hslValue;

            // Calculate a contrasting foreground color for primary
            lightColors.primaryForeground = calculateContrastingColor(hslValue);

            lightColors.ring = hslValue;
            lightColors.sidebarPrimary = hslValue;
            lightColors.sidebarPrimaryForeground =
              calculateContrastingColor(hslValue);
            lightColors.sidebarRing = hslValue;

            // Update chart colors based on primary, secondary, and accent
            const lightChartColors = generateChartColors(
              hslValue,
              lightColors.secondary,
              lightColors.accent,
              false
            );

            // Update light mode chart colors
            lightColors.chart1 = lightChartColors.chart1;
            lightColors.chart2 = lightChartColors.chart2;
            lightColors.chart3 = lightChartColors.chart3;
            lightColors.chart4 = lightChartColors.chart4;
            lightColors.chart5 = lightChartColors.chart5;

            // Generate monochromatic chart colors for dark mode
            const darkChartColors = generateChartColors(
              darkColors.primary,
              darkColors.secondary,
              darkColors.accent,
              true
            );

            // Update dark mode chart colors
            darkColors.chart1 = darkChartColors.chart1;
            darkColors.chart2 = darkChartColors.chart2;
            darkColors.chart3 = darkChartColors.chart3;
            darkColors.chart4 = darkChartColors.chart4;
            darkColors.chart5 = darkChartColors.chart5;

            // Update dark mode primary
            darkColors.primary = hslValue;
            darkColors.primaryForeground = calculateContrastingColor(hslValue);
            darkColors.ring = hslValue;
            darkColors.sidebarPrimary = hslValue;
            darkColors.sidebarPrimaryForeground =
              calculateContrastingColor(hslValue);
            darkColors.sidebarRing = hslValue;
          }
          // For the "secondary" key handling:
          else if (key === "secondary") {
            lightColors.secondary = hslValue;

            // Calculate a contrasting foreground color for secondary
            lightColors.secondaryForeground =
              calculateContrastingColor(hslValue);

            lightColors.muted = hslValue;
            lightColors.mutedForeground = calculateContrastingColor(
              hslValue,
              "mutedForeground"
            );
            lightColors.sidebar = hslValue;
            lightColors.sidebarForeground = calculateContrastingColor(hslValue);

            // Update chart colors when secondary changes
            const lightChartColors = generateChartColors(
              lightColors.primary,
              hslValue,
              lightColors.accent,
              false
            );

            // Update light mode chart colors
            lightColors.chart1 = lightChartColors.chart1;
            lightColors.chart2 = lightChartColors.chart2;
            lightColors.chart3 = lightChartColors.chart3;
            lightColors.chart4 = lightChartColors.chart4;
            lightColors.chart5 = lightChartColors.chart5;

            // Generate monochromatic chart colors for dark mode
            const darkChartColors = generateChartColors(
              darkColors.primary,
              darkColors.secondary,
              darkColors.accent,
              true
            );

            // Update dark mode chart colors
            darkColors.chart1 = darkChartColors.chart1;
            darkColors.chart2 = darkChartColors.chart2;
            darkColors.chart3 = darkChartColors.chart3;
            darkColors.chart4 = darkChartColors.chart4;
            darkColors.chart5 = darkChartColors.chart5;

            // Update dark mode secondary
            const [h, s, l] = hslValue
              .split(" ")
              .map((part) => Number.parseFloat(part.replace("%", "")));
            const secondaryL = l;
            darkColors.secondary = `${h} ${Math.max(s - 20, 10)}% ${Math.max(
              15,
              Math.min(25, secondaryL - 70)
            )}%`;
            darkColors.secondaryForeground = calculateContrastingColor(
              darkColors.secondary
            );
            darkColors.muted = darkColors.secondary;
            darkColors.mutedForeground = calculateContrastingColor(
              darkColors.secondary,
              "mutedForeground"
            );
          }
          // For the "accent" key handling:
          else if (key === "accent") {
            lightColors.accent = hslValue;
            lightColors.accentForeground = calculateContrastingColor(hslValue);
            lightColors.sidebarAccent = hslValue;
            lightColors.sidebarAccentForeground =
              calculateContrastingColor(hslValue);

            // Update chart colors when accent changes
            const lightChartColors = generateChartColors(
              lightColors.primary,
              lightColors.secondary,
              hslValue,
              false
            );

            // Update light mode chart colors
            lightColors.chart1 = lightChartColors.chart1;
            lightColors.chart2 = lightChartColors.chart2;
            lightColors.chart3 = lightChartColors.chart3;
            lightColors.chart4 = lightChartColors.chart4;
            lightColors.chart5 = lightChartColors.chart5;

            // Generate monochromatic chart colors for dark mode
            const darkChartColors = generateChartColors(
              darkColors.primary,
              darkColors.secondary,
              darkColors.accent,
              true
            );

            // Update dark mode chart colors
            darkColors.chart1 = darkChartColors.chart1;
            darkColors.chart2 = darkChartColors.chart2;
            darkColors.chart3 = darkChartColors.chart3;
            darkColors.chart4 = darkChartColors.chart4;
            darkColors.chart5 = darkChartColors.chart5;

            // Update dark mode accent
            darkColors.accent = hslValue;
            darkColors.accentForeground = calculateContrastingColor(hslValue);
            darkColors.sidebarAccent = hslValue;
            darkColors.sidebarAccentForeground =
              calculateContrastingColor(hslValue);
          }
          // For the "background" key handling:
          // In the updateThemeColor function, find the "background" key handling section and update it:
          else if (key === "background") {
            lightColors.background = hslValue;
            lightColors.card = hslValue;
            lightColors.popover = hslValue;

            // Update card and popover foregrounds to match main foreground
            lightColors.cardForeground = lightColors.foreground;
            lightColors.popoverForeground = lightColors.foreground;

            // Update related colors
            const [h, s, l] = hslValue
              .split(" ")
              .map((part) => Number.parseFloat(part.replace("%", "")));
            lightColors.border = `${h} ${Math.max(s + 5, 0)}% ${Math.max(
              l - 10,
              0
            )}%`;
            lightColors.input = lightColors.border;

            // Update dark mode background
            const darkH = h;
            const darkS = Math.min(s + 10, 100);
            const darkL = Math.max(l - 70, 5);
            darkColors.background = `${darkH} ${darkS}% ${darkL}%`;
            darkColors.card = `${darkH} ${darkS}% ${Math.min(darkL + 10, 30)}%`;
            darkColors.popover = darkColors.card;
            darkColors.border = `${darkH} ${darkS}% ${Math.min(
              darkL + 20,
              40
            )}%`;
            darkColors.input = darkColors.border;

            // Update dark mode card and popover foregrounds
            darkColors.cardForeground = darkColors.foreground;
            darkColors.popoverForeground = darkColors.foreground;

            // Update sidebar colors
            lightColors.sidebar = lightColors.secondary;
            darkColors.sidebar = darkColors.background;
            darkColors.sidebarBorder = darkColors.border;
          } else {
            lightColors.foreground = hslValue;
            lightColors.cardForeground = hslValue;
            lightColors.popoverForeground = hslValue;
            lightColors.primaryForeground = hslValue;
            lightColors.secondaryForeground = hslValue;
            lightColors.accentForeground = hslValue;
            lightColors.mutedForeground = hslValue;
            lightColors.sidebarForeground = hslValue;
            lightColors.sidebarPrimaryForeground = hslValue;
            lightColors.sidebarAccentForeground = hslValue;

            // Update dark mode foreground colors
            darkColors.foreground = getContrastHSL(hslValue);
            darkColors.cardForeground = darkColors.foreground;
            darkColors.popoverForeground = darkColors.foreground;
            darkColors.primaryForeground = darkColors.foreground;
            darkColors.secondaryForeground = darkColors.foreground;
            darkColors.accentForeground = darkColors.foreground;
            darkColors.mutedForeground = darkColors.foreground;
            darkColors.sidebarForeground = darkColors.foreground;
            darkColors.sidebarPrimaryForeground = darkColors.foreground;
            darkColors.sidebarAccentForeground = darkColors.foreground;
          }

          // Create the new state
          const newState = {
            ...state,
            colors: lightColors,
            darkColors: darkColors,
          };

          // Apply CSS variables based on current mode
          const colors = isDarkMode ? darkColors : lightColors;
          applyCSSVariables(colors, state.borderRadius, state.fonts);

          // If in dark mode, ensure dark mode chart colors are properly applied
          if (isDarkMode) {
            // Apply chart colors directly to ensure they're visible in dark mode
            document.documentElement.style.setProperty(
              "--chart-1",
              darkColors.chart1
            );
            document.documentElement.style.setProperty(
              "--chart-2",
              darkColors.chart2
            );
            document.documentElement.style.setProperty(
              "--chart-3",
              darkColors.chart3
            );
            document.documentElement.style.setProperty(
              "--chart-4",
              darkColors.chart4
            );
            document.documentElement.style.setProperty(
              "--chart-5",
              darkColors.chart5
            );
          }

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      updateBorderRadius: (value: number) => {
        set((state) => {
          // Update CSS variable
          document.documentElement.style.setProperty(
            "--radius",
            `${value / 16}rem`
          );

          const newState = {
            ...state,
            borderRadius: value,
          };

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      updateFont: (key: FontKey, value: string) => {
        set((state) => {
          const newFonts = {
            ...state.fonts,
            [key]: value,
          };

          // Update CSS variable
          document.documentElement.style.setProperty(`--font-${key}`, value);

          const newState = {
            ...state,
            fonts: newFonts,
          };

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      // Update the resetTheme function to ensure it applies the correct contrasting colors
      // Find the resetTheme function and update it to include this logic

      resetTheme: () => {
        // Create a new default theme with proper contrasting colors
        const enhancedDefaultTheme = { ...defaultTheme };

        // Ensure foreground colors contrast with their backgrounds
        // Update the resetTheme function to ensure all foreground colors have proper contrast:
        // Ensure foreground colors contrast with their backgrounds
        enhancedDefaultTheme.colors.primaryForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.primary);
        enhancedDefaultTheme.colors.secondaryForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.secondary);
        enhancedDefaultTheme.colors.accentForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.accent);
        enhancedDefaultTheme.colors.mutedForeground = calculateContrastingColor(
          enhancedDefaultTheme.colors.muted,
          "mutedForeground"
        );
        enhancedDefaultTheme.colors.cardForeground = calculateContrastingColor(
          enhancedDefaultTheme.colors.card
        );
        enhancedDefaultTheme.colors.popoverForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.popover);
        enhancedDefaultTheme.colors.sidebarForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.sidebar);
        enhancedDefaultTheme.colors.sidebarPrimaryForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.sidebarPrimary);
        enhancedDefaultTheme.colors.sidebarAccentForeground =
          calculateContrastingColor(enhancedDefaultTheme.colors.sidebarAccent);

        // Do the same for dark mode
        enhancedDefaultTheme.darkColors.primaryForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.primary);
        enhancedDefaultTheme.darkColors.secondaryForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.secondary);
        enhancedDefaultTheme.darkColors.accentForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.accent);
        enhancedDefaultTheme.darkColors.mutedForeground =
          calculateContrastingColor(
            enhancedDefaultTheme.darkColors.muted,
            "mutedForeground"
          );
        enhancedDefaultTheme.darkColors.cardForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.card);
        enhancedDefaultTheme.darkColors.popoverForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.popover);
        enhancedDefaultTheme.darkColors.sidebarForeground =
          calculateContrastingColor(enhancedDefaultTheme.darkColors.sidebar);
        enhancedDefaultTheme.darkColors.sidebarPrimaryForeground =
          calculateContrastingColor(
            enhancedDefaultTheme.darkColors.sidebarPrimary
          );
        enhancedDefaultTheme.darkColors.sidebarAccentForeground =
          calculateContrastingColor(
            enhancedDefaultTheme.darkColors.sidebarAccent
          );

        set(enhancedDefaultTheme);

        // Apply default theme to CSS variables
        const colors = enhancedDefaultTheme.isDarkMode
          ? enhancedDefaultTheme.darkColors
          : enhancedDefaultTheme.colors;
        applyCSSVariables(
          colors,
          enhancedDefaultTheme.borderRadius,
          enhancedDefaultTheme.fonts
        );

        // Toggle dark class
        if (enhancedDefaultTheme.isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        // Update URL with default theme
        updateThemeUrl(enhancedDefaultTheme);

        // Set current theme to "Default"
        set((state) => ({
          ...state,
          currentTheme: "Default",
        }));
      },

      // Update the toggleDarkMode function to maintain color consistency
      toggleDarkMode: () => {
        set((state) => {
          const newIsDarkMode = !state.isDarkMode;

          // Toggle dark class
          if (newIsDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          // Apply the appropriate colors to CSS variables
          // Use the existing darkColors without re-deriving them
          const colors = newIsDarkMode ? state.darkColors : state.colors;
          applyCSSVariables(colors, state.borderRadius, state.fonts);

          const newState = {
            ...state,
            isDarkMode: newIsDarkMode,
          };

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      setSelectedHarmony: (harmony: ColorHarmony) => {
        set((state) => ({
          ...state,
          selectedHarmony: harmony,
        }));
      },

      // Simplify the generateHarmonyColors function to only handle monochromatic
      // Find the generateHarmonyColors function and replace it with this simplified version:

      // Update the generateHarmonyColors function to ensure dark mode colors are consistent
      generateHarmonyColors: () => {
        // Generate a base color for the harmony
        const primaryHex = getRandomHexColor();

        // Convert to HSL for calculations
        const primaryHSL = hexToHSL(primaryHex);
        const [hStr, sStr, lStr] = primaryHSL.split(" ");
        const h = Number.parseInt(hStr, 10);
        const s = Number.parseInt(sStr.replace("%", ""), 10);
        const l = Number.parseInt(lStr.replace("%", ""), 10);

        // LIGHT MODE COLORS
        // -----------------

        // Primary: Make it vibrant and saturated
        const primaryH = h;
        const primaryS = Math.min(s + 20, 85); // Increase saturation for primary
        const primaryL = Math.max(Math.min(l, 60), 45); // Keep lightness in a good range
        const primaryHSLValue = `${primaryH} ${primaryS}% ${primaryL}%`;

        // Secondary: Lighter, less saturated version of primary
        const secondaryH = primaryH; // Same hue as primary
        const secondaryS = Math.max(Math.min(primaryS - 60, 25), 5); // Much less saturated
        const secondaryL = Math.min(primaryL + 40, 96); // Much lighter
        const secondaryHSLValue = `${secondaryH} ${secondaryS}% ${secondaryL}%`;

        // Accent: Lighter version of primary, medium-high saturation
        const accentH = primaryH; // Same hue as primary for better coordination
        const accentS = Math.max(Math.min(primaryS - 30, 55), 30); // Medium-low saturation
        const accentL = Math.min(primaryL + 30, 88); // Much lighter than primary
        const accentHSLValue = `${accentH} ${accentS}% ${accentL}%`;

        // Background: Pure white
        const bgHSLValue = "0 0% 100%";

        // Foreground: Near black
        const fgHSLValue = `${primaryH} 10% 4%`;

        // DARK MODE COLORS
        // ---------------

        // Dark Primary: Same hue, slightly less saturated, slightly lighter
        const darkPrimaryH = primaryH;
        const darkPrimaryS = Math.max(primaryS - 10, 60); // Slightly less saturated
        const darkPrimaryL = Math.min(primaryL + 5, 60); // Slightly lighter
        const darkPrimaryHSLValue = `${darkPrimaryH} ${darkPrimaryS}% ${darkPrimaryL}%`;

        // Dark Secondary: Same hue, low saturation, dark
        const darkSecondaryH = secondaryH;
        const darkSecondaryS = Math.max(secondaryS, 10); // Ensure some saturation
        const darkSecondaryL = Math.max(Math.min(secondaryL - 75, 25), 15); // Much darker
        const darkSecondaryHSLValue = `${darkSecondaryH} ${darkSecondaryS}% ${darkSecondaryL}%`;

        // Dark Accent: Same as light accent but darker
        const darkAccentH = accentH;
        const darkAccentS = accentS;
        const darkAccentL = Math.max(accentL - 50, 25); // Much darker
        const darkAccentHSLValue = `${darkAccentH} ${darkAccentS}% ${darkAccentL}%`;

        // Dark Background: Very dark, slight hue from primary
        const darkBgHSLValue = `${primaryH} 30% 8%`;

        // Dark Foreground: Near white
        const darkFgHSLValue = `${primaryH} 10% 95%`;

        // Create a complete set of light and dark colors
        const lightColors = { ...get().colors };
        const darkColors = { ...get().darkColors };

        // CHART COLORS
        // --------------------------
        // Create monochromatic chart colors based on the primary color
        const lightChartColors = generateChartColors(
          primaryHSLValue,
          secondaryHSLValue,
          accentHSLValue,
          false
        );

        // Create monochromatic chart colors for dark mode
        const darkChartColors = generateChartColors(
          darkPrimaryHSLValue,
          darkSecondaryHSLValue,
          darkAccentHSLValue,
          true
        );

        // Update light mode colors
        lightColors.background = bgHSLValue;
        lightColors.foreground = fgHSLValue;
        lightColors.primary = primaryHSLValue;
        lightColors.secondary = secondaryHSLValue;
        lightColors.accent = accentHSLValue;
        lightColors.card = bgHSLValue;
        lightColors.popover = bgHSLValue;
        lightColors.muted = secondaryHSLValue;
        lightColors.border = `${secondaryH} ${secondaryS}% ${Math.max(
          secondaryL - 10,
          80
        )}%`;
        lightColors.input = lightColors.border;
        lightColors.ring = primaryHSLValue;

        // Calculate contrasting foreground colors for light mode
        lightColors.primaryForeground =
          calculateContrastingColor(primaryHSLValue);
        lightColors.secondaryForeground =
          calculateContrastingColor(secondaryHSLValue);
        lightColors.accentForeground =
          calculateContrastingColor(accentHSLValue);
        lightColors.cardForeground = fgHSLValue;
        lightColors.popoverForeground = fgHSLValue;
        lightColors.mutedForeground = calculateContrastingColor(
          secondaryHSLValue,
          "mutedForeground"
        );

        // Update sidebar colors for light mode
        lightColors.sidebar = secondaryHSLValue;
        lightColors.sidebarForeground =
          calculateContrastingColor(secondaryHSLValue);
        lightColors.sidebarPrimary = primaryHSLValue;
        lightColors.sidebarPrimaryForeground =
          calculateContrastingColor(primaryHSLValue);
        lightColors.sidebarAccent = accentHSLValue;
        lightColors.sidebarAccentForeground =
          calculateContrastingColor(accentHSLValue);
        lightColors.sidebarBorder = lightColors.border;
        lightColors.sidebarRing = primaryHSLValue;

        // Update chart colors for light mode
        lightColors.chart1 = lightChartColors.chart1;
        lightColors.chart2 = lightChartColors.chart2;
        lightColors.chart3 = lightChartColors.chart3;
        lightColors.chart4 = lightChartColors.chart4;
        lightColors.chart5 = lightChartColors.chart5;

        // Update dark mode colors
        darkColors.background = darkBgHSLValue;
        darkColors.foreground = darkFgHSLValue;
        darkColors.primary = darkPrimaryHSLValue;
        darkColors.secondary = darkSecondaryHSLValue;
        darkColors.accent = darkAccentHSLValue;
        darkColors.card = `${primaryH} 30% 12%`; // Slightly lighter than background
        darkColors.popover = darkColors.card;
        darkColors.muted = darkSecondaryHSLValue;

        // Calculate contrasting foreground colors for dark mode
        darkColors.primaryForeground =
          calculateContrastingColor(darkPrimaryHSLValue);
        darkColors.secondaryForeground = calculateContrastingColor(
          darkSecondaryHSLValue
        );
        darkColors.accentForeground =
          calculateContrastingColor(darkAccentHSLValue);
        darkColors.cardForeground = darkFgHSLValue;
        darkColors.popoverForeground = darkFgHSLValue;
        darkColors.mutedForeground = `${darkSecondaryH} 15% 65%`;

        // Border and input colors for dark mode
        darkColors.border = `${darkSecondaryH} ${
          darkSecondaryS + 5
        }% ${Math.min(darkSecondaryL + 10, 30)}%`;
        darkColors.input = darkColors.border;
        darkColors.ring = darkPrimaryHSLValue;

        // Sidebar colors for dark mode
        darkColors.sidebar = darkBgHSLValue;
        darkColors.sidebarForeground = darkFgHSLValue;
        darkColors.sidebarPrimary = darkPrimaryHSLValue;
        darkColors.sidebarPrimaryForeground =
          calculateContrastingColor(darkPrimaryHSLValue);
        darkColors.sidebarAccent = darkAccentHSLValue;
        darkColors.sidebarAccentForeground =
          calculateContrastingColor(darkAccentHSLValue);
        darkColors.sidebarBorder = darkColors.border;
        darkColors.sidebarRing = darkPrimaryHSLValue;

        // Chart colors for dark mode - use dedicated dark mode chart colors
        darkColors.chart1 = darkChartColors.chart1;
        darkColors.chart2 = darkChartColors.chart2;
        darkColors.chart3 = darkChartColors.chart3;
        darkColors.chart4 = darkChartColors.chart4;
        darkColors.chart5 = darkChartColors.chart5;

        // Update the store with all new colors at once
        set((state) => {
          const isDarkMode = state.isDarkMode;

          // Apply the appropriate CSS variables based on current mode
          const colors = isDarkMode ? darkColors : lightColors;
          applyCSSVariables(colors, state.borderRadius, state.fonts);

          const newState = {
            ...state,
            colors: lightColors,
            darkColors: darkColors,
          };

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      setExportMenuOpen: (isOpen: boolean) => {
        set((state) => ({
          ...state,
          exportMenuOpen: isOpen,
        }));
      },

      setShareMenuOpen: (isOpen: boolean) => {
        set((state) => ({
          ...state,
          shareMenuOpen: isOpen,
        }));
      },

      getHexColor: (colorKey: ThemeColorKey): string => {
        const state = get();
        const colors = state.isDarkMode ? state.darkColors : state.colors;

        switch (colorKey) {
          case "foreground":
            return hslToHex(colors.foreground);
          case "background":
            return hslToHex(colors.background);
          case "primary":
            return hslToHex(colors.primary);
          case "secondary":
            return hslToHex(colors.secondary);
          case "accent":
            return hslToHex(colors.accent);
          default:
            return "#000000";
        }
      },

      getShareableUrl: () => {
        const state = get();
        return getShareableUrl(state);
      },

      generateCSSVariables: () => {
        const state = get();
        const { colors, darkColors, borderRadius } = state;

        return `
:root {
--background: ${formatToOklch(colors.background)};
--foreground: ${formatToOklch(colors.foreground)};
--card: ${formatToOklch(colors.card)};
--card-foreground: ${formatToOklch(colors.cardForeground)};
--popover: ${formatToOklch(colors.popover)};
--popover-foreground: ${formatToOklch(colors.popoverForeground)};
--primary: ${formatToOklch(colors.primary)};
--primary-foreground: ${formatToOklch(colors.primaryForeground)};
--secondary: ${formatToOklch(colors.secondary)};
--secondary-foreground: ${formatToOklch(colors.secondaryForeground)};
--muted: ${formatToOklch(colors.muted)};
--muted-foreground: ${formatToOklch(colors.mutedForeground)};
--accent: ${formatToOklch(colors.accent)};
--accent-foreground: ${formatToOklch(colors.accentForeground)};
--destructive: ${formatToOklch(colors.destructive)};
--destructive-foreground: ${formatToOklch(colors.destructiveForeground)};
--border: ${formatToOklch(colors.border)};
--input: ${formatToOklch(colors.input)};
--ring: ${formatToOklch(colors.ring)};
--chart-1: ${formatToOklch(colors.chart1)};
--chart-2: ${formatToOklch(colors.chart2)};
--chart-3: ${formatToOklch(colors.chart3)};
--chart-4: ${formatToOklch(colors.chart4)};
--chart-5: ${formatToOklch(colors.chart5)};
--radius: ${borderRadius / 16}rem;
--sidebar: ${formatToOklch(colors.sidebar)};
--sidebar-foreground: ${formatToOklch(colors.sidebarForeground)};
--sidebar-primary: ${formatToOklch(colors.sidebarPrimary)};
--sidebar-primary-foreground: ${formatToOklch(colors.sidebarPrimaryForeground)};
--sidebar-accent: ${formatToOklch(colors.sidebarAccent)};
--sidebar-accent-foreground: ${formatToOklch(colors.sidebarAccentForeground)};
--sidebar-border: ${formatToOklch(colors.sidebarBorder)};
--sidebar-ring: ${formatToOklch(colors.sidebarRing)};
}

.dark {
--background: ${formatToOklch(darkColors.background)};
--foreground: ${formatToOklch(darkColors.foreground)};
--card: ${formatToOklch(darkColors.card)};
--card-foreground: ${formatToOklch(darkColors.cardForeground)};
--popover: ${formatToOklch(darkColors.popover)};
--popover-foreground: ${formatToOklch(darkColors.popoverForeground)};
--primary: ${formatToOklch(darkColors.primary)};
--primary-foreground: ${formatToOklch(darkColors.primaryForeground)};
--secondary: ${formatToOklch(darkColors.secondary)};
--secondary-foreground: ${formatToOklch(darkColors.secondaryForeground)};
--muted: ${formatToOklch(darkColors.muted)};
--muted-foreground: ${formatToOklch(darkColors.mutedForeground)};
--accent: ${formatToOklch(darkColors.accent)};
--accent-foreground: ${formatToOklch(darkColors.accentForeground)};
--destructive: ${formatToOklch(darkColors.destructive)};
--destructive-foreground: ${formatToOklch(darkColors.destructiveForeground)};
--border: ${formatToOklch(darkColors.border)};
--input: ${formatToOklch(darkColors.input)};
--ring: ${formatToOklch(darkColors.ring)};
--chart-1: ${formatToOklch(darkColors.chart1)};
--chart-2: ${formatToOklch(darkColors.chart2)};
--chart-3: ${formatToOklch(darkColors.chart3)};
--chart-4: ${formatToOklch(darkColors.chart4)};
--chart-5: ${formatToOklch(darkColors.chart5)};
--radius: ${borderRadius / 16}rem;
--sidebar: ${formatToOklch(darkColors.sidebar)};
--sidebar-foreground: ${formatToOklch(darkColors.sidebarForeground)};
--sidebar-primary: ${formatToOklch(darkColors.sidebarPrimary)};
--sidebar-primary-foreground: ${formatToOklch(
          darkColors.sidebarPrimaryForeground
        )};
--sidebar-accent: ${formatToOklch(darkColors.sidebarAccent)};
--sidebar-accent-foreground: ${formatToOklch(
          darkColors.sidebarAccentForeground
        )};
--sidebar-border: ${formatToOklch(darkColors.sidebarBorder)};
--sidebar-ring: ${formatToOklch(darkColors.sidebarRing)};
}
`.trim();
      },

      generateTailwindConfig: () => {
        return `
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
`.trim();
      },

      generateJSONConfig: () => {
        const state = get();
        const { colors, darkColors, borderRadius, fonts } = state;

        const config = {
          theme: {
            light: {
              colors: Object.entries(colors).reduce((acc, [key, value]) => {
                // Convert HSL value to OKLCH
                acc[key.replace(/([A-Z])/g, "-$1").toLowerCase()] =
                  formatToOklch(value);
                return acc;
              }, {} as Record<string, string>),
              borderRadius,
              fonts,
            },
            dark: {
              colors: Object.entries(darkColors).reduce((acc, [key, value]) => {
                // Convert HSL value to OKLCH
                acc[key.replace(/([A-Z])/g, "-$1").toLowerCase()] =
                  formatToOklch(value);
                return acc;
              }, {} as Record<string, string>),
              borderRadius,
              fonts,
            },
          },
        };

        return JSON.stringify(config, null, 2);
      },

      applyThemeState: (themeState: Partial<ThemeState>) => {
        set((state) => {
          // Create a new state by merging the current state with the provided theme state
          const newState = {
            ...state,
            ...themeState,
            colors: themeState.colors
              ? { ...state.colors, ...themeState.colors }
              : state.colors,
            darkColors: themeState.darkColors
              ? { ...state.darkColors, ...themeState.darkColors }
              : state.darkColors,
            fonts: themeState.fonts
              ? { ...state.fonts, ...themeState.fonts }
              : state.fonts,
            isDarkMode:
              themeState.isDarkMode !== undefined
                ? themeState.isDarkMode
                : state.isDarkMode,
          };

          // Apply CSS variables based on the current mode
          const colors = newState.isDarkMode
            ? newState.darkColors
            : newState.colors;
          applyCSSVariables(colors, newState.borderRadius, newState.fonts);

          // Explicitly toggle dark class
          if (newState.isDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          // Update URL with new theme - using the complete state to ensure all parameters are included
          updateThemeUrl(newState as ThemeState);

          return newState;
        });
      },

      // Add these functions to the store
      // Update the setCurrentTheme function to ensure it applies the correct contrasting colors
      // Find the setCurrentTheme function and update it to include this logic

      setCurrentTheme: (themeName: string) => {
        set((state) => {
          const theme = state.predefinedThemes.find(
            (t) => t.name === themeName
          );
          if (!theme) return state;

          // Create new color objects to avoid reference issues
          const newLightColors = { ...state.colors };
          const newDarkColors = { ...state.darkColors };

          // Apply theme colors
          if (theme.colors) {
            // First apply all background colors to light mode
            Object.entries(theme.colors).forEach(([key, value]) => {
              if (key in newLightColors && !key.includes("foreground")) {
                newLightColors[key as keyof ThemeColors] = hexToHSL(value);
              }
            });

            // Calculate contrasting foreground colors for light mode
            newLightColors.primaryForeground = calculateContrastingColor(
              newLightColors.primary
            );
            newLightColors.secondaryForeground = calculateContrastingColor(
              newLightColors.secondary
            );
            newLightColors.accentForeground = calculateContrastingColor(
              newLightColors.accent
            );
            newLightColors.mutedForeground = calculateContrastingColor(
              newLightColors.muted,
              "mutedForeground"
            );
            newLightColors.cardForeground = calculateContrastingColor(
              newLightColors.card
            );
            newLightColors.popoverForeground = calculateContrastingColor(
              newLightColors.popover
            );
            newLightColors.sidebarForeground = calculateContrastingColor(
              newLightColors.sidebar
            );
            newLightColors.sidebarPrimaryForeground = calculateContrastingColor(
              newLightColors.sidebarPrimary
            );
            newLightColors.sidebarAccentForeground = calculateContrastingColor(
              newLightColors.sidebarAccent
            );

            // Generate dark mode colors based on light mode
            const generatedDarkColors = deriveDarkModeColors(newLightColors);

            // Update dark colors
            Object.keys(newDarkColors).forEach((key) => {
              newDarkColors[key as keyof ThemeColors] =
                generatedDarkColors[key as keyof ThemeColors];
            });

            // Apply chart colors if provided
            if (theme.colors.chart1) {
              newLightColors.chart1 = hexToHSL(theme.colors.chart1);
              // Generate corresponding dark mode chart color
              const [h, s, l] = newLightColors.chart1
                .split(" ")
                .map((part) => Number.parseFloat(part.replace("%", "")));
              newDarkColors.chart1 = `${h} ${Math.max(s, 60)}% ${Math.min(
                Math.max(l, 50),
                60
              )}%`;
            }

            // Do the same for other chart colors
            if (theme.colors.chart2) {
              newLightColors.chart2 = hexToHSL(theme.colors.chart2);
              const [h, s, l] = newLightColors.chart2
                .split(" ")
                .map((part) => Number.parseFloat(part.replace("%", "")));
              newDarkColors.chart2 = `${h} ${Math.max(s, 60)}% ${Math.min(
                Math.max(l, 50),
                60
              )}%`;
            }

            if (theme.colors.chart3) {
              newLightColors.chart3 = hexToHSL(theme.colors.chart3);
              const [h, s, l] = newLightColors.chart3
                .split(" ")
                .map((part) => Number.parseFloat(part.replace("%", "")));
              newDarkColors.chart3 = `${h} ${Math.max(s, 60)}% ${Math.min(
                Math.max(l, 50),
                60
              )}%`;
            }

            if (theme.colors.chart4) {
              newLightColors.chart4 = hexToHSL(theme.colors.chart4);
              const [h, s, l] = newLightColors.chart4
                .split(" ")
                .map((part) => Number.parseFloat(part.replace("%", "")));
              newDarkColors.chart4 = `${h} ${Math.max(s, 60)}% ${Math.min(
                Math.max(l, 50),
                60
              )}%`;
            }

            if (theme.colors.chart5) {
              newLightColors.chart5 = hexToHSL(theme.colors.chart5);
              const [h, s, l] = newLightColors.chart5
                .split(" ")
                .map((part) => Number.parseFloat(part.replace("%", "")));
              newDarkColors.chart5 = `${h} ${Math.max(s, 60)}% ${Math.min(
                Math.max(l, 50),
                60
              )}%`;
            }
          }

          // Apply theme fonts if specified
          const newFonts = { ...state.fonts };
          if (theme.fonts) {
            if (theme.fonts.heading) newFonts.heading = theme.fonts.heading;
            if (theme.fonts.body) newFonts.body = theme.fonts.body;
          }

          // Apply border radius if specified
          const newBorderRadius =
            theme.borderRadius !== undefined
              ? theme.borderRadius
              : state.borderRadius;

          // Create the new state
          const newState = {
            ...state,
            colors: newLightColors,
            darkColors: newDarkColors,
            fonts: newFonts,
            borderRadius: newBorderRadius,
            currentTheme: themeName,
          };

          // Apply CSS variables based on current mode
          const colors = state.isDarkMode ? newDarkColors : newLightColors;
          applyCSSVariables(colors, newBorderRadius, newFonts);

          // Update URL with new theme
          updateThemeUrl(newState);

          return newState;
        });
      },

      addCustomTheme: (theme: ThemePreset) => {
        set((state) => {
          // Check if a theme with this name already exists
          const existingIndex = state.predefinedThemes.findIndex(
            (t) => t.name === theme.name
          );

          // Create a new array of themes
          const newThemes = [...state.predefinedThemes];

          if (existingIndex >= 0) {
            // Replace existing theme
            newThemes[existingIndex] = theme;
          } else {
            // Add new theme
            newThemes.push(theme);
          }

          return {
            ...state,
            predefinedThemes: newThemes,
          };
        });
      },

      // Fix the saveCurrentAsTheme function to use the generateChartColors function
      saveCurrentAsTheme: (name: string) => {
        set((state) => {
          // Get the current colors in HSL format
          const primaryHSL = hexToHSL(state.getHexColor("primary"));
          const secondaryHSL = hexToHSL(state.getHexColor("secondary"));
          const accentHSL = hexToHSL(state.getHexColor("accent"));

          // Generate chart colors using the proper function
          const chartColors = generateChartColors(
            primaryHSL,
            secondaryHSL,
            accentHSL,
            state.isDarkMode
          );

          const currentColors = {
            background: state.getHexColor("background"),
            foreground: state.getHexColor("foreground"),
            primary: state.getHexColor("primary"),
            secondary: state.getHexColor("secondary"),
            accent: state.getHexColor("accent"),
            chart1: hslToHex(chartColors.chart1),
            chart2: hslToHex(chartColors.chart2),
            chart3: hslToHex(chartColors.chart3),
            chart4: hslToHex(chartColors.chart4),
            chart5: hslToHex(chartColors.chart5),
          };

          const newTheme: ThemePreset = {
            name,
            colors: currentColors,
            fonts: { ...state.fonts },
            borderRadius: state.borderRadius,
          };

          // Add or update the theme
          state.addCustomTheme(newTheme);

          return {
            ...state,
            currentTheme: name,
          };
        });
      },
    }),
    {
      name: "theme-store",
      partialize: (state) => ({
        colors: state.colors,
        darkColors: state.darkColors,
        fonts: state.fonts,
        borderRadius: state.borderRadius,
        isDarkMode: state.isDarkMode,
        selectedHarmony: state.selectedHarmony,
        exportMenuOpen: state.exportMenuOpen,
        shareMenuOpen: state.shareMenuOpen,
        predefinedThemes: state.predefinedThemes,
        currentTheme: state.currentTheme,
      }),
    }
  )
);

// Initialize theme on client side
if (typeof window !== "undefined") {
  // Apply theme to CSS variables
  const state = useThemeStore.getState();
  const colors = state.isDarkMode ? state.darkColors : state.colors;
  applyCSSVariables(colors, state.borderRadius, state.fonts);

  // Toggle dark class
  if (state.isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Find the updateThemeUrl function at the end of the file and replace it with this implementation:
const updateThemeUrl = (themeState: ThemeState) => {
  if (typeof window === "undefined") return;

  try {
    // Create a base URL with just the origin and pathname
    const baseUrl = window.location.pathname;

    // Use the optimized encoding function from theme-url.ts
    const encodedTheme = encodeThemeState(themeState);

    // Create the new URL with the theme parameter
    const newUrl = `${baseUrl}?theme=${encodedTheme}`;

    // Update the URL without reloading the page
    window.history.replaceState({}, document.title, newUrl);

    console.log("URL updated with optimized theme parameter");
  } catch (error) {
    console.error("Error updating URL with theme:", error);
  }
};

// Add the encodeThemeState function for use in updateThemeUrl
function encodeThemeState(theme: ThemeState): string {
  // Create a minimal version of the theme state with only essential values
  // The rest will be derived during decoding
  const minimalTheme = {
    // Light mode essential colors (5 base colors)
    l: {
      bg: compactHSL(theme.colors.background),
      fg: compactHSL(theme.colors.foreground),
      p: compactHSL(theme.colors.primary),
      s: compactHSL(theme.colors.secondary),
      a: compactHSL(theme.colors.accent),
      // Only include destructive if it's not the default
      ...(theme.colors.destructive !== "14 100% 50%" && {
        d: compactHSL(theme.colors.destructive),
      }),
    },
    // Dark mode essential colors (only if custom dark mode colors are used)
    ...(theme.isDarkMode && {
      d: {
        bg: compactHSL(theme.darkColors.background),
        fg: compactHSL(theme.darkColors.foreground),
        p: compactHSL(theme.darkColors.primary),
        s: compactHSL(theme.darkColors.secondary),
        a: compactHSL(theme.darkColors.accent),
        // Only include destructive if it's not the default
        ...(theme.darkColors.destructive !== "0 70% 45%" && {
          d: compactHSL(theme.darkColors.destructive),
        }),
      },
    }),
    // Fonts (only if not default)
    ...((theme.fonts.heading !== "Geist" || theme.fonts.body !== "Geist") && {
      f: [
        theme.fonts.heading === "Geist" ? null : theme.fonts.heading,
        theme.fonts.body === "Geist" ? null : theme.fonts.body,
      ],
    }),
    // Border radius (only if not default)
    ...(theme.borderRadius !== 8 && { r: theme.borderRadius }),
    // Dark mode flag
    ...(theme.isDarkMode && { dm: 1 }),
  };

  // Remove null values from fonts array
  if (minimalTheme.f) {
    if (minimalTheme.f[0] === null && minimalTheme.f[1] === null) {
      delete minimalTheme.f;
    } else if (minimalTheme.f[0] === null) {
      minimalTheme.f = [null, minimalTheme.f[1]];
    } else if (minimalTheme.f[1] === null) {
      minimalTheme.f = [minimalTheme.f[0]];
    }
  }

  // Convert to JSON and encode to base64
  try {
    return btoa(JSON.stringify(minimalTheme));
  } catch (error) {
    console.error("Error encoding theme state:", error);
    return "";
  }
}

/**
 * Compresses an HSL color string to a more compact format
 * Input: "120 50% 75%"
 * Output: "120,50,75"
 */
function compactHSL(hsl: string): string {
  return hsl.replace(/\s+/g, ",").replace(/%/g, "");
}
