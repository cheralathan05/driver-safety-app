"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { useDriverStore } from "@/lib/store"

interface CameraFeedProps {
  onFrame?: (imageData: ImageData) => void
  className?: string
  showControls?: boolean
}

export function CameraFeed({ onFrame, className, showControls = true }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

  const { isCameraActive, setCameraActive, isMonitoring } = useDriverStore()

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.")
      setCameraActive(false)
    }
  }, [facingMode, setCameraActive])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }, [stream, setCameraActive])

  const switchCamera = useCallback(async () => {
    stopCamera()
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }, [stopCamera])

  // Process frames for AI detection
  useEffect(() => {
    if (!isCameraActive || !isMonitoring || !onFrame) return

    const processFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
          return // Video not ready yet
        }

        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          canvasRef.current.width = video.videoWidth
          canvasRef.current.height = video.videoHeight
          ctx.drawImage(video, 0, 0)

          try {
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
            onFrame(imageData)
          } catch (e) {
            // Skip this frame if getImageData fails
          }
        }
      }
    }

    const interval = setInterval(processFrame, 200) // 5 FPS for AI processing
    return () => clearInterval(interval)
  }, [isCameraActive, isMonitoring, onFrame])

  // Start camera when facing mode changes
  useEffect(() => {
    if (isCameraActive) {
      startCamera()
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  return (
    <div
      className={cn(
        "relative bg-black rounded-xl overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className,
      )}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className={cn("w-full h-full object-cover", !isCameraActive && "hidden")}
        playsInline
        muted
        autoPlay
      />

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Placeholder when camera is off */}
      {!isCameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 gap-4">
          <CameraOff className="w-16 h-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Camera is off</p>
          <Button onClick={startCamera} variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Enable Camera
          </Button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
          <p className="text-sm text-destructive text-center px-4">{error}</p>
        </div>
      )}

      {/* Controls */}
      {showControls && isCameraActive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={switchCamera}
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={stopCamera}
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            <CameraOff className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>
        </div>
      )}

      {/* Recording indicator */}
      {isCameraActive && isMonitoring && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-full">
          <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">LIVE</span>
        </div>
      )}
    </div>
  )
}
