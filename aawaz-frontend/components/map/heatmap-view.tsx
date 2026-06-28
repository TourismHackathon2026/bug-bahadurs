"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { MapTrifold } from "@phosphor-icons/react"

interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

interface HeatmapViewProps {
  points?: HeatmapPoint[]
}

const DEFAULT_CENTER: [number, number] = [28.3949, 84.124]

function HeatLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap()

  useEffect(() => {
    let heatLayer: import("leaflet").Layer | null = null
    let cancelled = false

    async function mountHeatLayer() {
      const leafletModule = await import("leaflet")
      await import("leaflet.heat")

      if (cancelled || points.length === 0) {
        return
      }

      const latLngs = points.map(({ lat, lng, intensity }) => [lat, lng, intensity] as [number, number, number])
      const leaflet = leafletModule.default as typeof leafletModule.default & {
        heatLayer: typeof import("leaflet.heat").default
      }

      heatLayer = leaflet.heatLayer(latLngs, {
        radius: 28,
        blur: 18,
        maxZoom: 16,
        minOpacity: 0.4,
        gradient: {
          0.2: "#1d4ed8",
          0.45: "#06b6d4",
          0.65: "#f59e0b",
          0.85: "#ef4444",
          1: "#7f1d1d",
        },
      }).addTo(map)

      if (points.length > 1) {
        const bounds = leaflet.latLngBounds(latLngs.map(([lat, lng]) => [lat, lng] as [number, number]))
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.18), { animate: false })
        }
      }
    }

    void mountHeatLayer()

    return () => {
      cancelled = true
      if (heatLayer) {
        map.removeLayer(heatLayer)
      }
    }
  }, [map, points])

  return null
}

export function HeatmapView({ points = [] }: HeatmapViewProps) {
  const center = useMemo(() => {
    if (points.length === 0) {
      return DEFAULT_CENTER
    }

    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length
    return [lat, lng] as [number, number]
  }, [points])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapTrifold size={20} weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Civic Complaint Heatmap</p>
            <p className="text-xs text-muted-foreground">OpenStreetMap tiles with Leaflet.heat density overlay</p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Loaded points</div>
          <div className="text-sm font-semibold text-foreground">{points.length}</div>
        </div>
      </div>

      <div className="relative h-[32rem] w-full">
        <MapContainer
          center={center}
          zoom={7}
          minZoom={6}
          maxZoom={18}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatLayer points={points} />
        </MapContainer>

        {points.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/35 backdrop-blur-[1px]">
            <div className="rounded-xl border border-border bg-card/95 px-4 py-3 text-center shadow-sm">
              <p className="text-sm font-medium text-foreground">No heat points available</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add complaint coordinates to render the density map.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
