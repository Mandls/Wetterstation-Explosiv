"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SensorReading {
  id: number
  sensor: string
  name: string
  typ: string
  description: string
  value?: number
  unit?: string
  status?: "normal" | "warning" | "critical"
  lastUpdated?: Date
}

export default function Home() {
  const [sensors, setSensors] = useState<SensorReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const API_URL = "http://172.31.181.235:8000/api/v1/sensor/sensor/get_sensors/"

  const fetchSensorData = async () => {
    try {
      setError(null)
      const response = await fetch(API_URL, { cache: "no-store" })
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)

      const data = await response.json()

      const formattedData: SensorReading[] = data.map((sensor: any) => {
        const simulatedValue = Math.random() * 100
        const unit =
          sensor.sensor.toLowerCase() === "temperatur" ? "°C" :
          sensor.sensor.toLowerCase() === "humidity" ? "%" :
          sensor.sensor.toLowerCase() === "gas" ? "ppm" :
          sensor.sensor.toLowerCase() === "flame" ? "" : ""

        const status =
          sensor.sensor.toLowerCase() === "temperatur"
            ? simulatedValue > 32
              ? "critical"
              : simulatedValue > 28
              ? "warning"
              : "normal"
            : sensor.sensor.toLowerCase() === "humidity"
            ? simulatedValue > 85 || simulatedValue < 30
              ? "critical"
              : simulatedValue > 75 || simulatedValue < 40
              ? "warning"
              : "normal"
            : "normal"

        return {
          ...sensor,
          value: simulatedValue,
          unit,
          status,
          lastUpdated: new Date(),
        }
      })

      setSensors(formattedData)
      setLoading(false)
    } catch (err: any) {
      setError(err.message || "Failed to fetch sensor data")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSensorData()
    const interval = setInterval(fetchSensorData, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-accent text-accent-foreground"
      case "warning":
        return "bg-yellow-500 text-white"
      case "critical":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Live Sensor Data</h2>
        <p className="text-muted-foreground mb-6">
          Monitoring environmental and safety sensors
        </p>

        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              className={`border-border hover:shadow-md transition-shadow ${
                sensor.status === "critical" ? "border-destructive border-2" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {sensor.sensor}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {sensor.value?.toFixed(1)} {sensor.unit}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {sensor.lastUpdated?.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(sensor.status || "normal")}>
                    {sensor.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {sensor.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Sensor Status Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Temperature:</strong> Normal: 20–28°C, Warning: 28–32°C, Critical: &gt;32°C
              </p>
              <p>
                <strong>Humidity:</strong> Normal: 40–75%, Warning: 30–40% or 75–85%, Critical: &lt;30% or &gt;85%
              </p>
            </div>
            <div>
              <p>
                <strong>Gas MQ-2:</strong> Normal: &lt;200ppm, Warning: 200–300ppm, Critical: &gt;300ppm
              </p>
              <p>
                <strong>Flame Sensor:</strong> Normal: No flame detected, Critical: Flame detected
              </p>
            </div>
          </div>
        </div>
    </main>
  )
}
