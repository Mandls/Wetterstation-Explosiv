"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface SensorReading {
  id: string
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  lastUpdated: Date
}

export default function Home() {
  const [sensors, setSensors] = useState<SensorReading[]>([
    {
      id: "1",
      name: "Temperature",
      value: 23.5,
      unit: "°C",
      status: "normal",
      lastUpdated: new Date(),
    },
    {
      id: "2",
      name: "Humidity",
      value: 65.2,
      unit: "%",
      status: "normal",
      lastUpdated: new Date(),
    },
  ])

  // // Simulate real-time updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSensors((prev) =>
  //       prev.map((sensor) => ({
  //         ...sensor,
  //         value: sensor.value + (Math.random() - 0.5) * 2,
  //         lastUpdated: new Date(),
  //       })),
  //     )
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [])

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
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Live Sensor Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => {
            return (
              <Card key={sensor.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">{sensor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">
                        {sensor.value.toFixed(1)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{sensor.unit}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {sensor.lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
