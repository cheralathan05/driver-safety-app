"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Car,
  Map,
  History,
  AlertTriangle,
  Settings,
  HelpCircle,
  Shield,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useDriverStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/drive", icon: Car, label: "Start Drive", highlight: true },
  { href: "/tracking", icon: Map, label: "Live Tracking" },
  { href: "/history", icon: History, label: "Trip History" },
  { href: "/emergency", icon: AlertTriangle, label: "Emergency", badge: "SOS" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/support", icon: HelpCircle, label: "Support" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const { user, alerts, riskLevel, isMonitoring, reset } = useDriverStore()

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 h-16">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-primary/10",
            collapsed ? "w-10 h-10" : "w-10 h-10",
          )}
        >
          <Shield className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground text-sm">Driver Safety</span>
            <span className="text-[10px] text-sidebar-foreground/60">AI Monitoring</span>
          </div>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Status indicator */}
      {isMonitoring && (
        <div
          className={cn(
            "mx-3 mt-3 p-2 rounded-lg",
            riskLevel === "safe" && "bg-safe/10 border border-safe/20",
            riskLevel === "moderate" && "bg-warning/10 border border-warning/20",
            riskLevel === "high" && "bg-danger/10 border border-danger/20",
            riskLevel === "critical" && "bg-emergency/10 border border-emergency/20",
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  riskLevel === "safe" && "bg-safe animate-pulse",
                  riskLevel === "moderate" && "bg-warning animate-pulse",
                  riskLevel === "high" && "bg-danger animate-pulse",
                  riskLevel === "critical" && "bg-emergency animate-pulse",
                )}
              />
              <span className="text-xs font-medium text-sidebar-foreground">
                {riskLevel === "safe" && "Monitoring Active"}
                {riskLevel === "moderate" && "Caution Advised"}
                {riskLevel === "high" && "High Risk Detected"}
                {riskLevel === "critical" && "CRITICAL ALERT"}
              </span>
            </div>
          )}
          {collapsed && (
            <div
              className={cn(
                "w-3 h-3 rounded-full mx-auto",
                riskLevel === "safe" && "bg-safe animate-pulse",
                riskLevel === "moderate" && "bg-warning animate-pulse",
                riskLevel === "high" && "bg-danger animate-pulse",
                riskLevel === "critical" && "bg-emergency animate-pulse",
              )}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                item.highlight && !isActive && "border border-primary/30 hover:border-primary/50",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive && "text-sidebar-primary",
                  item.highlight && !isActive && "text-primary",
                )}
              />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && item.label === "Emergency" && unacknowledgedAlerts > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px] px-1.5">
                      {unacknowledgedAlerts}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Theme toggle */}
      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "justify-center",
          )}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!collapsed && <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-auto p-2 justify-start gap-3 hover:bg-sidebar-accent/50",
                collapsed && "justify-center",
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">
                    {user?.name || "Guest User"}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/60 truncate max-w-[120px]">
                    {user?.email || "Sign in to continue"}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => reset()} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </aside>
  )
}
