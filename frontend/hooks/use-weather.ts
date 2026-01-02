"use client"

import { useState, useCallback } from "react"
import type { WeatherData, WeatherCondition } from "@/lib/types"

// Simulated weather data - in production, this would call actual weather API
export function useWeather() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeatherForCity = useCallback(async (city: string): Promise<WeatherData> => {
    // Simulated weather data
    const conditions: WeatherCondition[] = ["clear", "cloudy", "rain", "fog"]
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    return {
      city,
      condition: randomCondition,
      temperature: Math.round(20 + Math.random() * 15),
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
      visibility: Math.round(5 + Math.random() * 10),
      precipitation: randomCondition === "rain" ? Math.round(Math.random() * 30) : 0,
      forecast: `${randomCondition === "clear" ? "Sunny" : randomCondition === "rain" ? "Rainy" : "Partly cloudy"} conditions expected`,
      alerts: randomCondition === "rain" ? ["Heavy rain expected in 30 minutes"] : [],
    }
  }, [])

  const getRouteWeather = useCallback(
    async (cities: string[]): Promise<WeatherData[]> => {
      setLoading(true)
      setError(null)

      try {
        const weatherData = await Promise.all(cities.map((city) => getWeatherForCity(city)))
        return weatherData
      } catch (err) {
        setError("Failed to fetch weather data")
        return []
      } finally {
        setLoading(false)
      }
    },
    [getWeatherForCity],
  )

  return { getWeatherForCity, getRouteWeather, loading, error }
}
