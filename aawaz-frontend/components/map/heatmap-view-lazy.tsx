"use client"

import dynamic from "next/dynamic"

export const HeatmapViewLazy = dynamic(
  () => import("@/components/map/heatmap-view").then((m) => m.HeatmapView),
  { ssr: false },
)
