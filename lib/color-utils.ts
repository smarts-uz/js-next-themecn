import { parse, formatHex, converter, wcagLuminance, oklch } from "culori";
import type { Rgb, Hsl, Oklch } from "culori";

export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const color = parse(hex);
  if (!color) return null;

  const rgb = converter("rgb")(color);
  if (!rgb) return null;

  return {
    r: Math.round((rgb.r || 0) * 255),
    g: Math.round((rgb.g || 0) * 255),
    b: Math.round((rgb.b || 0) * 255),
  };
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const color: Rgb = { mode: "rgb", r: r / 255, g: g / 255, b: b / 255 };
  return formatHex(color);
}

// Convert RGB to HSL
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const color: Rgb = { mode: "rgb", r: r / 255, g: g / 255, b: b / 255 };
  const hslResult = converter("hsl")(color);

  return {
    h: hslResult?.h || 0,
    s: hslResult?.s || 0,
    l: hslResult?.l || 0,
  };
}

// Convert HSL to RGB
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const color: Hsl = { mode: "hsl", h, s, l };
  const rgbResult = converter("rgb")(color);

  return {
    r: Math.round((rgbResult?.r || 0) * 255),
    g: Math.round((rgbResult?.g || 0) * 255),
    b: Math.round((rgbResult?.b || 0) * 255),
  };
}

// Generate a contrasting foreground color (black or white) based on background
export function generateContrastingForeground(backgroundColor: string): string {
  const color = parse(backgroundColor);
  if (!color) return "#000000";

  // Use culori's wcagLuminance function to calculate luminance
  const luminance = wcagLuminance(color);

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Generate a random color
export function generateRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Adjust color brightness
export function adjustColorBrightness(color: string, percent: number): string {
  const parsed = parse(color);
  if (!parsed) return color;

  const hslColor = converter("hsl")(parsed);
  if (!hslColor) return color;

  const newL = Math.max(0, Math.min(1, (hslColor.l || 0) + percent / 100));

  const adjusted = { ...hslColor, l: newL };
  return formatHex(adjusted);
}

// Generate monochromatic colors - keep the same hue but vary saturation and lightness
export function generateMonochromaticColors(baseColor: string): string[] {
  const parsed = parse(baseColor);
  if (!parsed) return [baseColor, baseColor, baseColor];

  const hslColor = converter("hsl")(parsed);
  if (!hslColor) return [baseColor, baseColor, baseColor];

  const h = hslColor.h || 0;
  const s = hslColor.s || 0;
  const l = hslColor.l || 0;

  // Generate variations with same hue but different saturation and lightness
  const colors = [
    { mode: "hsl", h, s, l } as Hsl, // Base color
    {
      mode: "hsl",
      h,
      s: Math.max(0.1, s - 0.3),
      l: Math.min(0.9, l + 0.2),
    } as Hsl, // Less saturated, lighter
    {
      mode: "hsl",
      h,
      s: Math.min(1, s + 0.1),
      l: Math.max(0.1, l - 0.2),
    } as Hsl, // More saturated, darker
  ];

  return colors.map((c) => formatHex(c));
}

// Generate analogous colors (colors adjacent on the color wheel)
export function generateAnalogousColors(baseColor: string): string[] {
  const parsed = parse(baseColor);
  if (!parsed) return [baseColor, baseColor, baseColor];

  const hslColor = converter("hsl")(parsed);
  if (!hslColor) return [baseColor, baseColor, baseColor];

  const h = hslColor.h || 0;
  const s = hslColor.s || 0;
  const l = hslColor.l || 0;

  // Generate colors with hues 30 degrees apart
  const colors = [
    { mode: "hsl", h, s, l } as Hsl, // Base color
    {
      mode: "hsl",
      h: (h + 30) % 360,
      s: Math.min(1, s * 0.9),
      l: Math.min(0.9, l * 1.1),
    } as Hsl,
    {
      mode: "hsl",
      h: (h + 330) % 360,
      s: Math.min(1, s * 1.1),
      l: Math.max(0.2, l * 0.9),
    } as Hsl,
  ];

  return colors.map((c) => formatHex(c));
}

// Generate complementary colors (colors opposite on the color wheel)
export function generateComplementaryColors(baseColor: string): string[] {
  const parsed = parse(baseColor);
  if (!parsed) return [baseColor, baseColor, baseColor];

  const hslColor = converter("hsl")(parsed);
  if (!hslColor) return [baseColor, baseColor, baseColor];

  const h = hslColor.h || 0;
  const s = hslColor.s || 0;
  const l = hslColor.l || 0;

  // Generate base color and its complement (180 degrees apart)
  const complementary = (h + 180) % 360;

  const colors = [
    { mode: "hsl", h, s, l } as Hsl, // Base color
    {
      mode: "hsl",
      h: complementary,
      s: Math.min(1, s * 1.2),
      l: Math.min(0.85, l * 1.15),
    } as Hsl,
    {
      mode: "hsl",
      h: (h + 90) % 360,
      s: Math.min(1, s * 0.8),
      l: Math.max(0.25, l * 0.85),
    } as Hsl,
  ];

  return colors.map((c) => formatHex(c));
}

// Generate split-complementary colors (base color + two colors adjacent to its complement)
export function generateSplitComplementaryColors(baseColor: string): string[] {
  const parsed = parse(baseColor);
  if (!parsed) return [baseColor, baseColor, baseColor];

  const hslColor = converter("hsl")(parsed);
  if (!hslColor) return [baseColor, baseColor, baseColor];

  const h = hslColor.h || 0;
  const s = hslColor.s || 0;
  const l = hslColor.l || 0;

  // Calculate the complement
  const complement = (h + 180) % 360;

  const colors = [
    { mode: "hsl", h, s, l } as Hsl, // Base color
    {
      mode: "hsl",
      h: (complement + 30) % 360,
      s: Math.min(1, s * 1.15),
      l: Math.max(0.3, l * 0.9),
    } as Hsl,
    {
      mode: "hsl",
      h: (complement - 30) % 360,
      s: Math.min(1, s * 0.9),
      l: Math.min(0.9, l * 1.1),
    } as Hsl,
  ];

  return colors.map((c) => formatHex(c));
}

// Convert HSL values to OKLCH for CSS variables
export function formatToOklch(hslValue: string): string {
  try {
    const parts = hslValue.split(" ");
    const h = parseInt(parts[0] || "0");
    const s = parseInt((parts[1] || "0%").replace("%", "")) / 100;
    const l = parseInt((parts[2] || "0%").replace("%", "")) / 100;

    const color: Hsl = { mode: "hsl", h, s, l };
    const oklch = converter("oklch")(color);
    if (!oklch) return `oklch(${l.toFixed(3)} 0 ${h})`;

    return `oklch(${oklch.l.toFixed(3)} ${oklch.c?.toFixed(3) || "0"} ${
      oklch.h || h
    })`;
  } catch (e) {
    console.error("Error converting HSL to OKLCH format:", e);
    return "oklch(0.5 0 0)"; // Default mid-gray as fallback
  }
}

// Convert RGB to OKLCH
export function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  try {
    const color: Rgb = { mode: "rgb", r: r / 255, g: g / 255, b: b / 255 };
    const oklch = converter("oklch")(color);

    return {
      l: oklch?.l || 0,
      c: oklch?.c || 0,
      h: oklch?.h || 0,
    };
  } catch (e) {
    console.error("Error converting RGB to OKLCH:", e);
    return { l: 0, c: 0, h: 0 };
  }
}

