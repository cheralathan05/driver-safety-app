"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Trip, Alert, AIDetectionResult, RiskLevel, TripStatus, UserSettings } from "./types"

interface DriverState {
  // User state
  user: User | null
  isAuthenticated: boolean

  // Trip state
  currentTrip: Trip | null
  tripStatus: TripStatus
  trips: Trip[]

  // AI Detection state
  currentDetection: AIDetectionResult | null
  riskLevel: RiskLevel
  alerts: Alert[]

  // Location state
  currentLocation: { lat: number; lng: number } | null
  destination: { lat: number; lng: number; address: string } | null

  // UI state
  isCameraActive: boolean
  isMonitoring: boolean
  sosActive: boolean

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (status: boolean) => void
  startTrip: (trip: Trip) => void
  endTrip: () => void
  updateTrip: (updates: Partial<Trip>) => void
  setDetection: (detection: AIDetectionResult) => void
  setRiskLevel: (level: RiskLevel) => void
  addAlert: (alert: Alert) => void
  acknowledgeAlert: (alertId: string) => void
  setLocation: (location: { lat: number; lng: number }) => void
  setDestination: (destination: { lat: number; lng: number; address: string } | null) => void
  setCameraActive: (active: boolean) => void
  setMonitoring: (active: boolean) => void
  triggerSOS: () => void
  cancelSOS: () => void
  updateSettings: (settings: Partial<UserSettings>) => void
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  currentTrip: null,
  tripStatus: "idle" as TripStatus,
  trips: [],
  currentDetection: null,
  riskLevel: "safe" as RiskLevel,
  alerts: [],
  currentLocation: null,
  destination: null,
  isCameraActive: false,
  isMonitoring: false,
  sosActive: false,
}

export const useDriverStore = create<DriverState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),

      startTrip: (trip) =>
        set({
          currentTrip: trip,
          tripStatus: "active",
          isMonitoring: true,
          isCameraActive: true,
        }),

      endTrip: () => {
        const { currentTrip, trips } = get()
        if (currentTrip) {
          const completedTrip = { ...currentTrip, status: "completed" as TripStatus, endTime: new Date() }
          set({
            currentTrip: null,
            tripStatus: "idle",
            trips: [...trips, completedTrip],
            isMonitoring: false,
            isCameraActive: false,
            riskLevel: "safe",
          })
        }
      },

      updateTrip: (updates) =>
        set((state) => ({
          currentTrip: state.currentTrip ? { ...state.currentTrip, ...updates } : null,
        })),

      setDetection: (detection) => set({ currentDetection: detection, riskLevel: detection.overallRisk }),
      setRiskLevel: (level) => set({ riskLevel: level }),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts].slice(0, 100),
        })),

      acknowledgeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
        })),

      setLocation: (location) => set({ currentLocation: location }),
      setDestination: (destination) => set({ destination }),
      setCameraActive: (active) => set({ isCameraActive: active }),
      setMonitoring: (active) => set({ isMonitoring: active }),

      triggerSOS: () => set({ sosActive: true, tripStatus: "emergency" }),
      cancelSOS: () => set({ sosActive: false, tripStatus: "active" }),

      updateSettings: (settings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: { ...state.user.settings, ...settings },
              }
            : null,
        })),

      reset: () => set(initialState),
    }),
    {
      name: "driver-safety-storage",
      partialize: (state) => ({
        user: state.user,
        trips: state.trips,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
