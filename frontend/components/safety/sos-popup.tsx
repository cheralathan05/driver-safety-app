"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, AlertTriangle, CheckCircle } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"

export function SOSPopup() {
  const [countdown, setCountdown] = useState(10)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { sosActive, cancelSOS, user, currentLocation } = useDriverStore()

  useEffect(() => {
    if (!sosActive) {
      setCountdown(10)
      setSending(false)
      setSent(false)
      return
    }

    // Play SOS alarm
    try {
      audioRef.current = new Audio("/videos/alert-sound.mp3")
      audioRef.current.loop = true
      audioRef.current.play().catch(() => {})
    } catch (e) {}

    // Countdown to auto-send
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          sendEmergencyAlert()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [sosActive])

  const sendEmergencyAlert = async () => {
    setSending(true)

    // Simulate sending alert
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSending(false)
    setSent(true)

    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handleCancel = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    cancelSOS()
  }

  if (!sosActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-emergency/95 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background rounded-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-emergency p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Emergency Alert</h2>
          <p className="text-white/90 mt-1">
            {sent ? "Alert sent to emergency contacts" : "Sending emergency alert..."}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!sent && (
            <>
              <div className="text-center">
                <div className="text-5xl font-bold text-danger mb-2">{countdown}</div>
                <p className="text-sm text-muted-foreground">Alert will be sent automatically</p>
              </div>

              <Progress value={(10 - countdown) * 10} className="h-2" />
            </>
          )}

          {sent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-safe/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-safe" />
                <span className="text-sm text-foreground">
                  SMS sent to {user?.emergencyContacts?.[0]?.name || "Emergency Contact"}
                </span>
              </div>

              {currentLocation && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Location shared</p>
                    <p className="text-xs text-muted-foreground">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Live tracking active</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          {!sent ? (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                I'm Safe - Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={sendEmergencyAlert} disabled={sending}>
                {sending ? "Sending..." : "Send Now"}
              </Button>
            </div>
          ) : (
            <Button className="w-full" onClick={handleCancel}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
