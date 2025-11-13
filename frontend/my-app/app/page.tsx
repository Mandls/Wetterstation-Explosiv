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
  lastUpdated?: string
}

const DEMO_SENSORS: SensorReading[] = [
  {
    id: 1,
    sensor: "Temperature",
    name: "Temperature Sensor",
    typ: "temp",
    description: "Measures temperature",
    value: 25.0,
    unit: "°C",
    status: "normal",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    sensor: "Humidity",
    name: "Humidity Sensor",
    typ: "hum",
    description: "Measures air humidity",
    value: 50.0,
    unit: "%",
    status: "normal",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 3,
    sensor: "Gas",
    name: "Gas MQ-2 Sensor",
    typ: "gas",
    description: "Detects gases",
    value: 1200,
    unit: "ppm",
    status: "normal",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 4,
    sensor: "Flame",
    name: "Flame Sensor",
    typ: "flame",
    description: "Detects presence of flame",
    value: 800,
    unit: "",
    status: "normal",
    lastUpdated: new Date().toISOString(),
  },
]

export default function Home() {
  const [sensors, setSensors] = useState<SensorReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [usingDemoData, setUsingDemoData] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  const BASE_URL = "http://172.31.183.174:8000/api/v1/sensor_data"
  const ENDPOINTS = {
    temp: `${BASE_URL}/temp`,
    hum: `${BASE_URL}/hum`,
    gas: `${BASE_URL}/gas`,
    flame: `${BASE_URL}/flame`,
  }

  const TEMP_MIN = 15.0
  const TEMP_MAX = 40.0
  const HUM_MIN = 10.0
  const HUM_MAX = 80.0
  const FLAME_WARN = 1500
  const FLAME_ALARM = 3000
  const GAS_WARN = 1800
  const GAS_ALARM = 2500

  const formatTime = (isoString?: string) => {
    if (!isoString) return "—"
    return new Date(isoString).toLocaleTimeString()
  }

  const fetchSensorData = async () => {
    if (typeof window === "undefined") return

    setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const responses = await Promise.all([
        fetch(ENDPOINTS.temp, { signal: controller.signal }),
        fetch(ENDPOINTS.hum, { signal: controller.signal }),
        fetch(ENDPOINTS.gas, { signal: controller.signal }),
        fetch(ENDPOINTS.flame, { signal: controller.signal }),
      ])

      clearTimeout(timeoutId)

      responses.forEach((res, i) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} at ${Object.keys(ENDPOINTS)[i]}`)
      })

      const data = await Promise.all(responses.map((r) => r.json()))
      console.log("Fetched data:", data)

      const extractLastValue = (obj: any) => {
        if (!obj || typeof obj !== "object") return undefined
        const key = Object.keys(obj)[0]
        const arr = obj[key]
        if (Array.isArray(arr) && arr.length > 0) return arr[arr.length - 1]
        return undefined
      }

      const now = new Date().toISOString()
      const parsedSensors: SensorReading[] = [
        {
          id: 1,
          sensor: "Temperature",
          name: "Temperature Sensor",
          typ: "temp",
          description: "Measures ambient temperature",
          value: extractLastValue(data[0]),
          unit: "°C",
          status: "normal",
          lastUpdated: now,
        },
        {
          id: 2,
          sensor: "Humidity",
          name: "Humidity Sensor",
          typ: "hum",
          description: "Measures air humidity",
          value: extractLastValue(data[1]),
          unit: "%",
          status: "normal",
          lastUpdated: now,
        },
        {
          id: 3,
          sensor: "Gas MQ-2 Sensor",
          name: "Gas MQ-2 Sensor",
          typ: "gas",
          description: "Detects flammable gases",
          value: extractLastValue(data[2]),
          unit: "ppm",
          status: "normal",
          lastUpdated: now,
        },
        {
          id: 4,
          sensor: "Flame Sensor",
          name: "Flame Sensor",
          typ: "flame",
          description: "Detects presence of flame",
          value: extractLastValue(data[3]),
          unit: "",
          status: "normal",
          lastUpdated: now,
        },
      ]

      const evaluated = parsedSensors.map((s) => {
        const val = s.value ?? 0
        let status: "normal" | "warning" | "critical" = "normal"

        if (s.typ === "temp") {
          status =
            val > TEMP_MAX ? "critical" :
            val > TEMP_MAX - 5 ? "warning" :
            val < TEMP_MIN ? "warning" : "normal"
        } else if (s.typ === "hum") {
          status =
            val > HUM_MAX ? "critical" :
            val > HUM_MAX - 5 ? "warning" :
            val < HUM_MIN ? "critical" :
            val < HUM_MIN + 5 ? "warning" : "normal"
        } else if (s.typ === "gas") {
          status =
            val > GAS_ALARM ? "critical" :
            val > GAS_WARN ? "warning" : "normal"
        } else if (s.typ === "flame") {
          status =
            val > FLAME_ALARM ? "critical" :
            val > FLAME_WARN ? "warning" : "normal"
        }

        return { ...s, status }
      })

      setSensors(evaluated)
      setUsingDemoData(false)
    } catch (err: any) {
      console.error("Failed to fetch sensors:", err)
      setError(`Failed to fetch from API: ${err.message}. Using demo data.`)

      const now = new Date().toISOString()
      const demo = DEMO_SENSORS.map((s) => ({
        ...s,
        value: s.value ? s.value + (Math.random() * 2 - 1) : undefined,
        lastUpdated: now,
      }))

      setSensors(demo)
      setUsingDemoData(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchSensorData()
    const interval = setInterval(fetchSensorData, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "critical":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading sensors...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Live Sensor Data</h2>
        <p className="text-muted-foreground mb-6">
          Monitoring environmental and safety sensors
        </p>

        {loading && (
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Connecting to sensors...
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-amber-600 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="font-bold">⚠️ Connection Notice</div>
            <div className="text-sm mt-1">{error}</div>
            <div className="text-xs mt-2 text-amber-700">
              Make sure the sensor API is running at:{" "}
              <code className="bg-amber-100 px-1 rounded">{BASE_URL}</code>
            </div>
            <button
              onClick={fetchSensorData}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              className={`border-border hover:shadow-md transition-shadow ${
                sensor.status === "critical" ? "border-red-500 border-2" : ""
              } ${usingDemoData ? "opacity-90" : ""}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground flex justify-between items-center">
                  <span>{sensor.sensor}</span>
                  {usingDemoData && (
                    <span className="text-xs text-yellow-600 font-normal">Demo</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {sensor.value !== undefined ? sensor.value.toFixed(1) : "—"}{" "}
                      {sensor.unit}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {formatTime(sensor.lastUpdated)}
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
              <strong>Temperature:</strong> Normal: 15–35°C, Warning: 35–40°C, Critical: &gt;40°C
            </p>
            <p>
              <strong>Humidity:</strong> Normal: 10–75%, Warning: 75–80% or 10–15%, Critical: &lt;10% or &gt;80%
            </p>
          </div>
          <div>
            <p>
              <strong>Gas MQ-2:</strong> Normal: &lt;1800ppm, Warning: 1800–2500ppm, Critical: &gt;2500ppm
            </p>
            <p>
              <strong>Flame Sensor:</strong> Normal: &lt;1500, Warning: 1500–3000, Critical: &gt;3000
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
