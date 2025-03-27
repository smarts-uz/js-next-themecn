"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

// Import the color utility
import { getCSSVariableColor } from "./color-utils"

export function LineChart() {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Dummy data for the chart
  const data = [
    { month: "Jan", value: 4200 },
    { month: "Feb", value: 3800 },
    { month: "Mar", value: 5100 },
    { month: "Apr", value: 5400 },
    { month: "May", value: 4900 },
    { month: "Jun", value: 6300 },
    { month: "Jul", value: 5800 },
    { month: "Aug", value: 6100 },
    { month: "Sep", value: 6500 },
    { month: "Oct", value: 7000 },
    { month: "Nov", value: 7300 },
    { month: "Dec", value: 7800 },
  ]

  // Inside the component, add this:
  const [chartColors, setChartColors] = useState({
    chart1: "hsl(1 84% 63%)",
    background: "hsl(0 0% 100%)",
  })

  // Update the useEffect to ensure chart colors are updated when theme changes
  useEffect(() => {
    let isMounted = true
    let observer: MutationObserver

    setMounted(true)

    // Function to update colors when CSS variables change
    const updateColors = () => {
      if (!isMounted) return

      setChartColors({
        chart1: getCSSVariableColor("--chart-1"),
        background: getCSSVariableColor("--background"),
      })
    }

    // Create an observer to watch for style changes
    observer = new MutationObserver(updateColors)

    // Observe changes to style attribute on document.documentElement
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    // Initial update
    updateColors()

    // Cleanup
    return () => {
      isMounted = false
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  if (!mounted) return null

  // Calculate chart dimensions
  const width = ref.current?.clientWidth || 600
  const height = ref.current?.clientHeight || 300
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate scales
  const maxValue = Math.max(...data.map((d) => d.value))
  const yScale = (value: number) => chartHeight - (value / maxValue) * chartHeight
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth

  // Generate path
  const pathData = data
    .map((d, i) => {
      const x = xScale(i)
      const y = yScale(d.value)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  // Generate area path (for gradient fill)
  const areaPathData = `${pathData} L ${xScale(data.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`

  // Add a function to get the primary chart color
  const getChartColor = () => {
    if (typeof window === "undefined") {
      return "#e57373" // Fallback color for SSR
    }
    return getCSSVariableColor("--chart-1")
  }

  // Use the color in the chart
  const chartColor = mounted ? getChartColor() : "#e57373"

  return (
    <div ref={ref} className="w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {/* Then update the gradient and paths to use chartColors.chart1 instead of var(--chart-1) */}
          {/* For example: */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={chartColors.chart1} stopOpacity="0.5" />
            <stop offset="100%" stopColor={chartColors.chart1} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = chartHeight - tick * chartHeight
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
                  ${Math.round(maxValue * tick).toLocaleString()}
                </text>
              </g>
            )
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
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
          ))}

          {/* Area fill */}
          <path d={areaPathData} fill="url(#lineGradient)" />

          {/* Line */}
          {/* And for the stroke: */}
          <path
            d={pathData}
            fill="none"
            stroke={chartColors.chart1}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {/* And for the data points: */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.value)}
              r={4}
              fill={chartColors.background}
              stroke={chartColors.chart1}
              strokeWidth={2}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

