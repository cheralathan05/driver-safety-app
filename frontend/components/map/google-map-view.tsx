"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Navigation, Layers, Minus, Plus, Locate } from "lucide-react"
import { useDriverStore } from "@/lib/store"

interface GoogleMapViewProps {
  className?: string
  showControls?: boolean
  showRoute?: boolean
}

// Simulated map component (replace with actual Google Maps in production)
export function GoogleMapView({ className, showControls = true, showRoute = false }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(14)
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")
  const { currentLocation, destination } = useDriverStore()

  // In production, this would initialize the actual Google Maps API
  useEffect(() => {
    // Google Maps initialization would go here
  }, [])

  return (
    <div className={cn("relative bg-muted rounded-xl overflow-hidden", className)}>
      {/* Map placeholder - replace with actual Google Maps embed */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          backgroundImage: `url('/dark-road-map-with-route.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Route visualization */}
        {showRoute && destination && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-4 left-4 right-4 p-3 bg-background/90 backdrop-blur rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-safe" />
                    <span className="text-xs text-foreground">Current Location</span>
                  </div>
                  <div className="w-0.5 h-4 bg-muted-foreground/30 ml-1.5" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-foreground">{destination.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current location marker */}
        {currentLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse-safe" />
              <div className="absolute inset-0 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* Map controls */}
      {showControls && (
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMapType(mapType === "roadmap" ? "satellite" : "roadmap")}
            className="bg-background/90 backdrop-blur hover:bg-background"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setZoom(Math.min(zoom + 1, 20))}
            className="bg-background/90 backdrop-blur hover:bg-background"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
            className="bg-background/90 backdrop-blur hover:bg-background"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="bg-background/90 backdrop-blur hover:bg-background">
            <Locate className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation button */}
      {showRoute && (
        <div className="absolute bottom-4 left-4 right-4">
          <Button className="w-full" size="lg">
            <Navigation className="w-4 h-4 mr-2" />
            Start Navigation
          </Button>
        </div>
      )}
    </div>
  )
}
