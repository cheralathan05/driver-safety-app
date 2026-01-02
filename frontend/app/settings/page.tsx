"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, Battery, Moon, Globe, Shield, Eye } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, user, updateSettings } = useDriverStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    toast.success("Setting updated")
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="Settings">
      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Settings
            </CardTitle>
            <CardDescription>Configure alert sounds and voice notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alert Sounds</Label>
                <p className="text-sm text-muted-foreground">Play sound when alerts are triggered</p>
              </div>
              <Switch
                checked={user?.settings?.alertSoundEnabled ?? true}
                onCheckedChange={(checked) => handleSettingChange("alertSoundEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Voice Alerts</Label>
                <p className="text-sm text-muted-foreground">Speak alert messages aloud</p>
              </div>
              <Switch
                checked={user?.settings?.voiceAlertsEnabled ?? true}
                onCheckedChange={(checked) => handleSettingChange("voiceAlertsEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detection Settings
            </CardTitle>
            <CardDescription>Adjust AI detection sensitivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Sensitivity Level</Label>
                <Select
                  value={user?.settings?.sensitivityLevel ?? "medium"}
                  onValueChange={(value) => handleSettingChange("sensitivityLevel", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Higher sensitivity means more alerts but may include false positives
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Configure visual preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Night Mode</Label>
                <p className="text-sm text-muted-foreground">Automatically switch to dark mode at night</p>
              </div>
              <Switch
                checked={user?.settings?.nightModeAuto ?? true}
                onCheckedChange={(checked) => handleSettingChange("nightModeAuto", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Battery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5" />
              Battery Settings
            </CardTitle>
            <CardDescription>Optimize for battery life</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Battery Saver Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce AI processing frequency to save battery</p>
              </div>
              <Switch
                checked={user?.settings?.batterySaverMode ?? false}
                onCheckedChange={(checked) => handleSettingChange("batterySaverMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language
            </CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={user?.settings?.language ?? "en"}
              onValueChange={(value) => handleSettingChange("language", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span>2024.11.29</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
