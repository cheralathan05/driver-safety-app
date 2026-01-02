// Core types for Driver Safety AI

export type RiskLevel = "safe" | "moderate" | "high" | "critical"
export type AlertType =
  | "drowsiness"
  | "distraction"
  | "phone_usage"
  | "no_face"
  | "yawning"
  | "head_drop"
  | "seatbelt"
  | "accident"
export type TripStatus = "idle" | "active" | "paused" | "completed" | "emergency"
export type WeatherCondition = "clear" | "cloudy" | "rain" | "heavy_rain" | "fog" | "storm" | "snow"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  emergencyContacts: EmergencyContact[]
  settings: UserSettings
  createdAt: Date
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  isPrimary: boolean
}

export interface UserSettings {
  alertSoundEnabled: boolean
  voiceAlertsEnabled: boolean
  batterySaverMode: boolean
  nightModeAuto: boolean
  sensitivityLevel: "low" | "medium" | "high"
  language: string
}

export interface Trip {
  id: string
  userId: string
  startLocation: Location
  endLocation?: Location
  waypoints: RouteWaypoint[]
  startTime: Date
  endTime?: Date
  status: TripStatus
  distance: number
  duration: number
  alerts: Alert[]
  fatigueScore: number
  safetyScore: number
}

export interface Location {
  lat: number
  lng: number
  address?: string
  city?: string
  timestamp: Date
}

export interface RouteWaypoint {
  location: Location
  weather?: WeatherData
  estimatedArrival: Date
}

export interface Alert {
  id: string
  type: AlertType
  severity: RiskLevel
  confidence: number
  timestamp: Date
  location?: Location
  acknowledged: boolean
  videoClipUrl?: string
}

export interface WeatherData {
  city: string
  condition: WeatherCondition
  temperature: number
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
  forecast: string
  alerts: string[]
}

export interface AIDetectionResult {
  drowsinessScore: number
  distractionScore: number
  phoneUsageDetected: boolean
  seatbeltDetected: boolean
  faceDetected: boolean
  yawning: boolean
  headPose: { pitch: number; yaw: number; roll: number }
  overallRisk: RiskLevel
  confidence: number
  timestamp: Date
}

export interface DashboardStats {
  totalTrips: number
  totalDistance: number
  totalDuration: number
  averageSafetyScore: number
  alertsThisWeek: number
  improvementPercent: number
}
