import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Images, CalendarBlank, MapPin, Copy } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

interface ComplaintDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ComplaintDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Complaint ${id} | Awaaz`,
    description: `Track status of complaint reference ${id}.`,
  }
}

export default async function ComplaintDetailPage({ params }: ComplaintDetailPageProps) {
  const { id } = await params

  // Mock fetching a complaint for matching ID (normally repository call)
  const mockComplaint = {
    id,
    referenceNo: "AWAAZ-2026-00231",
    title: "Overcharged by Taxi Driver in Kathmandu",
    description: "Took a taxi from Tribhuvan International Airport to Thamel. The meter was tampered with, and the driver demanded 4000 NPR instead of the standard rate. When I refused, he threatened to leave with my luggage.",
    category: "TAXI_FRAUD" as const,
    status: "SUBMITTED" as const,
    priority: "NORMAL" as const,
    incidentDate: new Date("2026-06-25"),
    locationLabel: "Tribhuvan Airport to Thamel Road, Kathmandu",
    evidence: [
      { id: "e1", storageKey: "taxi_plate.jpg", mimeType: "image/jpeg", sizeBytes: 154200 },
      { id: "e2", storageKey: "receipt.jpg", mimeType: "image/jpeg", sizeBytes: 89400 },
    ],
  }

  const reachedAt = {
    SUBMITTED: "June 25, 2026, 10:15 AM",
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{mockComplaint.referenceNo}</span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Copy size={14} />
                  </button>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{mockComplaint.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{mockComplaint.category}</Badge>
                <StatusBadge status={mockComplaint.status} />
                <PriorityBadge priority={mockComplaint.priority} />
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
                <p className="mt-2 text-sm leading-6 text-foreground">{mockComplaint.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 border-t pt-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Incident Date</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <CalendarBlank size={16} className="text-muted-foreground" />
                    {mockComplaint.incidentDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Incident Location</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-muted-foreground" />
                    {mockComplaint.locationLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold">Evidence attached ({mockComplaint.evidence.length})</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {mockComplaint.evidence.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 text-center hover:border-primary/20"
                >
                  <Images size={32} className="text-muted-foreground" />
                  <p className="mt-2 truncate text-xs font-medium max-w-full px-2">{file.storageKey}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.round(file.sizeBytes / 1024)} KB
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar timeline */}
        <div className="space-y-6">
          <StatusTimeline currentStatus={mockComplaint.status} reachedAt={reachedAt} />
        </div>
      </div>
    </div>
  )
}