// Convert OKLCH to RGB
export function oklchToRgb(
  l: number,
  c: number,
  h: number
): { r: number; g: number; b: number } {
  try {
    // Create an OKLCH color object directly with the appropriate mode
    const color: Oklch = { mode: "oklch", l, c, h };

    // Instead of using oklch() function, use converter directly
    const rgb = converter("rgb")(color);

    return {
      r: Math.round((rgb?.r || 0) * 255),
      g: Math.round((rgb?.g || 0) * 255),
      b: Math.round((rgb?.b || 0) * 255),
    };
  } catch (e) {
    console.error("Error converting OKLCH to RGB:", e);
    return { r: 0, g: 0, b: 0 };
  }
}

// Convert hex to OKLCH string for URL
export function hexToOklchString(hex: string): string {
  try {
    const color = parse(hex);
    if (!color) return "0.0.0";

    const oklch = converter("oklch")(color);
    if (!oklch) return "0.0.0";

    return `${Math.round((oklch.l || 0) * 100)}.${Math.round(
      (oklch.c || 0) * 100
    )}.${Math.round(oklch.h || 0)}`;
  } catch (e) {
    console.error("Error converting hex to OKLCH string:", e);
    return "0.0.0"; // Default fallback
  }
}

// Convert OKLCH string from URL to hex
export function oklchStringToHex(oklch: string): string {
  try {
    const [l, c, h] = oklch.split(".").map(Number);

    const color: Oklch = { mode: "oklch", l: l / 100, c: c / 100, h };
    return formatHex(color);
  } catch (e) {
    console.error("Error converting OKLCH string to hex:", e);
    return "#000000"; // Default to black as fallback
  }
}

// Convert hex to HSL string format for shadcn
export function hexToHSL(hex: string): string {
  const color = parse(hex);
  if (!color) return "0 0% 0%";

  const hsl = converter("hsl")(color);
  if (!hsl) return "0 0% 0%";

  const h = Math.round(hsl.h || 0);
  const s = Math.round((hsl.s || 0) * 100);
  const l = Math.round((hsl.l || 0) * 100);

  return `${h} ${s}% ${l}%`;
}

// Convert HSL to hex
export function hslToHex(hsl: string): string {
  try {
    const [h, s, l] = hsl
      .split(" ")
      .map((part) => Number.parseFloat(part.replace("%", "")));

    const color: Hsl = { mode: "hsl", h, s: s / 100, l: l / 100 };
    return formatHex(color);
  } catch (e) {
    console.error("Error converting HSL to hex:", e);
    return "#000000";
  }
}

// Generate a contrasting color in HSL format
export function getContrastHSL(hsl: string): string {
  const [h, s, l] = hsl
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));

  // For simplicity, we'll just adjust the lightness for contrast
  const newL = l > 50 ? 10 : 98;

  return `${h} ${s}% ${newL}%`;
}

// Calculate a contrasting color that ensures good readability
export function calculateContrastingColor(
  hsl: string,
  colorKey?: string
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

// Generate a random hex color
export function getRandomHexColor(): string {
  const rgb: Rgb = {
    mode: "rgb",
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
  };
  return formatHex(rgb);
}

// Compact HSL format for URL sharing
export function compactHSL(hsl: string): string {
  const [h, s, l] = hsl
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));
  return `${Math.round(h)}.${Math.round(s)}.${Math.round(l)}`;
}

// Parse OKLCH string
export function parseOklchString(oklchString: string): Oklch | undefined {
  try {
    // The oklch function from culori is designed to parse strings like "oklch(0.5 0.2 270)"
    return oklch(oklchString);
  } catch (e) {
    console.error("Error parsing OKLCH string:", e);
    return undefined;
  }
}
