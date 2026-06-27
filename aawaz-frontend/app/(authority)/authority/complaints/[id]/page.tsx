import type { Metadata } from "next"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Images, CalendarBlank, MapPin, CheckCircle, Warning } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

interface AuthorityComplaintDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AuthorityComplaintDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Review Complaint ${id} | Awaaz`,
    description: `Authority action panel for complaint ${id}.`,
  }
}

export default async function AuthorityComplaintDetailPage({ params }: AuthorityComplaintDetailPageProps) {
  const { id } = await params

  const mockComplaint = {
    id,
    referenceNo: "AWAAZ-2026-00189",
    title: "Harassment near trekking trail entrance",
    description: "While registering for the trekking permit, several unauthorized local guides blocked the pathway and verbally harassed us when we refused services. They got aggressive and followed us for about a kilometer.",
    category: "HARASSMENT" as const,
    status: "INVESTIGATION" as const,
    priority: "HIGH" as const,
    incidentDate: new Date("2026-06-24"),
    locationLabel: "Annapurna Conservation Checkpoint, Besisahar",
    touristName: "Sarah Jenkins",
    touristEmail: "sarah.j@example.com",
    evidence: [
      { id: "e1", storageKey: "guides_photo.jpg", mimeType: "image/jpeg", sizeBytes: 245200 },
    ],
  }

  const reachedAt = {
    SUBMITTED: "June 24, 2026, 08:30 AM",
    UNDER_REVIEW: "June 24, 2026, 09:15 AM",
    ASSIGNED: "June 24, 2026, 11:00 AM",
    INVESTIGATION: "June 24, 2026, 02:00 PM",
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/authority/complaints"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Assigned List
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Details and Evidence */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-muted-foreground">{mockComplaint.referenceNo}</span>
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reporter</h3>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {mockComplaint.touristName} <span className="font-normal text-muted-foreground">({mockComplaint.touristEmail})</span>
                </p>
              </div>

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

        {/* Sidebar Actions & Timeline */}
        <div className="space-y-6">
          {/* Authority action panel */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold">Officer Actions</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Update Status
              </label>
              <select
                className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm focus:outline-none"
                defaultValue={mockComplaint.status}
              >
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="INVESTIGATION">Investigation</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Button className="w-full" variant="outline" size="sm">
                Request Evidence
              </Button>
              <Button className="w-full" size="sm">
                <CheckCircle className="mr-1" size={16} />
                Resolve Case
              </Button>
            </div>
          </div>

          <StatusTimeline currentStatus={mockComplaint.status} reachedAt={reachedAt} />
        </div>
      </div>
    </div>
  )
}
