export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Convert RGB to HSL
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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

  return { h: h * 360, s, l };
}

// Convert HSL to RGB
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Generate a contrasting foreground color (black or white) based on background
export function generateContrastingForeground(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#000000";

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

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
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newL = Math.max(0, Math.min(1, l + percent / 100));
  const { r, g, b } = hslToRgb(h, s, newL);

  return rgbToHex(r, g, b);
}

// Revise the color harmony generation functions to ensure they produce distinct color schemes

// Generate monochromatic colors - keep the same hue but vary saturation and lightness
export function generateMonochromaticColors(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate variations with same hue but different saturation and lightness
  const colors = [
    hslToRgb(h, s, l), // Base color
    hslToRgb(h, Math.max(0.1, s - 0.3), Math.min(0.9, l + 0.2)), // Less saturated, lighter
    hslToRgb(h, Math.min(1, s + 0.1), Math.max(0.1, l - 0.2)), // More saturated, darker
  ];

  return colors.map((c) => rgbToHex(c.r, c.g, c.b));
}

// Generate analogous colors (colors adjacent on the color wheel)
export function generateAnalogousColors(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate colors with hues 30 degrees apart
  // Make them more distinct by varying saturation and lightness
  const colors = [
    hslToRgb(h, s, l), // Base color
    hslToRgb((h + 30) % 360, Math.min(1, s * 0.9), Math.min(0.9, l * 1.1)), // 30° clockwise - less saturated, lighter
    hslToRgb((h + 330) % 360, Math.min(1, s * 1.1), Math.max(0.2, l * 0.9)), // 30° counterclockwise - more saturated, darker
  ];

  return colors.map((c) => rgbToHex(c.r, c.g, c.b));
}

// Generate complementary colors (colors opposite on the color wheel)
export function generateComplementaryColors(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate base color and its complement (180 degrees apart)
  const complementary = (h + 180) % 360;

  // Make the complementary color distinctly different in saturation/lightness
  const colors = [
    hslToRgb(h, s, l), // Base color
    hslToRgb(complementary, Math.min(1, s * 1.2), Math.min(0.85, l * 1.15)), // Complementary color - more saturated, lighter
    hslToRgb((h + 90) % 360, Math.min(1, s * 0.8), Math.max(0.25, l * 0.85)), // Triadic color - less saturated, darker
  ];

  return colors.map((c) => rgbToHex(c.r, c.g, c.b));
}

// Generate split-complementary colors (base color + two colors adjacent to its complement)
export function generateSplitComplementaryColors(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor, baseColor, baseColor];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Calculate the complement
  const complement = (h + 180) % 360;

  // Generate base color and two colors 30° on either side of its complement
  // Make them more distinct with varied saturation and lightness
  const colors = [
    hslToRgb(h, s, l), // Base color
    hslToRgb(
      (complement + 30) % 360,
      Math.min(1, s * 1.15),
      Math.max(0.3, l * 0.9)
    ), // 30° clockwise from complement - more saturated, darker
    hslToRgb(
      (complement - 30) % 360,
      Math.min(1, s * 0.9),
      Math.min(0.9, l * 1.1)
    ), // 30° counterclockwise from complement - less saturated, lighter
  ];

  return colors.map((c) => rgbToHex(c.r, c.g, c.b));
}

// Convert HSL values to OKLCH for CSS variables
export function formatToOklch(hslValue: string): string {
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
