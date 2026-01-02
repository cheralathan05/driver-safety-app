"use client"

import { useCallback, useRef } from "react"
import { useDriverStore } from "@/lib/store"
import type { AIDetectionResult, RiskLevel, AlertType } from "@/lib/types"
import { toast } from "sonner"

// Simulated AI detection - in production, this would call actual AI services
export function useAIDetection() {
  const { setDetection, setRiskLevel, addAlert, isMonitoring, user } = useDriverStore()

  const lastAlertTime = useRef<Record<AlertType, number>>({} as Record<AlertType, number>)
  const alertCooldown = 5000 // 5 seconds between same type alerts

  const processFrame = useCallback(
    (imageData: ImageData) => {
      if (!isMonitoring) return

      // Simulated AI detection results
      // In production, this would call your Python AI services
      const simulatedResult: AIDetectionResult = {
        drowsinessScore: Math.random() * 100,
        distractionScore: Math.random() * 100,
        phoneUsageDetected: Math.random() > 0.95,
        seatbeltDetected: Math.random() > 0.1,
        faceDetected: Math.random() > 0.05,
        yawning: Math.random() > 0.9,
        headPose: {
          pitch: (Math.random() - 0.5) * 30,
          yaw: (Math.random() - 0.5) * 30,
          roll: (Math.random() - 0.5) * 15,
        },
        overallRisk: "safe",
        confidence: 0.85 + Math.random() * 0.15,
        timestamp: new Date(),
      }

      // Calculate overall risk
      let riskScore = 0
      if (simulatedResult.drowsinessScore > 70) riskScore += 30
      if (simulatedResult.distractionScore > 70) riskScore += 25
      if (simulatedResult.phoneUsageDetected) riskScore += 40
      if (!simulatedResult.faceDetected) riskScore += 20
      if (simulatedResult.yawning) riskScore += 10
      if (Math.abs(simulatedResult.headPose.yaw) > 20) riskScore += 15

      let overallRisk: RiskLevel = "safe"
      if (riskScore >= 80) overallRisk = "critical"
      else if (riskScore >= 60) overallRisk = "high"
      else if (riskScore >= 30) overallRisk = "moderate"

      simulatedResult.overallRisk = overallRisk

      setDetection(simulatedResult)
      setRiskLevel(overallRisk)

      // Generate alerts based on detections
      const now = Date.now()

      if (simulatedResult.drowsinessScore > 80) {
        createAlert("drowsiness", overallRisk, simulatedResult.confidence, now)
      }
      if (simulatedResult.distractionScore > 80) {
        createAlert("distraction", overallRisk, simulatedResult.confidence, now)
      }
      if (simulatedResult.phoneUsageDetected) {
        createAlert("phone_usage", "high", simulatedResult.confidence, now)
      }
      if (!simulatedResult.faceDetected) {
        createAlert("no_face", "moderate", simulatedResult.confidence, now)
      }
      if (simulatedResult.yawning) {
        createAlert("yawning", "moderate", simulatedResult.confidence, now)
      }
    },
    [isMonitoring, setDetection, setRiskLevel],
  )

  const createAlert = useCallback(
    (type: AlertType, severity: RiskLevel, confidence: number, now: number) => {
      // Check cooldown
      if (lastAlertTime.current[type] && now - lastAlertTime.current[type] < alertCooldown) {
        return
      }

      lastAlertTime.current[type] = now

      const alert = {
        id: `alert-${now}-${type}`,
        type,
        severity,
        confidence,
        timestamp: new Date(),
        acknowledged: false,
      }

      addAlert(alert)

      // Show toast for moderate+ alerts
      if (severity !== "safe") {
        const messages: Record<AlertType, string> = {
          drowsiness: "Drowsiness detected! Stay alert.",
          distraction: "You seem distracted. Focus on the road.",
          phone_usage: "Phone usage detected!",
          no_face: "Please look at the road.",
          yawning: "Frequent yawning. Consider a break.",
          head_drop: "Head drop detected!",
          seatbelt: "Please fasten your seatbelt.",
          accident: "Possible accident detected!",
        }

        if (severity === "high" || severity === "critical") {
          toast.error(messages[type], {
            duration: 5000,
          })
        } else {
          toast.warning(messages[type], {
            duration: 3000,
          })
        }
      }
    },
    [addAlert],
  )

  return { processFrame }
}
