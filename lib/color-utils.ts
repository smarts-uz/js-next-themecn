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

// Convert RGB to OKLCH (simplified implementation)
export function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  // Simplified conversion - this is an approximation
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Simple RGB to HSL-like conversion that we'll use for OKLCH approximation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;

    h /= 6;
  }

  // Approximate OKLCH values
  const oklchL = l;
  const oklchC = s * 0.3; // Simplified chroma approximation
  const oklchH = h * 360; // Hue in degrees

  return { l: oklchL, c: oklchC, h: oklchH };
}

// Convert OKLCH to RGB (simplified implementation)
export function oklchToRgb(
  l: number,
  c: number,
  h: number
): { r: number; g: number; b: number } {
  // Approximate conversion back to HSL-like values
  const hsl_h = h / 360;
  const hsl_s = Math.min(c / 0.3, 1); // Convert chroma back to saturation
  const hsl_l = l;

  // Convert HSL to RGB
  let r, g, b;

  if (hsl_s === 0) {
    r = g = b = hsl_l;
  } else {
    const q = hsl_l < 0.5 ? hsl_l * (1 + hsl_s) : hsl_l + hsl_s - hsl_l * hsl_s;
    const p = 2 * hsl_l - q;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    r = hue2rgb(p, q, hsl_h + 1 / 3);
    g = hue2rgb(p, q, hsl_h);
    b = hue2rgb(p, q, hsl_h - 1 / 3);
  }

  // Apply inverse gamma correction
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
  return `${Math.round(oklch.l * 100)}.${Math.round(
    oklch.c * 100
  )}.${Math.round(oklch.h)}`;
}

// Convert OKLCH string from URL to hex
export function oklchStringToHex(oklch: string): string {
  // Parse the OKLCH values
  const [l, c, h] = oklch.split(".").map(Number);

  // Convert to RGB (divide by 100 for l and c to normalize)
  const rgb = oklchToRgb(l / 100, c / 100, h);

  // Convert to hex
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// Convert hex to HSL string format for shadcn
export function hexToHSL(hex: string): string {
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
export function hslToHex(hsl: string): string {
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

export const hueToRgb = (p: number, q: number, t: number): number => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

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
  const hex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `#${hex}`;
}

// Compact HSL format for URL sharing
export function compactHSL(hsl: string): string {
  const [h, s, l] = hsl
    .split(" ")
    .map((part) => Number.parseFloat(part.replace("%", "")));
  return `${Math.round(h)}.${Math.round(s)}.${Math.round(l)}`;
}
