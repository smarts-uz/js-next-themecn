"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { getCSSVariableColor } from "./color-utils";

export function MultiLineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dummy data for the chart
  const data = [
    { month: "Jan", users: 1200, revenue: 4500, growth: 2200 },
    { month: "Feb", users: 1400, revenue: 4800, growth: 2400 },
    { month: "Mar", users: 1300, revenue: 4600, growth: 2300 },
    { month: "Apr", users: 1500, revenue: 5200, growth: 2600 },
    { month: "May", users: 1700, revenue: 5500, growth: 2800 },
    { month: "Jun", users: 1600, revenue: 5300, growth: 2700 },
    { month: "Jul", users: 1800, revenue: 5700, growth: 3000 },
    { month: "Aug", users: 2000, revenue: 6000, growth: 3200 },
    { month: "Sep", users: 1900, revenue: 5800, growth: 3100 },
    { month: "Oct", users: 2100, revenue: 6200, growth: 3300 },
    { month: "Nov", users: 2300, revenue: 6500, growth: 3500 },
    { month: "Dec", users: 2500, revenue: 6800, growth: 3700 },
  ];

  // State for chart colors
  const [chartColors, setChartColors] = useState({
    chart1: "hsl(262.1 83.3% 57.8%)",
    chart2: "hsl(173 58% 39%)",
    chart3: "hsl(197 37% 24%)",
    background: "hsl(0 0% 100%)",
  });

  // Update colors when theme changes
  useEffect(() => {
    let isMounted = true;

    setMounted(true);

    // Function to update colors when CSS variables change
    const updateColors = () => {
      if (!isMounted) return;

      setChartColors({
        chart1: getCSSVariableColor("--chart-1"),
        chart2: getCSSVariableColor("--chart-2"),
        chart3: getCSSVariableColor("--chart-3"),
        background: getCSSVariableColor("--background"),
      });
    };

    // Create an observer to watch for style changes
    const observer = new MutationObserver(updateColors);

    // Observe changes to style attribute and class on document.documentElement
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
  const maxUsers = Math.max(...data.map((d) => d.users));
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxGrowth = Math.max(...data.map((d) => d.growth));

  const yScaleUsers = (value: number) =>
    chartHeight - (value / maxUsers) * chartHeight;
  const yScaleRevenue = (value: number) =>
    chartHeight - (value / maxRevenue) * chartHeight;
  const yScaleGrowth = (value: number) =>
    chartHeight - (value / maxGrowth) * chartHeight;

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;

  // Generate paths
  const usersPathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScaleUsers(d.users);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const revenuePathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScaleRevenue(d.revenue);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const growthPathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScaleGrowth(d.growth);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

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
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map(
            (d, i) =>
              i % 2 === 0 && (
                <text
                  key={i}
                  x={xScale(i)}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fontSize={10}
                  fill="hsl(var(--muted-foreground))"
                >
                  {d.month}
                </text>
              )
          )}

          {/* Users line */}
          <path
            d={usersPathData}
            fill="none"
            stroke={chartColors.chart1}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Revenue line */}
          <path
            d={revenuePathData}
            fill="none"
            stroke={chartColors.chart2}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Growth line */}
          <path
            d={growthPathData}
            fill="none"
            stroke={chartColors.chart3}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points - Users */}
          {data.map((d, i) => (
            <circle
              key={`users-${i}`}
              cx={xScale(i)}
              cy={yScaleUsers(d.users)}
              r={3}
              fill={chartColors.background}
              stroke={chartColors.chart1}
              strokeWidth={2}
            />
          ))}

          {/* Data points - Revenue */}
          {data.map((d, i) => (
            <circle
              key={`revenue-${i}`}
              cx={xScale(i)}
              cy={yScaleRevenue(d.revenue)}
              r={3}
              fill={chartColors.background}
              stroke={chartColors.chart2}
              strokeWidth={2}
            />
          ))}

          {/* Data points - Growth */}
          {data.map((d, i) => (
            <circle
              key={`growth-${i}`}
              cx={xScale(i)}
              cy={yScaleGrowth(d.growth)}
              r={3}
              fill={chartColors.background}
              stroke={chartColors.chart3}
              strokeWidth={2}
            />
          ))}

          {/* Legend */}
          <g transform={`translate(${chartWidth - 150}, 10)`}>
            <g>
              <line
                x1={0}
                y1={0}
                x2={20}
                y2={0}
                stroke={chartColors.chart1}
                strokeWidth={2}
              />
              <text x={25} y={4} fontSize={10} fill="hsl(var(--foreground))">
                Users
              </text>
            </g>
            <g transform="translate(0, 15)">
              <line
                x1={0}
                y1={0}
                x2={20}
                y2={0}
                stroke={chartColors.chart2}
                strokeWidth={2}
              />
              <text x={25} y={4} fontSize={10} fill="hsl(var(--foreground))">
                Revenue
              </text>
            </g>
            <g transform="translate(0, 30)">
              <line
                x1={0}
                y1={0}
                x2={20}
                y2={0}
                stroke={chartColors.chart3}
                strokeWidth={2}
              />
              <text x={25} y={4} fontSize={10} fill="hsl(var(--foreground))">
                Growth
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
