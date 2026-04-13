"use client"

import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { readStoredAuth, resolveAccessToken } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A stacked area chart"

const chartConfig = {
  previous: {
    label: "Last Month",
    color: "#FDB022",
  },
  current: {
    label: "This Month",
    color: "#3B82F6",
  },
}

const periodOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
]

const metricOptions = [
  { label: "Users", value: "user" },
  { label: "Payments", value: "payment" },
]

const getAccessToken = (authTokens) =>
  resolveAccessToken(authTokens) || resolveAccessToken(readStoredAuth()?.tokens)

const formatAxisLabel = (label, granularity) => {
  if (!label) {
    return ""
  }

  try {
    const parsedDate = parseISO(label)

    if (granularity === "day") {
      return format(parsedDate, "MMM d")
    }

    if (granularity === "week") {
      return format(parsedDate, "MMM d")
    }

    if (granularity === "month") {
      return format(parsedDate, "MMM yyyy")
    }
  } catch {
    return label
  }

  return label
}

const buildChartData = (payload) => {
  const labels = Array.isArray(payload?.labels) ? payload.labels : []
  const current = Array.isArray(payload?.current) ? payload.current : []
  const previous = Array.isArray(payload?.previous) ? payload.previous : []

  return labels.map((label, index) => ({
    label,
    displayLabel: formatAxisLabel(label, payload?.granularity),
    current: Number(current[index] ?? 0),
    previous: Number(previous[index] ?? 0),
  }))
}

const formatYAxisTick = (value) => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }

  return `${value}`
}

export function ChartAreaStacked({ authTokens }) {
  const [selectedMetric, setSelectedMetric] = useState("user")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [chartData, setChartData] = useState([])
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    const loadGrowthGraph = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const accessToken = getAccessToken(authTokens)

      if (!baseUrl) {
        setStatus("failed")
        setError("Missing NEXT_PUBLIC_API_BASE_URL")
        return
      }

      if (!accessToken) {
        setStatus("failed")
        setError("Missing access token")
        return
      }

      setStatus("loading")
      setError("")

      const params = new URLSearchParams({
        period: selectedPeriod,
        metric: selectedMetric,
      })

      try {
        const response = await fetch(
          `${baseUrl}/analytics/system/growth-graph?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        )

        const payload = await response.json().catch(() => null)

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Failed to load growth graph")
        }

        setChartData(buildChartData(payload.data))
        setSummary(payload?.data?.summary || null)
        setStatus("succeeded")
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return
        }

        setStatus("failed")
        setError(fetchError.message || "Failed to load growth graph")
      }
    }

    loadGrowthGraph()

    return () => controller.abort()
  }, [authTokens, selectedMetric, selectedPeriod])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedMetric}
            onChange={(event) => setSelectedMetric(event.target.value)}
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#FDB022]" />
              <span className="text-gray-600">Last Month</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#3B82F6]" />
              <span className="text-gray-600">This Month</span>
            </div>
          </div>

          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {status === "failed" ? (
          <div className="flex h-[380px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 px-4 text-sm text-red-600">
            {error}
          </div>
        ) : (
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
                <linearGradient id="fillPreviousPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDB022" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#FDB022" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="fillCurrentPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="displayLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={24}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                allowDecimals={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={formatYAxisTick}
              />
              <ChartTooltip
                cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.label || ""}
                  />
                }
              />
              <Area
                dataKey="previous"
                name="previous"
                type="monotone"
                fill="url(#fillPreviousPeriod)"
                fillOpacity={1}
                stroke="#FDB022"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Area
                dataKey="current"
                name="current"
                type="monotone"
                fill="url(#fillCurrentPeriod)"
                fillOpacity={1}
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}

        {status === "loading" ? (
          <p className="mt-3 text-sm text-gray-500">Loading growth graph...</p>
        ) : null}
        {status === "succeeded" && summary ? (
          <p className="mt-3 text-sm text-gray-500">
            Growth: <span className="font-medium text-gray-700">{summary.growthPercent ?? 0}%</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
