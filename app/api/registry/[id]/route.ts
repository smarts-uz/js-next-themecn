import { NextResponse } from "next/server";
import { decodeThemeState } from "@/lib/theme-url";
import { formatToOklch } from "@/lib/color-utils";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return new NextResponse("Theme parameter is required", { status: 400 });
  }

  // Decode theme state
  const themeState = decodeThemeState(id);
  if (!themeState?.colors) {
    return new NextResponse("Invalid theme state", { status: 400 });
  }

  // Get colors from the decoded theme state
  const lightColors = themeState.colors;
  const darkColors = themeState.darkColors || themeState.colors;

  // Create registry JSON
  const registryJson = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "themecn",
    type: "registry:theme",
    cssVars: {
      theme: {
        radius: `${themeState.borderRadius}rem`,
        "chart-1": formatToOklch(lightColors.chart1),
        "chart-2": formatToOklch(lightColors.chart2),
        "chart-3": formatToOklch(lightColors.chart3),
        "chart-4": formatToOklch(lightColors.chart4),
        "chart-5": formatToOklch(lightColors.chart5),
      },
      light: {
        background: formatToOklch(lightColors.background),
        foreground: formatToOklch(lightColors.foreground),
        card: formatToOklch(lightColors.card),
        "card-foreground": formatToOklch(lightColors.cardForeground),
        popover: formatToOklch(lightColors.popover),
        "popover-foreground": formatToOklch(lightColors.popoverForeground),
        primary: formatToOklch(lightColors.primary),
        "primary-foreground": formatToOklch(lightColors.primaryForeground),
        secondary: formatToOklch(lightColors.secondary),
        "secondary-foreground": formatToOklch(lightColors.secondaryForeground),
        muted: formatToOklch(lightColors.muted),
        "muted-foreground": formatToOklch(lightColors.mutedForeground),
        accent: formatToOklch(lightColors.accent),
        "accent-foreground": formatToOklch(lightColors.accentForeground),
        destructive: formatToOklch(lightColors.destructive),
        border: formatToOklch(lightColors.border),
        input: formatToOklch(lightColors.input),
        ring: formatToOklch(lightColors.ring),
      },
      dark: {
        background: formatToOklch(darkColors.background),
        foreground: formatToOklch(darkColors.foreground),
        card: formatToOklch(darkColors.card),
        "card-foreground": formatToOklch(darkColors.cardForeground),
        popover: formatToOklch(darkColors.popover),
        "popover-foreground": formatToOklch(darkColors.popoverForeground),
        primary: formatToOklch(darkColors.primary),
        "primary-foreground": formatToOklch(darkColors.primaryForeground),
        secondary: formatToOklch(darkColors.secondary),
        "secondary-foreground": formatToOklch(darkColors.secondaryForeground),
        muted: formatToOklch(darkColors.muted),
        "muted-foreground": formatToOklch(darkColors.mutedForeground),
        accent: formatToOklch(darkColors.accent),
        "accent-foreground": formatToOklch(darkColors.accentForeground),
        destructive: formatToOklch(darkColors.destructive),
        border: formatToOklch(darkColors.border),
        input: formatToOklch(darkColors.input),
        ring: formatToOklch(darkColors.ring),
      },
    },
  };

  return NextResponse.json(registryJson);
}
