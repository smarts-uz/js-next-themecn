export function getCSSVariableColor(variable: string): string {
  try {
    // Get the HSL values from the CSS variable
    const hslValues = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

    // If the value is empty, return a fallback color
    if (!hslValues) {
      console.warn(`CSS variable ${variable} is empty, using fallback color`)
      return variable === "--chart-1"
        ? "hsl(262.1 83.3% 57.8%)"
        : variable === "--chart-2"
          ? "hsl(262.1 73.3% 67.8%)"
          : variable === "--chart-3"
            ? "hsl(262.1 63.3% 77.8%)"
            : variable === "--chart-4"
              ? "hsl(262.1 93.3% 47.8%)"
              : variable === "--chart-5"
                ? "hsl(262.1 93.3% 37.8%)"
                : "hsl(0 0% 0%)"
    }

    // Return as CSS HSL color
    return `hsl(${hslValues})`
  } catch (e) {
    console.error(`Error getting CSS variable ${variable}:`, e)
    return "hsl(0 0% 0%)"
  }
}

// Simplified function to get chart colors directly from CSS variables
export function getChartColors() {
  return {
    chart1: getCSSVariableColor("--chart-1"),
    chart2: getCSSVariableColor("--chart-2"),
    chart3: getCSSVariableColor("--chart-3"),
    chart4: getCSSVariableColor("--chart-4"),
    chart5: getCSSVariableColor("--chart-5"),
    background: getCSSVariableColor("--background"),
    foreground: getCSSVariableColor("--foreground"),
  }
}

