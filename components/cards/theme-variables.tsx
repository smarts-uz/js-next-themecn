"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ColorVariable {
  name: string;
  value: string;
  hexValue: string;
  category: string;
}

function oklchToHex(oklchValue: string): string {
  // Extract just the hex value if it's already converted
  const hexMatch = oklchValue.match(/#[0-9a-fA-F]{6}/);
  if (hexMatch) return hexMatch[0];

  // We need a temporary element to convert the OKLCH to hex
  const tempEl = document.createElement("div");
  tempEl.style.color = oklchValue;
  document.body.appendChild(tempEl);

  // Get computed style and extract the color in RGB format
  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  // Convert RGB to hex
  const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) return "#000000";

  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
}

export function CardsThemeVariables() {
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>([]);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const variableGroups: Record<string, string[]> = {
      "Base Colors": [
        "--background",
        "--foreground",
        "--card",
        "--card-foreground",
        "--popover",
        "--popover-foreground",
      ],
      "Primary & Secondary": [
        "--primary",
        "--primary-foreground",
        "--secondary",
        "--secondary-foreground",
      ],
      "States & Feedback": [
        "--muted",
        "--muted-foreground",
        "--accent",
        "--accent-foreground",
        "--destructive",
        "--border",
        "--input",
        "--ring",
      ],
      Charts: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
      Sidebar: [
        "--sidebar",
        "--sidebar-foreground",
        "--sidebar-primary",
        "--sidebar-primary-foreground",
        "--sidebar-accent",
        "--sidebar-accent-foreground",
        "--sidebar-border",
        "--sidebar-ring",
      ],
    };

    const variables = Object.entries(variableGroups).flatMap(
      ([category, names]) =>
        names.map((name) => {
          const value = rootStyles.getPropertyValue(name).trim();
          return {
            name,
            value,
            hexValue: oklchToHex(value),
            category,
          };
        })
    );

    setColorVariables(variables);
  }, []);

  const groupedVariables = colorVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, ColorVariable[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Variables</CardTitle>
        <CardDescription>
          All theme CSS variables with their current values
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.entries(groupedVariables).map(([category, variables]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {variables.map((variable) => (
                <div
                  key={variable.name}
                  className="flex flex-col bg-background rounded-md overflow-hidden shadow-sm"
                >
                  <div
                    className="h-20 w-full"
                    style={{ backgroundColor: `var(${variable.name})` }}
                  />
                  <div className="p-2 bg-background">
                    <div className="text-xs font-bold">
                      {variable.name.replace("--", "")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
