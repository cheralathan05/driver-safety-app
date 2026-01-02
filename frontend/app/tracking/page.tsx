"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GoogleMapView } from "@/components/map/google-map-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Gauge, Share2, Users } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { useLocation } from "@/hooks/use-location"

export default function TrackingPage() {
  const router = useRouter()
  const { isAuthenticated, currentLocation, isMonitoring, user } = useDriverStore()
  const { getCurrentPosition } = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="Live Tracking">
      <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 p-4">
          <GoogleMapView className="w-full h-full" showControls />
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 p-4 space-y-4 border-t lg:border-t-0 lg:border-l border-border">
          {/* Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Status
                <Badge variant={isMonitoring ? "default" : "secondary"}>{isMonitoring ? "Active" : "Idle"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Location</p>
                  <p className="text-sm font-medium">
                    {currentLocation
                      ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                      : "Detecting..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-safe/10 flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-safe" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-sm font-medium">{isMonitoring ? "45 km/h" : "0 km/h"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-chart-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">Just now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share location */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Share Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Share your live location with emergency contacts</p>
              <Button className="w-full bg-transparent" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Live Location
              </Button>
            </CardContent>
          </Card>

          {/* Emergency contacts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.emergencyContacts?.length ? (
                <div className="space-y-2">
                  {user.emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                      </div>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts added</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
