"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80, tablet: 34 },
  { month: "February", desktop: 305, mobile: 200, tablet: 55 },
  { month: "March", desktop: 237, mobile: 120, tablet: 75 },
  { month: "April", desktop: 173, mobile: 190, tablet: 65 },
  { month: "May", desktop: 209, mobile: 130, tablet: 85 },
  { month: "June", desktop: 214, mobile: 140, tablet: 95 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function DeviceUsageChart() {
  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => Number(value).toLocaleString()} />} />
          <Area
            type="monotone"
            dataKey="tablet"
            stackId="1"
            stroke="var(--color-tablet)"
            fill="var(--color-tablet)"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="mobile"
            stackId="1"
            stroke="var(--color-mobile)"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="desktop"
            stackId="1"
            stroke="var(--color-desktop)"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

