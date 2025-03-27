"use client";

import { useEffect, useRef, useState } from "react";

export function DonutChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // State for chart colors
  const [chartColors, setChartColors] = useState({
    chart1: "hsl(1 84% 63%)",
    chart2: "hsl(321 84% 63%)",
    chart3: "hsl(181 84% 63%)",
    chart4: "hsl(61 84% 63%)",
    chart5: "hsl(301 84% 63%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 0%)",
  });

  // Update colors when component mounts and when theme changes
  useEffect(() => {
    let isMounted = true;

    setMounted(true);

    // Function to get the current CSS variable color
    const getColor = (variable: string) => {
      return `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim()})`;
    };

    // Function to update all colors
    const updateColors = () => {
      if (!isMounted) return;

      const newColors = {
        chart1: getColor("--chart-1"),
        chart2: getColor("--chart-2"),
        chart3: getColor("--chart-3"),
        chart4: getColor("--chart-4"),
        chart5: getColor("--chart-5"),
        background: getColor("--background"),
        foreground: getColor("--foreground"),
      };

      setChartColors(newColors);
    };

    // Initial update
    updateColors();

    // Set up observer for theme changes
    const observer = new MutationObserver(() => {
      if (isMounted) {
        updateColors();
      }
    });

    // Watch for changes to the document's style attribute and class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Clean up
    return () => {
      isMounted = false;
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Don't render until mounted
  if (!mounted) return null;

  // Calculate chart dimensions
  const width = ref.current?.clientWidth || 300;
  const height = ref.current?.clientHeight || 200;
  const radius = (Math.min(width, height) / 2) * 0.8;
  const innerRadius = radius * 0.6; // For donut hole

  // Data with explicit colors from chartColors state
  const data = [
    { label: "Direct", value: 35, color: chartColors.chart1 },
    { label: "Organic Search", value: 25, color: chartColors.chart2 },
    { label: "Social Media", value: 20, color: chartColors.chart3 },
    { label: "Referral", value: 15, color: chartColors.chart4 },
    { label: "Other", value: 5, color: chartColors.chart5 },
  ];

  // Calculate total for percentages
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Generate pie slices
  let currentAngle = 0;
  const slices = data.map((d) => {
    const startAngle = currentAngle;
    const sliceAngle = (d.value / total) * (2 * Math.PI);
    currentAngle += sliceAngle;
    const endAngle = currentAngle;

    // Calculate SVG arc path
    const x1 = radius * Math.sin(startAngle);
    const y1 = -radius * Math.cos(startAngle);
    const x2 = radius * Math.sin(endAngle);
    const y2 = -radius * Math.cos(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    // Outer arc
    const outerArc = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    // Inner arc (for donut)
    const x3 = innerRadius * Math.sin(endAngle);
    const y3 = -innerRadius * Math.cos(endAngle);
    const x4 = innerRadius * Math.sin(startAngle);
    const y4 = -innerRadius * Math.cos(startAngle);

    const innerArc = `L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

    // Complete path
    const path = outerArc + innerArc;

    return {
      path,
      color: d.color,
      value: d.value,
    };
  });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.path}
              fill={slice.color}
              stroke={chartColors.background}
              strokeWidth={1}
            />
          ))}

          {/* Center text */}
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={radius * 0.25}
            fontWeight="bold"
            fill={chartColors.foreground}
          >
            {total}
          </text>
          <text
            x="0"
            y={radius * 0.15}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={radius * 0.12}
            fill="hsl(var(--muted-foreground))"
          >
            Total
          </text>
        </g>
      </svg>
    </div>
  );
}
