"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked area chart"

const chartData = [
  { day: "MON", lastMonth: 15000, thisMonth: 12000 },
  { day: "TUE", lastMonth: 14000, thisMonth: 18000 },
  { day: "WED", lastMonth: 22000, thisMonth: 15000 },
  { day: "THU", lastMonth: 8000, thisMonth: 26000 },
  { day: "FRI", lastMonth: 16000, thisMonth: 28000 },
  { day: "SAT", lastMonth: 24000, thisMonth: 22000 },
  { day: "SUN", lastMonth: 28000, thisMonth: 24000 },
]

const chartConfig = {
  lastMonth: {
    label: "Last Month",
    color: "#FDB022",
  },
  thisMonth: {
    label: "This Month",
    color: "#3B82F6",
  },
}

export function ChartAreaStacked() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Revenue</option>
            <option>Users</option>
            <option>Orders</option>
          </select>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#FDB022] rounded-full"></div>
              <span className="text-gray-600">Last Month</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
              <span className="text-gray-600">This Month</span>
            </div>
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Month</option>
            <option>Week</option>
            <option>Year</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[380px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 20,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillLastMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FDB022" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FDB022" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="fillThisMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <ChartTooltip
              cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="lastMonth"
              type="monotone"
              fill="url(#fillLastMonth)"
              fillOpacity={1}
              stroke="#FDB022"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Area
              dataKey="thisMonth"
              type="monotone"
              fill="url(#fillThisMonth)"
              fillOpacity={1}
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
