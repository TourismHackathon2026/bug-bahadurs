import type { Metadata } from "next"
import { HeatmapViewLazy } from "@/components/map/heatmap-view-lazy"
import { getHeatmapPoints } from "@/server/complaints"

export const metadata: Metadata = {
  title: "Complaint Heatmap | Awaaz",
  description: "Heatmap visualization of civic complaints across Nepal.",
}

export default async function HeatmapPage() {
  const heatmapPoints = await getHeatmapPoints({})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Complaint Heatmap</h1>
        <p className="text-sm text-muted-foreground">
          Visualizing geographic density of complaints to identify high-risk tourist zones.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm p-4">
        <HeatmapViewLazy points={heatmapPoints} />
      </div>
    </div>
  )
}
