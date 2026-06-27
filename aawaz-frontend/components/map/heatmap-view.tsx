"use client"

import { MapTrifold } from "@phosphor-icons/react"

interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

interface HeatmapViewProps {
  points?: HeatmapPoint[]
}

/**
 * Client-side Heatmap View stub (gated by FF_HEATMAP, authority only).
 * Real implementation will dynamically load leaflet and leaflet.heat.
 */
export function HeatmapView({ points = [] }: HeatmapViewProps) {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-border bg-surface text-center p-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <MapTrifold size={24} weight="fill" />
      </div>
      <p className="mt-3 text-sm font-medium">Civic Complaint Heatmap</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        Heatmap visualization is currently represented as a placeholder. Shows high density clusters of complaint categories across Nepal.
      </p>
      <div className="mt-4 text-xs text-muted-foreground">
        Loaded points: <span className="font-semibold text-foreground">{points.length}</span>
      </div>
    </div>
  )
}
