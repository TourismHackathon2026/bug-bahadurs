"use client"

import dynamic from "next/dynamic"

export const MapPinPickerLazy = dynamic(
  () => import("@/components/map/map-pin-picker").then((m) => m.MapPinPicker),
  { ssr: false },
)
