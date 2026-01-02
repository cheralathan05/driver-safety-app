"use client"

import { Bell, Search, Menu, Wifi, Battery, Signal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDriverStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface TopBarProps {
  title?: string
  showSearch?: boolean
  onMenuClick?: () => void
}

export function TopBar({ title, showSearch = false, onMenuClick }: TopBarProps) {
  const { alerts, currentLocation, isMonitoring } = useDriverStore()
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 5)

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>

          {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}

          {showSearch && (
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search trips, alerts..." className="w-64 pl-9 bg-muted/50" />
              </div>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Signal className={cn("w-3 h-3", isMonitoring ? "text-safe" : "text-muted-foreground")} />
              <Wifi className={cn("w-3 h-3", currentLocation ? "text-safe" : "text-muted-foreground")} />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unacknowledgedAlerts.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {unacknowledgedAlerts.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unacknowledgedAlerts.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unacknowledgedAlerts.length} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unacknowledgedAlerts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              ) : (
                unacknowledgedAlerts.map((alert) => (
                  <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          alert.severity === "safe" && "bg-safe",
                          alert.severity === "moderate" && "bg-warning",
                          alert.severity === "high" && "bg-danger",
                          alert.severity === "critical" && "bg-emergency",
                        )}
                      />
                      <span className="font-medium text-sm capitalize">{alert.type.replace("_", " ")}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Confidence: {Math.round(alert.confidence * 100)}%
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
