"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Import the color utility
import { getCSSVariableColor } from "./color-utils";

export function BarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dummy data for the chart
  const data = [
    { day: "Mon", value: 2.4 },
    { day: "Tue", value: 1.8 },
    { day: "Wed", value: 2.2 },
    { day: "Thu", value: 3.5 },
    { day: "Fri", value: 2.9 },
    { day: "Sat", value: 4.2 },
    { day: "Sun", value: 3.8 },
  ];

  const [chartColors, setChartColors] = useState({
    chart2: "hsl(321 84% 63%)",
    foreground: "hsl(0 0% 0%)",
  });

  // Update the useEffect to ensure chart colors are updated when theme changes
  useEffect(() => {
    let isMounted = true;

    setMounted(true);

    // Function to update colors when CSS variables change
    const updateColors = () => {
      if (!isMounted) return;

      setChartColors({
        chart2: getCSSVariableColor("--chart-2"),
        foreground: getCSSVariableColor("--foreground"),
      });
    };

    // Create an observer to watch for style changes
    const observer = new MutationObserver(updateColors);

    // Observe changes to style attribute on document.documentElement
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Initial update
    updateColors();

    // Cleanup
    return () => {
      isMounted = false;
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  if (!mounted) return null;

  // Calculate chart dimensions
  const width = ref.current?.clientWidth || 600;
  const height = ref.current?.clientHeight || 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map((d) => d.value));
  const yScale = (value: number) =>
    chartHeight - (value / maxValue) * chartHeight;
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = (chartWidth / data.length) * 0.2;
  const xScale = (index: number) =>
    index * (barWidth + barSpacing) + barSpacing / 2;

  return (
    <div ref={ref} className="w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = chartHeight - tick * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke={isDark ? "hsl(var(--border))" : "hsl(var(--muted))"}
                  strokeWidth={1}
                  strokeDasharray={i > 0 ? "4 4" : ""}
                />
                <text
                  x={-5}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="hsl(var(--muted-foreground))"
                >
                  {(maxValue * tick).toFixed(1)}%
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={xScale(i) + barWidth / 2}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--muted-foreground))"
            >
              {d.day}
            </text>
          ))}

          {/* Bars */}
          {data.map((d, i) => (
            <g key={i}>
              <rect
                x={xScale(i)}
                y={yScale(d.value)}
                width={barWidth}
                height={chartHeight - yScale(d.value)}
                fill={chartColors.chart2}
                rx={4}
                ry={4}
              />
              <text
                x={xScale(i) + barWidth / 2}
                y={yScale(d.value) - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill={chartColors.foreground}
              >
                {d.value.toFixed(1)}%
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
