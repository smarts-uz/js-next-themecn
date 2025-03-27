"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Update the stacked area chart to show revenue data
const chartData = [
  { month: "Jan", subscription: 2400, oneTime: 1200, recurring: 800 },
  { month: "Feb", subscription: 2700, oneTime: 1400, recurring: 900 },
  { month: "Mar", subscription: 2900, oneTime: 1500, recurring: 1100 },
  { month: "Apr", subscription: 3100, oneTime: 1700, recurring: 1200 },
  { month: "May", subscription: 3300, oneTime: 1800, recurring: 1400 },
  { month: "Jun", subscription: 3500, oneTime: 2000, recurring: 1500 },
  { month: "Jul", subscription: 3700, oneTime: 2100, recurring: 1600 },
  { month: "Aug", subscription: 3900, oneTime: 2300, recurring: 1800 },
  { month: "Sep", subscription: 4100, oneTime: 2400, recurring: 1900 },
  { month: "Oct", subscription: 4300, oneTime: 2600, recurring: 2100 },
  { month: "Nov", subscription: 4500, oneTime: 2700, recurring: 2200 },
  { month: "Dec", subscription: 4800, oneTime: 2900, recurring: 2300 },
]

const chartConfig = {
  subscription: {
    label: "Subscription",
    color: "hsl(var(--chart-1))",
  },
  oneTime: {
    label: "One-time",
    color: "hsl(var(--chart-2))",
  },
  recurring: {
    label: "Recurring",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function StackedAreaChart() {
  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig}>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                {Object.entries(chartConfig).map(([key, config]) => (
                  <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.2} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value / 1000}k`}
                fontSize={12}
                stroke="var(--muted-foreground)"
                width={45}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
              />
              <Area
                type="monotone"
                dataKey="recurring"
                stackId="1"
                stroke={chartConfig.recurring.color}
                fill={`url(#color-recurring)`}
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="oneTime"
                stackId="1"
                stroke={chartConfig.oneTime.color}
                fill={`url(#color-oneTime)`}
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="subscription"
                stackId="1"
                stroke={chartConfig.subscription.color}
                fill={`url(#color-subscription)`}
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span>Revenue increased by 18.2% compared to last year</span>
      </div>
    </div>
  )
}

