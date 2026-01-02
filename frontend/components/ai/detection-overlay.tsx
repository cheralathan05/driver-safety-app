"use client"

import { cn } from "@/lib/utils"
import { useDriverStore } from "@/lib/store"
import { Eye, EyeOff, Phone, AlertTriangle, User, Frown } from "lucide-react"

interface DetectionOverlayProps {
  className?: string
}

export function DetectionOverlay({ className }: DetectionOverlayProps) {
  const { currentDetection, riskLevel, isMonitoring } = useDriverStore()

  if (!isMonitoring || !currentDetection) return null

  const indicators = [
    {
      label: "Face",
      detected: currentDetection.faceDetected,
      icon: currentDetection.faceDetected ? User : EyeOff,
      status: currentDetection.faceDetected ? "ok" : "warning",
    },
    {
      label: "Eyes",
      detected: currentDetection.drowsinessScore < 50,
      icon: currentDetection.drowsinessScore < 50 ? Eye : EyeOff,
      status:
        currentDetection.drowsinessScore < 50 ? "ok" : currentDetection.drowsinessScore < 80 ? "warning" : "danger",
      value: `${Math.round(100 - currentDetection.drowsinessScore)}%`,
    },
    {
      label: "Phone",
      detected: !currentDetection.phoneUsageDetected,
      icon: Phone,
      status: currentDetection.phoneUsageDetected ? "danger" : "ok",
    },
    {
      label: "Focus",
      detected: currentDetection.distractionScore < 50,
      icon: currentDetection.distractionScore < 50 ? Eye : AlertTriangle,
      status:
        currentDetection.distractionScore < 50 ? "ok" : currentDetection.distractionScore < 80 ? "warning" : "danger",
      value: `${Math.round(100 - currentDetection.distractionScore)}%`,
    },
    {
      label: "Yawn",
      detected: !currentDetection.yawning,
      icon: Frown,
      status: currentDetection.yawning ? "warning" : "ok",
    },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {/* Detection indicators */}
      <div className="grid grid-cols-5 gap-2">
        {indicators.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              item.status === "ok" && "bg-safe/10",
              item.status === "warning" && "bg-warning/10",
              item.status === "danger" && "bg-danger/10",
            )}
          >
            <item.icon
              className={cn(
                "w-4 h-4",
                item.status === "ok" && "text-safe",
                item.status === "warning" && "text-warning",
                item.status === "danger" && "text-danger",
              )}
            />
            <span className="text-[10px] font-medium text-foreground">{item.label}</span>
            {item.value && (
              <span
                className={cn(
                  "text-[10px]",
                  item.status === "ok" && "text-safe",
                  item.status === "warning" && "text-warning",
                  item.status === "danger" && "text-danger",
                )}
              >
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Head pose indicator */}
      <div className="p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Head Position</span>
          <span
            className={cn(
              "text-xs font-medium",
              Math.abs(currentDetection.headPose.yaw) < 15 ? "text-safe" : "text-warning",
            )}
          >
            {Math.abs(currentDetection.headPose.yaw) < 15 ? "Forward" : "Turned"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full relative">
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-200",
                  Math.abs(currentDetection.headPose.yaw) < 15 ? "bg-safe" : "bg-warning",
                )}
                style={{
                  left: `${50 + (currentDetection.headPose.yaw / 90) * 50}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
