"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CameraFeed } from "@/components/ai/camera-feed"
import { DetectionOverlay } from "@/components/ai/detection-overlay"
import { RiskMeter } from "@/components/ui/risk-meter"
import { GoogleMapView } from "@/components/map/google-map-view"
import { WeatherCard } from "@/components/ui/weather-card"
import { AlertPopup } from "@/components/safety/alert-popup"
import { SOSPopup } from "@/components/safety/sos-popup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Square, MapPin, Navigation, Clock, Route, Gauge, Phone } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { useAIDetection } from "@/hooks/use-ai-detection"
import { useWeather } from "@/hooks/use-weather"
import { useLocation } from "@/hooks/use-location"
import type { Alert, WeatherData } from "@/lib/types"

export default function DrivePage() {
  const router = useRouter()
  const {
    isAuthenticated,
    isMonitoring,
    setMonitoring,
    riskLevel,
    alerts,
    currentTrip,
    startTrip,
    endTrip,
    acknowledgeAlert,
    triggerSOS,
    sosActive,
    setDestination,
    destination,
    currentLocation,
  } = useDriverStore()

  const { processFrame } = useAIDetection()
  const { getRouteWeather } = useWeather()
  const { watchPosition } = useLocation()

  const [showSetup, setShowSetup] = useState(true)
  const [destinationInput, setDestinationInput] = useState("")
  const [routeWeather, setRouteWeather] = useState<WeatherData[]>([])
  const [tripDuration, setTripDuration] = useState(0)
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Watch position when monitoring
  useEffect(() => {
    if (isMonitoring) {
      const watchId = watchPosition()
      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [isMonitoring, watchPosition])

  // Trip duration timer
  useEffect(() => {
    if (!isMonitoring) return
    const interval = setInterval(() => {
      setTripDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isMonitoring])

  // Handle alerts
  useEffect(() => {
    const unacknowledged = alerts.find((a) => !a.acknowledged && (a.severity === "high" || a.severity === "critical"))
    if (unacknowledged && !activeAlert) {
      setActiveAlert(unacknowledged)
    }
  }, [alerts, activeAlert])

  const handleStartTrip = async () => {
    if (!destinationInput) return

    setDestination({
      lat: 11.0168 + (Math.random() - 0.5) * 0.5,
      lng: 76.9558 + (Math.random() - 0.5) * 0.5,
      address: destinationInput,
    })

    // Get weather for route cities
    const cities = [destinationInput.split(",")[0], "Route City", destinationInput]
    const weather = await getRouteWeather(cities)
    setRouteWeather(weather)

    startTrip({
      id: `trip-${Date.now()}`,
      userId: "user-1",
      startLocation: {
        lat: currentLocation?.lat || 11.0168,
        lng: currentLocation?.lng || 76.9558,
        timestamp: new Date(),
      },
      waypoints: [],
      startTime: new Date(),
      status: "active",
      distance: 0,
      duration: 0,
      alerts: [],
      fatigueScore: 100,
      safetyScore: 100,
    })

    setShowSetup(false)
    setTripDuration(0)
  }

  const handleEndTrip = () => {
    endTrip()
    setShowSetup(true)
    setTripDuration(0)
    setRouteWeather([])
  }

  const handleDismissAlert = useCallback(() => {
    if (activeAlert) {
      acknowledgeAlert(activeAlert.id)
      setActiveAlert(null)
    }
  }, [activeAlert, acknowledgeAlert])

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="Drive">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Alert popup */}
        {activeAlert && <AlertPopup alert={activeAlert} onDismiss={handleDismissAlert} />}

        {/* SOS popup */}
        <SOSPopup />

        {showSetup ? (
          /* Trip Setup */
          <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Navigation className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Start Your Trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Where are you going?</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="Enter destination..."
                      className="pl-9"
                      value={destinationInput}
                      onChange={(e) => setDestinationInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Current: {currentLocation ? "Location detected" : "Detecting..."}
                  </p>
                </div>

                <Button className="w-full" size="lg" onClick={handleStartTrip} disabled={!destinationInput}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Monitoring
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Drive View */
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left panel - Camera + AI */}
            <div className="lg:w-1/2 p-4 flex flex-col gap-4">
              {/* Camera feed */}
              <div className="relative flex-1 min-h-[300px]">
                <CameraFeed onFrame={processFrame} className="w-full h-full" />

                {/* Risk meter overlay */}
                <div className="absolute top-4 right-4">
                  <RiskMeter
                    level={riskLevel}
                    score={riskLevel === "safe" ? 95 : riskLevel === "moderate" ? 75 : riskLevel === "high" ? 45 : 20}
                    size="sm"
                    showLabel={false}
                  />
                </div>

                {/* Trip info overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur rounded-lg">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{formatDuration(tripDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur rounded-lg">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">45 km/h</span>
                  </div>
                </div>
              </div>

              {/* Detection overlay */}
              <Card>
                <CardContent className="p-4">
                  <DetectionOverlay />
                </CardContent>
              </Card>

              {/* Control buttons */}
              <div className="flex gap-3">
                <Button variant="destructive" className="flex-1" onClick={handleEndTrip}>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </Button>
                <Button
                  variant="outline"
                  className="border-danger text-danger hover:bg-danger hover:text-white bg-transparent"
                  onClick={triggerSOS}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  SOS
                </Button>
              </div>
            </div>

            {/* Right panel - Map + Weather */}
            <div className="lg:w-1/2 p-4 flex flex-col gap-4">
              {/* Map */}
              <GoogleMapView className="flex-1 min-h-[300px]" showRoute={!!destination} />

              {/* Route info */}
              {destination && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Route className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{destination.address}</p>
                        <p className="text-xs text-muted-foreground">Estimated: 45 min • 32 km</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weather along route */}
              {routeWeather.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Weather Along Route</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {routeWeather.map((weather, idx) => (
                        <WeatherCard key={idx} weather={weather} compact className="shrink-0" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
