"use client"

import { useState, useCallback, useEffect } from "react"
import { useDriverStore } from "@/lib/store"

export function useLocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setLocation, currentLocation } = useDriverStore()

  const getCurrentPosition = useCallback(() => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
        // Set default location for demo
        setLocation({ lat: 11.0168, lng: 76.9558 }) // Coimbatore
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [setLocation])

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return null
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        setError(err.message)
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    )

    return watchId
  }, [setLocation])

  // Get initial position on mount
  useEffect(() => {
    if (!currentLocation) {
      getCurrentPosition()
    }
  }, [])

  return {
    getCurrentPosition,
    watchPosition,
    currentLocation,
    loading,
    error,
  }
}
