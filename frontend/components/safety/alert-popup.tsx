"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Volume2, VolumeX } from "lucide-react"
import { useDriverStore } from "@/lib/store"
import type { Alert } from "@/lib/types"

interface AlertPopupProps {
  alert: Alert
  onDismiss: () => void
}

export function AlertPopup({ alert, onDismiss }: AlertPopupProps) {
  const [countdown, setCountdown] = useState(10)
  const [soundMuted, setSoundMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { user } = useDriverStore()

  const alertMessages = {
    drowsiness: "Drowsiness detected! Please stay alert.",
    distraction: "You seem distracted. Keep your eyes on the road.",
    phone_usage: "Phone usage detected! Please focus on driving.",
    no_face: "Face not detected. Please look at the road.",
    yawning: "Frequent yawning detected. Consider taking a break.",
    head_drop: "Head drop detected! Stay awake.",
    seatbelt: "Please fasten your seatbelt.",
    accident: "Possible accident detected!",
  }

  useEffect(() => {
    // Play alert sound
    if (alert.severity === "high" || alert.severity === "critical") {
      try {
        audioRef.current = new Audio("/videos/alert-sound.mp3")
        audioRef.current.loop = alert.severity === "critical"
        if (!soundMuted) {
          audioRef.current.play().catch(() => {})
        }
      } catch (e) {
        // Audio not available
      }
    }

    // Countdown for auto-dismiss
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onDismiss()
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
  }, [alert, onDismiss, soundMuted])

  const toggleSound = () => {
    setSoundMuted(!soundMuted)
    if (audioRef.current) {
      if (soundMuted) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 p-4 animate-in slide-in-from-top duration-300",
        alert.severity === "moderate" && "bg-warning",
        alert.severity === "high" && "bg-danger",
        alert.severity === "critical" && "bg-emergency animate-pulse",
      )}
    >
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-full",
            alert.severity === "moderate" && "bg-background/20",
            alert.severity === "high" && "bg-background/20",
            alert.severity === "critical" && "bg-background/20 animate-bounce",
          )}
        >
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-white capitalize">{alert.type.replace("_", " ")} Alert</h3>
          <p className="text-sm text-white/90">{alertMessages[alert.type]}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full">{countdown}s</span>

          <Button variant="ghost" size="icon" onClick={toggleSound} className="text-white hover:bg-white/20">
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={onDismiss} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
