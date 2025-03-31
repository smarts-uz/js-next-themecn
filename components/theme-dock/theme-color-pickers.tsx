import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorPicker } from "@/components/color-picker";
import { useThemeStore } from "@/lib/store";
import { parse, converter } from "culori";
import { hexToHSL } from "@/lib/color-utils";

interface ThemeColorPickersProps {
  showPrimaryOnly?: boolean;
}

export const ThemeColorPickers = ({
  showPrimaryOnly = false,
}: ThemeColorPickersProps) => {
  const { updateThemeColor, getHexColor, isDarkMode } = useThemeStore();

  // Handle color change and update theme
  const handleColorChange = (
    colorKey: "primary" | "secondary" | "background" | "foreground" | "accent",
    color: string
  ) => {
    // Normalize color format (ensure lowercase hex)
    const normalizedColor = color.toLowerCase();

    // Ensure the color is a valid hex format
    if (/^#[0-9a-f]{6}$/i.test(normalizedColor)) {
      // Get current color for comparison
      const currentColor = getHexColor(colorKey).toLowerCase();

      // Calculate color difference to prevent insignificant updates
      const isDifferentEnough = isColorDifferentEnough(
        normalizedColor,
        currentColor
      );

      // Only update if the color actually changed and the difference is significant
      if (normalizedColor !== currentColor && isDifferentEnough) {
        console.log(
          `Updating ${colorKey} from ${currentColor} to ${normalizedColor} in ${
            isDarkMode ? "dark" : "light"
          } mode`
        );

        // If changing primary color, generate and update the entire palette
        if (colorKey === "primary") {
          if (isDarkMode) {
            // In dark mode, just directly update dark mode primary without affecting light mode
            updateDarkModePrimaryColor(normalizedColor);
          } else {
            // In light mode, update both light and dark mode colors
            generateAndUpdateColorPalette(normalizedColor);
          }
        } else if (colorKey === "secondary") {
          if (isDarkMode) {
            // In dark mode, just directly update dark mode secondary
            updateDarkModeSecondaryColor(normalizedColor);
          } else {
            // In light mode, update both
            updateSecondaryColorSet(normalizedColor);
          }
        } else if (colorKey === "accent") {
          if (isDarkMode) {
            // In dark mode, just directly update dark mode accent
            updateDarkModeAccentColor(normalizedColor);
          } else {
            // In light mode, update both
            updateAccentColorSet(normalizedColor);
          }
        } else {
          // For background and foreground
          if (isDarkMode) {
            // In dark mode, only update the dark mode color
            const store = useThemeStore.getState();
            const hslValue = hexToHSL(normalizedColor);
            const darkColors = { ...store.darkColors };

            if (colorKey === "background") {
              // Update dark mode background and related colors
              darkColors.background = hslValue;
              darkColors.card = `${hslValue.split(" ")[0]} 30% 12%`; // Slightly lighter than background
              darkColors.popover = darkColors.card;
              darkColors.sidebar = hslValue;

              // Update border based on background
              const [h, s, l] = hslValue
                .split(" ")
                .map((part: string) =>
                  Number.parseFloat(part.replace("%", ""))
                );
              darkColors.border = `${h} ${Math.min(s + 10, 40)}% ${Math.min(
                l + 10,
                30
              )}%`;
              darkColors.input = darkColors.border;
              darkColors.sidebarBorder = darkColors.border;
            } else if (colorKey === "foreground") {
              // Update dark mode foreground and related colors
              darkColors.foreground = hslValue;
              darkColors.cardForeground = hslValue;
              darkColors.popoverForeground = hslValue;
              darkColors.sidebarForeground = hslValue;
            }

            // Apply dark mode colors only
            store.applyThemeState({
              darkColors: darkColors,
            });
          } else {
            // In light mode, update both (using existing logic)
            updateThemeColor(colorKey, normalizedColor);
          }
        }
      }
    } else {
      console.warn(`Invalid color format: ${color}`);
    }
  };

  // Generate a complete color palette based on the primary color
  const generateAndUpdateColorPalette = (primaryColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(primaryColor);
    if (!parsedColor) {
      console.error("Invalid color format:", primaryColor);
      return;
    }

    // Convert directly to HSL for easier manipulation
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", primaryColor);
      return;
    }

    // Get HSL components with proper handling of null values
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string properly
    const primaryHSLValue = `${h} ${s}% ${l}%`;

    // LIGHT MODE COLORS
    // -----------------

    // Secondary: Lighter, less saturated version of primary
    const secondaryH = h; // Same hue as primary
    const secondaryS = Math.max(Math.min(s - 60, 25), 5); // Much less saturated
    const secondaryL = Math.min(l + 40, 96); // Much lighter
    const secondaryHSLValue = `${secondaryH} ${secondaryS}% ${secondaryL}%`;

    // Accent: Slight hue shift, medium-high saturation
    const accentH = (h + 30) % 360; // Slight hue shift for interest
    const accentS = Math.max(Math.min(s - 20, 70), 50); // Medium-high saturation
    const accentL = Math.min(l + 25, 80); // Lighter than primary
    const accentHSLValue = `${accentH} ${accentS}% ${accentL}%`;

    // Background: Pure white
    const bgHSLValue = "0 0% 100%";

    // Foreground: Near black with hint of primary hue
    const fgHSLValue = `${h} 10% 4%`;

    // DARK MODE COLORS
    // ---------------

    // Dark Primary: Same hue, slightly less saturated, slightly lighter
    const darkPrimaryH = h;
    const darkPrimaryS = Math.max(s - 10, 60); // Maintain good saturation
    const darkPrimaryL = Math.min(l + 5, 60); // Slightly lighter if needed
    const darkPrimaryHSLValue = `${darkPrimaryH} ${darkPrimaryS}% ${darkPrimaryL}%`;

    // Dark Secondary: Same hue, low saturation, dark
    const darkSecondaryH = secondaryH;
    const darkSecondaryS = Math.max(secondaryS, 10); // Ensure some saturation
    const darkSecondaryL = Math.max(Math.min(secondaryL - 75, 25), 15); // Much darker
    const darkSecondaryHSLValue = `${darkSecondaryH} ${darkSecondaryS}% ${darkSecondaryL}%`;

    // Dark Accent: Same as light accent but LIGHTER for dark mode
    const darkAccentH = accentH;
    const darkAccentS = Math.min(accentS + 10, 85); // Slightly more saturated
    const darkAccentL = Math.max(Math.min(accentL - 10, 60), 45); // Lighter than before
    const darkAccentHSLValue = `${darkAccentH} ${darkAccentS}% ${darkAccentL}%`;

    // Dark Background: Very dark, slight hue from primary
    const darkBgHSLValue = `${h} 30% 8%`;

    // Dark Foreground: Near white
    const darkFgHSLValue = `${h} 10% 95%`;

    // Get current state
    const store = useThemeStore.getState();
    const { colors: lightColors, darkColors } = store;

    // Create fresh copies of the current colors
    const newLightColors = { ...lightColors };
    const newDarkColors = { ...darkColors };

    // CHART COLORS
    // --------------------------
    // Create monochromatic chart colors based on the primary color
    const lightChartColors = {
      chart1: primaryHSLValue, // Primary color
      chart2: `${h} 70% 60%`, // Variations of the primary hue
      chart3: `${h} 60% 70%`,
      chart4: `${h} 85% 30%`,
      chart5: `${h} 85% 20%`,
    };

    // Create monochromatic chart colors for dark mode
    const darkChartColors = {
      chart1: darkPrimaryHSLValue, // Dark mode variations
      chart2: `${h} 80% 65%`,
      chart3: `${h} 85% 75%`,
      chart4: `${h} 65% 35%`,
      chart5: `${h} 50% 25%`,
    };

    // Update light mode colors
    newLightColors.background = bgHSLValue;
    newLightColors.foreground = fgHSLValue;
    newLightColors.primary = primaryHSLValue;
    newLightColors.secondary = secondaryHSLValue;
    newLightColors.accent = accentHSLValue;
    newLightColors.card = bgHSLValue;
    newLightColors.popover = bgHSLValue;
    newLightColors.muted = secondaryHSLValue;
    newLightColors.border = `${secondaryH} ${secondaryS}% ${Math.max(
      secondaryL - 10,
      80
    )}%`;
    newLightColors.input = newLightColors.border;
    newLightColors.ring = primaryHSLValue;
    newLightColors.destructive = "357.18 100% 45%"; // Updated destructive color

    // Calculate contrasting foreground colors for light mode
    // Determine if primary color is dark (below threshold)
    const isPrimaryDark = l < 40;

    // Adjust foreground colors based on primary brightness
    newLightColors.primaryForeground = isPrimaryDark
      ? "0 0% 100%" // White for dark primary colors
      : `${h} 10% 95%`; // Default light foreground for light primary colors

    newLightColors.secondaryForeground = `${secondaryH} 30% 10%`; // Contrast with secondary
    newLightColors.accentForeground = `${accentH} 50% 10%`; // Contrast with accent
    newLightColors.cardForeground = fgHSLValue;
    newLightColors.popoverForeground = fgHSLValue;
    newLightColors.mutedForeground = `${secondaryH} 30% 45%`; // Medium contrast for muted text

    // Update sidebar colors for light mode
    newLightColors.sidebar = secondaryHSLValue;
    newLightColors.sidebarForeground = `${secondaryH} 30% 10%`;
    newLightColors.sidebarPrimary = primaryHSLValue;
    newLightColors.sidebarPrimaryForeground = isPrimaryDark
      ? "0 0% 100%" // White for dark primary colors
      : `${h} 10% 95%`;
    newLightColors.sidebarAccent = accentHSLValue;
    newLightColors.sidebarAccentForeground = `${accentH} 50% 10%`;
    newLightColors.sidebarBorder = newLightColors.border;
    newLightColors.sidebarRing = primaryHSLValue;

    // Update chart colors for light mode
    newLightColors.chart1 = lightChartColors.chart1;
    newLightColors.chart2 = lightChartColors.chart2;
    newLightColors.chart3 = lightChartColors.chart3;
    newLightColors.chart4 = lightChartColors.chart4;
    newLightColors.chart5 = lightChartColors.chart5;

    // Update dark mode colors
    newDarkColors.background = darkBgHSLValue;
    newDarkColors.foreground = darkFgHSLValue;
    newDarkColors.primary = darkPrimaryHSLValue;
    newDarkColors.secondary = darkSecondaryHSLValue;
    newDarkColors.accent = darkAccentHSLValue;
    newDarkColors.card = `${h} 30% 12%`; // Slightly lighter than background
    newDarkColors.popover = newDarkColors.card;
    newDarkColors.muted = darkSecondaryHSLValue;
    newDarkColors.destructive = "357.18 100% 45%"; // Updated destructive color for dark mode

    // Calculate contrasting foreground colors for dark mode
    newDarkColors.primaryForeground = `${darkPrimaryH} 10% 95%`;
    newDarkColors.secondaryForeground = `${darkSecondaryH} 30% 95%`;
    newDarkColors.accentForeground = `${darkAccentH} 50% 95%`;
    newDarkColors.cardForeground = darkFgHSLValue;
    newDarkColors.popoverForeground = darkFgHSLValue;
    newDarkColors.mutedForeground = `${darkSecondaryH} 15% 65%`;

    // Border and input colors for dark mode
    newDarkColors.border = `${darkSecondaryH} ${darkSecondaryS + 5}% ${Math.min(
      darkSecondaryL + 10,
      30
    )}%`;
    newDarkColors.input = newDarkColors.border;
    newDarkColors.ring = darkPrimaryHSLValue;

    // Sidebar colors for dark mode
    const darkBgHSLParts = darkBgHSLValue.split(" ");
    const darkBgH = parseInt(darkBgHSLParts[0]);
    const darkBgS = parseInt(darkBgHSLParts[1]);
    const darkBgL = parseInt(darkBgHSLParts[2]);
    newDarkColors.sidebar = `${darkBgH} ${darkBgS}% ${Math.min(
      darkBgL + 12,
      25
    )}%`;
    newDarkColors.sidebarForeground = darkFgHSLValue;
    newDarkColors.sidebarPrimary = darkPrimaryHSLValue;
    newDarkColors.sidebarPrimaryForeground = `${darkPrimaryH} 10% 95%`;
    newDarkColors.sidebarAccent = darkAccentHSLValue;
    newDarkColors.sidebarAccentForeground = `${darkAccentH} 50% 95%`;
    newDarkColors.sidebarBorder = newDarkColors.border;
    newDarkColors.sidebarRing = darkPrimaryHSLValue;

    // Chart colors for dark mode
    newDarkColors.chart1 = darkChartColors.chart1;
    newDarkColors.chart2 = darkChartColors.chart2;
    newDarkColors.chart3 = darkChartColors.chart3;
    newDarkColors.chart4 = darkChartColors.chart4;
    newDarkColors.chart5 = darkChartColors.chart5;

    // Apply the theme state changes
    store.applyThemeState({
      colors: newLightColors,
      darkColors: newDarkColors,
    });
  };

  // Update only the secondary color set
  const updateSecondaryColorSet = (secondaryColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(secondaryColor);
    if (!parsedColor) {
      console.error("Invalid color format:", secondaryColor);
      return;
    }

    // Convert directly to HSL for easier manipulation
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", secondaryColor);
      return;
    }

    // Get HSL components with proper handling of null values
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string properly
    const secondaryHSLValue = `${h} ${s}% ${l}%`;

    // Get current state
    const store = useThemeStore.getState();
    const { colors: lightColors, darkColors } = store;

    // Create fresh copies of the current colors
    const newLightColors = { ...lightColors };
    const newDarkColors = { ...darkColors };

    // Update light mode secondary colors
    newLightColors.secondary = secondaryHSLValue;
    newLightColors.muted = secondaryHSLValue;
    newLightColors.secondaryForeground = `${h} 30% 10%`; // Contrast with secondary
    newLightColors.border = `${h} ${s}% ${Math.max(l - 10, 80)}%`;
    newLightColors.input = newLightColors.border;
    newLightColors.mutedForeground = `${h} 30% 45%`; // Medium contrast for muted text

    // Update sidebar colors using secondary
    newLightColors.sidebar = secondaryHSLValue;
    newLightColors.sidebarForeground = `${h} 30% 10%`;
    newLightColors.sidebarBorder = newLightColors.border;

    // Dark mode secondary colors
    const darkSecondaryS = Math.max(s, 10); // Ensure some saturation
    const darkSecondaryL = Math.max(Math.min(l - 75, 25), 15); // Much darker
    const darkSecondaryHSLValue = `${h} ${darkSecondaryS}% ${darkSecondaryL}%`;

    newDarkColors.secondary = darkSecondaryHSLValue;
    newDarkColors.muted = darkSecondaryHSLValue;
    newDarkColors.secondaryForeground = `${h} 30% 95%`;
    newDarkColors.border = `${h} ${darkSecondaryS + 5}% ${Math.min(
      darkSecondaryL + 10,
      30
    )}%`;
    newDarkColors.input = newDarkColors.border;
    newDarkColors.mutedForeground = `${h} 15% 65%`;

    // Apply the theme state changes
    store.applyThemeState({
      colors: newLightColors,
      darkColors: newDarkColors,
    });
  };

  // Update only the accent color set
  const updateAccentColorSet = (accentColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(accentColor);
    if (!parsedColor) {
      console.error("Invalid color format:", accentColor);
      return;
    }

    // Convert directly to HSL for easier manipulation
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", accentColor);
      return;
    }

    // Get HSL components with proper handling of null values
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string properly
    const accentHSLValue = `${h} ${s}% ${l}%`;

    // Get current state
    const store = useThemeStore.getState();
    const { colors: lightColors, darkColors } = store;

    // Create fresh copies of the current colors
    const newLightColors = { ...lightColors };
    const newDarkColors = { ...darkColors };

    // Update light mode accent colors
    newLightColors.accent = accentHSLValue;
    newLightColors.accentForeground = `${h} 50% 10%`; // Contrast with accent
    newLightColors.sidebarAccent = accentHSLValue;
    newLightColors.sidebarAccentForeground = `${h} 50% 10%`;

    // Dark mode accent colors
    const darkAccentS = Math.min(s + 10, 85); // Slightly more saturated
    const darkAccentL = Math.max(Math.min(l - 10, 60), 45); // Adjusted for dark mode
    const darkAccentHSLValue = `${h} ${darkAccentS}% ${darkAccentL}%`;

    newDarkColors.accent = darkAccentHSLValue;
    newDarkColors.accentForeground = `${h} 50% 95%`;
    newDarkColors.sidebarAccent = darkAccentHSLValue;
    newDarkColors.sidebarAccentForeground = `${h} 50% 95%`;

    // Apply the theme state changes
    store.applyThemeState({
      colors: newLightColors,
      darkColors: newDarkColors,
    });
  };

  // Helper function to check if colors are different enough to warrant an update
  // This prevents minor rounding issues from causing unnecessary updates
  const isColorDifferentEnough = (color1: string, color2: string): boolean => {
    // If they're exactly the same, no need to update
    if (color1 === color2) return false;

    // Parse hex colors to RGB
    const parseHex = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb1 = parseHex(color1);
    const rgb2 = parseHex(color2);

    // Calculate squared difference for each channel
    const rDiff = Math.pow(rgb1.r - rgb2.r, 2);
    const gDiff = Math.pow(rgb1.g - rgb2.g, 2);
    const bDiff = Math.pow(rgb1.b - rgb2.b, 2);

    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(rDiff + gDiff + bDiff);

    // Return true if distance exceeds threshold (values below 2 are barely perceptible)
    return distance > 1.5;
  };

  // Direct update of dark mode primary color without affecting light mode
  const updateDarkModePrimaryColor = (primaryColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(primaryColor);
    if (!parsedColor) {
      console.error("Invalid color format:", primaryColor);
      return;
    }

    // Convert directly to HSL
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", primaryColor);
      return;
    }

    // Get HSL components
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string
    const primaryHSLValue = `${h} ${s}% ${l}%`;

    // Get current state
    const store = useThemeStore.getState();
    const darkColors = { ...store.darkColors };

    // Update primary color and related colors
    darkColors.primary = primaryHSLValue;
    darkColors.ring = primaryHSLValue;
    darkColors.sidebarPrimary = primaryHSLValue;

    // Generate appropriate background based on primary color
    // Dark background with primary hue but low saturation and lightness
    const darkBgH = h;
    const darkBgS = Math.max(Math.min(s - 60, 40), 30);
    const darkBgL = Math.max(Math.min(l - 35, 10), 8);
    const darkBgHSLValue = `${darkBgH} ${darkBgS}% ${darkBgL}%`;

    // Update background and related colors
    darkColors.background = darkBgHSLValue;
    darkColors.card = `${darkBgH} ${darkBgS}% ${Math.min(darkBgL + 4, 20)}%`;
    darkColors.popover = darkColors.card;

    // Generate sidebar color with better contrast against background
    darkColors.sidebar = `${darkBgH} ${darkBgS}% ${Math.min(
      darkBgL + 12,
      25
    )}%`;

    // Generate foreground color based on primary
    const darkFgHSLValue = `${h} 10% 95%`;
    darkColors.foreground = darkFgHSLValue;
    darkColors.cardForeground = darkFgHSLValue;
    darkColors.popoverForeground = darkFgHSLValue;
    darkColors.sidebarForeground = darkFgHSLValue;

    // Generate secondary color based on primary
    const darkSecondaryH = h;
    const darkSecondaryS = Math.max(Math.min(s - 40, 30), 7);
    const darkSecondaryL = Math.max(Math.min(l - 20, 30), 15);
    const darkSecondaryHSLValue = `${darkSecondaryH} ${darkSecondaryS}% ${darkSecondaryL}%`;

    darkColors.secondary = darkSecondaryHSLValue;
    darkColors.muted = darkSecondaryHSLValue;
    darkColors.secondaryForeground = `${darkSecondaryH} 10% 95%`;
    darkColors.mutedForeground = `${darkSecondaryH} 15% 65%`;

    // Generate accent color based on primary with a hue shift
    const darkAccentH = (h + 30) % 360;
    const darkAccentS = Math.min(s + 5, 80);
    const darkAccentL = Math.min(l + 15, 65);
    const darkAccentHSLValue = `${darkAccentH} ${darkAccentS}% ${darkAccentL}%`;

    darkColors.accent = darkAccentHSLValue;
    darkColors.accentForeground = `${darkAccentH} 50% 10%`;
    darkColors.sidebarAccent = darkAccentHSLValue;
    darkColors.sidebarAccentForeground = `${darkAccentH} 50% 10%`;

    // Calculate contrasting foreground colors
    const isPrimaryDark = l < 40;
    darkColors.primaryForeground = isPrimaryDark ? "0 0% 100%" : `${h} 10% 95%`;
    darkColors.sidebarPrimaryForeground = darkColors.primaryForeground;

    // Update border colors
    darkColors.border = `${darkSecondaryH} ${darkSecondaryS + 5}% ${Math.min(
      darkSecondaryL + 10,
      30
    )}%`;
    darkColors.input = darkColors.border;
    darkColors.sidebarBorder = darkColors.border;
    darkColors.sidebarRing = primaryHSLValue;

    // Update chart colors
    const darkChartColors = {
      chart1: primaryHSLValue,
      chart2: `${h} ${Math.min(s + 5, 90)}% ${Math.min(l + 15, 75)}%`,
      chart3: `${h} ${Math.min(s + 10, 95)}% ${Math.min(l + 25, 85)}%`,
      chart4: `${h} ${Math.max(s - 10, 30)}% ${Math.max(l - 15, 25)}%`,
      chart5: `${h} ${Math.max(s - 20, 20)}% ${Math.max(l - 25, 15)}%`,
    };

    darkColors.chart1 = darkChartColors.chart1;
    darkColors.chart2 = darkChartColors.chart2;
    darkColors.chart3 = darkChartColors.chart3;
    darkColors.chart4 = darkChartColors.chart4;
    darkColors.chart5 = darkChartColors.chart5;

    // Apply dark mode colors only
    store.applyThemeState({
      darkColors: darkColors,
    });
  };

  // Direct update of dark mode secondary color without affecting light mode
  const updateDarkModeSecondaryColor = (secondaryColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(secondaryColor);
    if (!parsedColor) {
      console.error("Invalid color format:", secondaryColor);
      return;
    }

    // Convert directly to HSL
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", secondaryColor);
      return;
    }

    // Get HSL components
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string
    const secondaryHSLValue = `${h} ${s}% ${l}%`;

    // Get current state
    const store = useThemeStore.getState();
    const darkColors = { ...store.darkColors };

    // Update secondary and related colors
    darkColors.secondary = secondaryHSLValue;
    darkColors.muted = secondaryHSLValue;

    // Calculate contrasting foregrounds
    darkColors.secondaryForeground = l < 50 ? `${h} 10% 90%` : `${h} 30% 10%`;
    darkColors.mutedForeground = `${h} 15% 65%`;

    // Apply dark mode colors only
    store.applyThemeState({
      darkColors: darkColors,
    });
  };

  // Direct update of dark mode accent color without affecting light mode
  const updateDarkModeAccentColor = (accentColor: string) => {
    // Parse the hex color using culori
    const parsedColor = parse(accentColor);
    if (!parsedColor) {
      console.error("Invalid color format:", accentColor);
      return;
    }

    // Convert directly to HSL
    const hslColor = converter("hsl")(parsedColor);
    if (!hslColor) {
      console.error("Failed to convert color to HSL:", accentColor);
      return;
    }

    // Get HSL components
    const h = Math.round(hslColor.h || 0);
    const s = Math.round((hslColor.s || 0) * 100);
    const l = Math.round((hslColor.l || 0) * 100);

    // Format HSL string
    const accentHSLValue = `${h} ${s}% ${l}%`;

    // Get current state
    const store = useThemeStore.getState();
    const darkColors = { ...store.darkColors };

    // Update accent and related colors
    darkColors.accent = accentHSLValue;
    darkColors.sidebarAccent = accentHSLValue;

    // Calculate contrasting foregrounds
    darkColors.accentForeground = l < 50 ? `${h} 10% 90%` : `${h} 30% 10%`;
    darkColors.sidebarAccentForeground = darkColors.accentForeground;

    // Apply dark mode colors only
    store.applyThemeState({
      darkColors: darkColors,
    });
  };

  // If showPrimaryOnly is true, only render the Primary Color picker
  if (showPrimaryOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-primary cursor-pointer" />
                  <span className="sr-only">Primary</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Primary Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("primary")}
                  onChange={(color) => handleColorChange("primary", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Primary Color
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      {/* Foreground Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div
                    className="w-7 h-7 rounded-full border border-border/50 cursor-pointer"
                    style={{
                      backgroundColor: getHexColor("foreground"),
                    }}
                  />
                  <span className="sr-only">Foreground</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Foreground Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("foreground")}
                  onChange={(color) => handleColorChange("foreground", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Foreground Color
        </TooltipContent>
      </Tooltip>

      {/* Background Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div
                    className="w-7 h-7 rounded-full border border-border/50 cursor-pointer"
                    style={{
                      backgroundColor: getHexColor("background"),
                    }}
                  />
                  <span className="sr-only">Background</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Background Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("background")}
                  onChange={(color) => handleColorChange("background", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Background Color
        </TooltipContent>
      </Tooltip>

      {/* Primary Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-primary cursor-pointer" />
                  <span className="sr-only">Primary</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Primary Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("primary")}
                  onChange={(color) => handleColorChange("primary", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Primary Color
        </TooltipContent>
      </Tooltip>

      {/* Secondary Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary cursor-pointer" />
                  <span className="sr-only">Secondary</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Secondary Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("secondary")}
                  onChange={(color) => handleColorChange("secondary", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Secondary Color
        </TooltipContent>
      </Tooltip>

      {/* Accent Color */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-10 w-10 p-0 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-accent cursor-pointer" />
                  <span className="sr-only">Accent</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                side="top"
                align="center"
                sideOffset={16}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="p-2 flex items-center"
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    color: "#1a1a1a",
                  }}
                >
                  <span className="font-medium">Accent Color</span>
                </div>
                <ColorPicker
                  color={getHexColor("accent")}
                  onChange={(color) => handleColorChange("accent", color)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-none"
        >
          Accent Color
        </TooltipContent>
      </Tooltip>
    </>
  );
};
