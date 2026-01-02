"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, CloudFog, CloudLightning, Snowflake, Droplets, Wind, Eye } from "lucide-react"
import type { WeatherData, WeatherCondition } from "@/lib/types"

interface WeatherCardProps {
  weather: WeatherData
  compact?: boolean
  className?: string
}

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  heavy_rain: CloudRain,
  fog: CloudFog,
  storm: CloudLightning,
  snow: Snowflake,
}

const weatherColors: Record<WeatherCondition, string> = {
  clear: "text-chart-3 bg-chart-3/10",
  cloudy: "text-muted-foreground bg-muted",
  rain: "text-chart-1 bg-chart-1/10",
  heavy_rain: "text-danger bg-danger/10",
  fog: "text-muted-foreground bg-muted",
  storm: "text-warning bg-warning/10",
  snow: "text-chart-1 bg-chart-1/10",
}

export function WeatherCard({ weather, compact = false, className }: WeatherCardProps) {
  const Icon = weatherIcons[weather.condition] || Cloud
  const colorClass = weatherColors[weather.condition]

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-muted/50", className)}>
        <div className={cn("p-1.5 rounded-md", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">{weather.city}</span>
          <span className="text-[10px] text-muted-foreground">{weather.temperature}°C</span>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-foreground">{weather.city}</p>
            <p className="text-xs text-muted-foreground capitalize">{weather.condition.replace("_", " ")}</p>
          </div>
          <div className={cn("p-2 rounded-lg", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <div className="text-3xl font-bold text-foreground mb-3">{weather.temperature}°C</div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{weather.visibility} km</span>
          </div>
        </div>

        {weather.alerts.length > 0 && (
          <div className="mt-3 p-2 rounded-md bg-warning/10 border border-warning/20">
            <p className="text-xs text-warning font-medium">⚠️ {weather.alerts[0]}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
