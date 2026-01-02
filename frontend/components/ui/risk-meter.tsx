"use client"

import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/types"

interface RiskMeterProps {
  level: RiskLevel
  score?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
}

export function RiskMeter({ level, score = 0, size = "md", showLabel = true, animated = true }: RiskMeterProps) {
  const sizes = {
    sm: { outer: "w-20 h-20", inner: "w-14 h-14", text: "text-lg" },
    md: { outer: "w-32 h-32", inner: "w-24 h-24", text: "text-2xl" },
    lg: { outer: "w-40 h-40", inner: "w-32 h-32", text: "text-3xl" },
  }

  const colors = {
    safe: { bg: "bg-safe/20", border: "border-safe", text: "text-safe", glow: "shadow-safe/30" },
    moderate: { bg: "bg-warning/20", border: "border-warning", text: "text-warning", glow: "shadow-warning/30" },
    high: { bg: "bg-danger/20", border: "border-danger", text: "text-danger", glow: "shadow-danger/30" },
    critical: {
      bg: "bg-emergency/20",
      border: "border-emergency",
      text: "text-emergency",
      glow: "shadow-emergency/30",
    },
  }

  const labels = {
    safe: "Safe",
    moderate: "Caution",
    high: "High Risk",
    critical: "Critical",
  }

  const colorSet = colors[level]
  const sizeSet = sizes[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-4 transition-all duration-500",
          sizeSet.outer,
          colorSet.bg,
          colorSet.border,
          animated && level !== "safe" && "animate-pulse",
          animated && level === "high" && "animate-pulse-warning",
          animated && level === "critical" && "animate-pulse-danger",
          `shadow-xl ${colorSet.glow}`,
        )}
      >
        <div className={cn("flex flex-col items-center justify-center rounded-full bg-background", sizeSet.inner)}>
          <span className={cn("font-bold", sizeSet.text, colorSet.text)}>{Math.round(score)}%</span>
        </div>

        {/* Animated ring */}
        {animated && level !== "safe" && (
          <div
            className={cn(
              "absolute inset-0 rounded-full border-2 opacity-50",
              colorSet.border,
              level === "moderate" && "animate-ping",
              level === "high" && "animate-ping",
              level === "critical" && "animate-ping",
            )}
            style={{ animationDuration: level === "critical" ? "0.75s" : level === "high" ? "1s" : "1.5s" }}
          />
        )}
      </div>

      {showLabel && <span className={cn("text-sm font-medium", colorSet.text)}>{labels[level]}</span>}
    </div>
  )
}
