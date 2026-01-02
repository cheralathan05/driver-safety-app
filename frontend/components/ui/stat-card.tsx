"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: number; label: string }
  variant?: "default" | "primary" | "safe" | "warning" | "danger"
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  const variants = {
    default: "bg-card",
    primary: "bg-primary/5 border-primary/20",
    safe: "bg-safe/5 border-safe/20",
    warning: "bg-warning/5 border-warning/20",
    danger: "bg-danger/5 border-danger/20",
  }

  const iconVariants = {
    default: "text-muted-foreground bg-muted",
    primary: "text-primary bg-primary/10",
    safe: "text-safe bg-safe/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
  }

  return (
    <Card className={cn("border", variants[variant], className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-safe" : "text-danger")}>
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-2 rounded-lg", iconVariants[variant])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
