import type { Metadata } from "next"
import { HeatmapView } from "@/components/map/heatmap-view"

export const metadata: Metadata = {
  title: "Complaint Heatmap | Awaaz",
  description: "Heatmap visualization of civic complaints across Nepal.",
}

export default function HeatmapPage() {
  const mockHeatmapPoints = [
    { lat: 27.7172, lng: 85.324, intensity: 0.8 }, // Kathmandu Thamel
    { lat: 28.2096, lng: 83.9856, intensity: 0.5 }, // Pokhara Lakeside
    { lat: 27.671, lng: 85.4298, intensity: 0.3 }, // Bhaktapur
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Complaint Heatmap</h1>
        <p className="text-sm text-muted-foreground">
          Visualizing geographic density of complaints to identify high-risk tourist zones.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm p-4">
        <HeatmapView points={mockHeatmapPoints} />
      </div>
    </div>
  )
}
