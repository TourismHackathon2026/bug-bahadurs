"use client"

import { MapPin } from "@phosphor-icons/react"

interface Location {
  lat: number
  lng: number
  label?: string
}

interface MapPinPickerProps {
  onLocationSelect?: (location: Location) => void
  defaultCenter?: { lat: number; lng: number }
  selectedLocation?: Location
  disabled?: boolean
}

/**
 * Client-side Map Pin Picker stub (gated by FF_MAP_PIN).
 * Real implementation will dynamically load react-leaflet to prevent SSR errors.
 */
export function MapPinPicker({
  onLocationSelect,
  defaultCenter = { lat: 27.7172, lng: 85.324 }, // Kathmandu
  selectedLocation,
  disabled = false,
}: MapPinPickerProps) {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface text-center p-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MapPin size={24} weight="fill" />
      </div>
      <p className="mt-3 text-sm font-medium">
        {disabled ? "Reported location preview" : "Interactive Map Picker"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">
        Map visualization is currently represented as a placeholder. In production, this loads OpenStreetMap.
      </p>

      {disabled && selectedLocation ? (
        <div className="mt-4 rounded-lg border border-border/70 bg-background/80 px-4 py-3 text-left text-sm text-foreground">
          <p className="font-medium">{selectedLocation.label}</p>
          <p className="text-muted-foreground">Lat: {selectedLocation.lat.toFixed(4)}</p>
          <p className="text-muted-foreground">Lng: {selectedLocation.lng.toFixed(4)}</p>
        </div>
      ) : null}
      
      {!disabled && onLocationSelect && (
        <button
          type="button"
          onClick={() =>
            onLocationSelect({
              lat: defaultCenter.lat,
              lng: defaultCenter.lng,
              label: "Kathmandu, Nepal",
            })
          }
          className="mt-4 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Select Kathmandu (Mock Pin)
        </button>
      )}
    </div>
  )
}
