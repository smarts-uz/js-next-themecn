import type {
  BaseColors,
  ColorKey,
  ThemeColors,
  ThemeState,
} from "@/types/theme";

/**
 * Encodes the theme state into a compact base64 string
 */
export function encodeThemeState(theme: ThemeState): string {
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

/**
 * Expands a compact HSL string back to standard format
 * Input: "120,50,75"
 * Output: "120 50% 75%"
 */
function expandHSL(compact: string): string {
  const parts = compact.split(",");
  return `${parts[0]} ${parts[1]}% ${parts[2]}%`;
}

/**
 * Decodes a base64 string into a theme state
 */
export function decodeThemeState(encoded: string): Partial<ThemeState> | null {
  if (!encoded) return null;

  try {
    // Decode from base64 and parse JSON
    const minimalTheme = JSON.parse(atob(encoded));

    if (!minimalTheme || !minimalTheme.l) {
      console.error("Invalid theme data structure");
      return null;
    }

    // Expand compact HSL values
    const lightBaseColors = {
      background: expandHSL(minimalTheme.l.bg),
      foreground: expandHSL(minimalTheme.l.fg),
      primary: expandHSL(minimalTheme.l.p),
      secondary: expandHSL(minimalTheme.l.s),
      accent: expandHSL(minimalTheme.l.a),
      destructive: minimalTheme.l.d
        ? expandHSL(minimalTheme.l.d)
        : "14 100% 50%",
    };

    // Derive complete light mode colors
    const lightColors = deriveCompleteColorSet(lightBaseColors);

    // Create the theme state
    const themeState: Partial<ThemeState> = {
      colors: lightColors,
      fonts: {
        heading: minimalTheme.f?.[0] || "Geist",
        body: minimalTheme.f?.[1] || minimalTheme.f?.[0] || "Geist",
      },
      borderRadius: minimalTheme.r || 8,
      isDarkMode: !!minimalTheme.dm,
    };

    // If dark mode colors are provided, use them
    if (minimalTheme.d) {
      const darkBaseColors = {
        background: expandHSL(minimalTheme.d.bg),
        foreground: expandHSL(minimalTheme.d.fg),
        primary: expandHSL(minimalTheme.d.p),
        secondary: expandHSL(minimalTheme.d.s),
        accent: expandHSL(minimalTheme.d.a),
        destructive: minimalTheme.d.d
          ? expandHSL(minimalTheme.d.d)
          : "0 70% 45%",
      };
      themeState.darkColors = deriveCompleteColorSet(darkBaseColors, true);
    } else {
      // Otherwise derive dark colors from light colors
      themeState.darkColors = deriveDarkColorSet(lightBaseColors);
    }

    return themeState;
  } catch (error) {
    console.error("Error decoding theme state:", error);
    return null;
  }
}

/**
 * Updates the URL with the current theme state
 */
export function updateUrlWithTheme(theme: ThemeState): void {
  if (typeof window === "undefined") return;

  try {
    // Create a completely new URL with just the origin and pathname
    const baseUrl = window.location.origin + window.location.pathname;

    // Encode the theme state
    const encodedTheme = encodeThemeState(theme);
    if (!encodedTheme) {
      console.error("Failed to encode theme state");
      return;
    }

    // Create the new URL with just the theme parameter
    const newUrl = `${baseUrl}?theme=${encodedTheme}`;

    // Update the URL without reloading the page
    window.history.replaceState({}, "", newUrl);

    console.log("URL updated successfully with optimized URL");
  } catch (error) {
    console.error("Error updating URL with theme:", error);
  }
}

/**
 * Gets the theme state from the URL
 */
export function getThemeFromUrl(): Partial<ThemeState> | null {
  if (typeof window === "undefined") return null;

  try {
    // Get the theme parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const encodedTheme = params.get("theme");

    if (!encodedTheme) {
      console.log("No theme parameter found in URL");
      return null;
    }

    // Decode the theme state
    return decodeThemeState(encodedTheme);
  } catch (error) {
    console.error("Error getting theme from URL:", error);
    return null;
  }
}

/**
 * Generates a shareable URL with the current theme
 */
export function getShareableUrl(theme: ThemeState): string {
  if (typeof window === "undefined") return "";

  try {
    // Create a base URL with just the origin and pathname
    const baseUrl = window.location.origin + window.location.pathname;

    // Encode the theme state
    const encodedTheme = encodeThemeState(theme);
    if (!encodedTheme) {
      console.error("Failed to encode theme state");
      return baseUrl;
    }

    // Create the shareable URL with only the theme parameter
    return `${baseUrl}?theme=${encodedTheme}`;
  } catch (error) {
    console.error("Error generating shareable URL:", error);
    return window.location.origin + window.location.pathname;
  }
}

// Update the deriveCompleteColorSet function to use the monochromatic chart color generation
function deriveCompleteColorSet(
  baseColors: BaseColors,
  isDarkMode = false
): ThemeColors {
  const { background, foreground, primary, secondary, accent, destructive } =
    baseColors;

  // Extract background components for border calculation
  const [bgH, bgS, bgL] = background
    .split(" ")
    .map((part: string) => Number.parseFloat(part.replace("%", "")));

  // Create border color based on background
  const borderColor = isDarkMode
    ? `${bgH} ${Math.min(bgS + 5, 30)}% ${Math.min(bgL + 10, 30)}%`
    : `${bgH} ${Math.max(bgS + 5, 0)}% ${Math.max(bgL - 10, 0)}%`;

  // Generate monochromatic chart colors
  const chartColors = generateChartColors(
    primary,
    secondary,
    accent,
    isDarkMode
  );

  // Calculate contrasting foreground colors
  const primaryForeground = calculateContrastingColor(primary);
  const secondaryForeground = calculateContrastingColor(secondary);
  const accentForeground = calculateContrastingColor(accent);
  const mutedForeground = isDarkMode
    ? `${secondary.split(" ")[0]} 15% 65%`
    : calculateContrastingColor(secondary, "mutedForeground");
  const destructiveForeground = isDarkMode ? foreground : "0 0% 100%";

  return {
    background,
    foreground,
    card: isDarkMode ? `${bgH} ${bgS}% ${Math.min(bgL + 4, 20)}%` : background,
    cardForeground: foreground,
    popover: isDarkMode
      ? `${bgH} ${bgS}% ${Math.min(bgL + 4, 20)}%`
      : background,
    popoverForeground: foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted: secondary,
    mutedForeground,
    accent,
    accentForeground,
    destructive,
    destructiveForeground,
    border: borderColor,
    input: borderColor,
    ring: primary,
    chart1: chartColors.chart1,
    chart2: chartColors.chart2,
    chart3: chartColors.chart3,
    chart4: chartColors.chart4,
    chart5: chartColors.chart5,
    sidebar: isDarkMode ? background : secondary,
    sidebarForeground: isDarkMode ? foreground : secondaryForeground,
    sidebarPrimary: primary,
    sidebarPrimaryForeground: primaryForeground,
    sidebarAccent: accent,
    sidebarAccentForeground: accentForeground,
    sidebarBorder: borderColor,
    sidebarRing: primary,
  } as ThemeColors;
}

// Add the generateChartColors function to ensure monochromatic chart colors
/**
 * Generates a set of monochromatic chart colors based on the primary color
 */
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

// Update the deriveDarkColorSet function to use the monochromatic chart color generation
function deriveDarkColorSet(baseColors: BaseColors): ThemeColors {
  const { primary, secondary, accent } = baseColors;

  // Create a dark background based on the primary color
  const [primaryH, primaryS, primaryL] = primary
    .split(" ")
    .map((part: string) => Number.parseFloat(part.replace("%", "")));

  // Dark background with primary hue
  const darkBg = `${primaryH} 30% 8%`;
  const darkFg = `${primaryH} 10% 95%`;

  // Keep primary color vibrant but slightly darker
  const darkPrimary = `${primaryH} ${Math.min(primaryS + 5, 90)}% ${Math.max(
    primaryL - 10,
    40
  )}%`;

  // Create a dark secondary color
  const [secondaryH, secondaryS, secondaryL] = secondary
    .split(" ")
    .map((part: string) => Number.parseFloat(part.replace("%", "")));
  const darkSecondary = `${secondaryH} ${Math.max(secondaryS, 15)}% ${Math.max(
    15,
    Math.min(secondaryL - 60, 25)
  )}%`;

  // Create a dark accent color
  const [accentH, accentS, accentL] = accent
    .split(" ")
    .map((part: string) => Number.parseFloat(part.replace("%", "")));
  const darkAccent = `${accentH} ${Math.min(accentS + 5, 90)}% ${Math.max(
    accentL - 10,
    40
  )}%`;

  // Dark destructive color
  const darkDestructive = "0 70% 45%";

  // Create dark base colors
  const darkBaseColors = {
    background: darkBg,
    foreground: darkFg,
    primary: darkPrimary,
    secondary: darkSecondary,
    accent: darkAccent,
    destructive: darkDestructive,
  };

  // Derive complete dark color set
  return deriveCompleteColorSet(darkBaseColors, true);
}

/**
 * Calculates a contrasting color for text on a background
 */
function calculateContrastingColor(hsl: string, colorKey?: ColorKey): string {
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

    // For very saturated colors, we might want to desaturate the foreground slightly
    const newS = s > 70 ? 10 : s;

    return `${h} ${newS}% ${newL}%`;
  } catch (e) {
    console.error("Error calculating contrasting color:", e);
    return "0 0% 100%"; // Default to white as a fallback
  }
}
