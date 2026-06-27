import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Images, CalendarBlank, MapPin, CheckCircle, FileText } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { getComplaintById } from "@/server/complaints"
import { updateComplaintStatus } from "@/actions/complaint.actions"
import {
  COMPLAINT_CATEGORY_LABELS,
  COMPLAINT_STATUS_LABELS,
  ComplaintStatus,
  type ComplaintStatus as ComplaintStatusType,
} from "@/lib/constants"

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
  const [session, complaint] = await Promise.all([getSession(), getComplaintById(id)])

  if (!session || session.role !== "AUTHORITY" || !complaint || complaint.assignedToId !== session.userId) {
    notFound()
  }

  const reachedAt = complaint.statusEvents.reduce<Partial<Record<ComplaintStatusType, string>>>((acc, event) => {
    acc[event.status] = event.createdAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    return acc
  }, {})

  async function updateStatusAction(formData: FormData) {
    "use server"
    const status = String(formData.get("status")) as ComplaintStatusType
    const note = String(formData.get("note") || "")
    await updateComplaintStatus(id, status, note)
  }

  async function resolveAction(formData: FormData) {
    "use server"
    const note = String(formData.get("resolution") || "Complaint resolved")
    await updateComplaintStatus(id, ComplaintStatus.RESOLVED, note)
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
                <span className="font-mono text-xs text-muted-foreground">{complaint.referenceNo}</span>
                <h1 className="text-2xl font-bold tracking-tight">{complaint.title}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{COMPLAINT_CATEGORY_LABELS[complaint.category]}</Badge>
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reporter</h3>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {complaint.tourist.displayName} <span className="font-normal text-muted-foreground">({complaint.tourist.email})</span>
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</h3>
                <p className="mt-2 text-sm leading-6 text-foreground">{complaint.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 border-t pt-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Incident Date</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <CalendarBlank size={16} className="text-muted-foreground" />
                    {complaint.incidentDate.toLocaleDateString("en-US", {
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
                    {complaint.locationLabel || "Location not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Grid */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold">Evidence attached ({complaint.evidence.length})</h3>
            {complaint.evidence.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {complaint.evidence.map((file) => {
                  const Icon = file.mimeType.startsWith("image/") ? Images : FileText
                  const name = file.storageKey.split("/").pop() || file.storageKey
                  return (
                    <a
                      key={file.id}
                      href={file.storageKey}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 text-center hover:border-primary/20"
                    >
                      <Icon size={32} className="text-muted-foreground" />
                      <p className="mt-2 truncate text-xs font-medium max-w-full px-2">{name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {Math.round(file.sizeBytes / 1024)} KB
                      </p>
                    </a>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No evidence files attached.</p>
            )}
          </div>
        </div>

        {/* Sidebar Actions & Timeline */}
        <div className="space-y-6">
          {/* Authority action panel */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold">Officer Actions</h3>
            
            <form action={updateStatusAction} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Update Status
              </label>
              <select
                name="status"
                className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm focus:outline-none"
                defaultValue={complaint.status}
              >
                {[
                  ComplaintStatus.UNDER_REVIEW,
                  ComplaintStatus.ASSIGNED,
                  ComplaintStatus.INVESTIGATION,
                  ComplaintStatus.RESOLVED,
                  ComplaintStatus.CLOSED,
                ].map((status) => (
                  <option key={status} value={status}>{COMPLAINT_STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
            <textarea
              name="note"
              rows={3}
              placeholder="Add an update for the tourist..."
              className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm focus:outline-none"
            />
            <Button className="w-full" variant="outline" size="sm" type="submit">
              Save Status Update
            </Button>
            </form>

            <form action={resolveAction} className="space-y-2 pt-2 border-t">
              <textarea
                name="resolution"
                rows={3}
                placeholder="Resolution message..."
                className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm focus:outline-none"
              />
              <Button className="w-full" size="sm" type="submit">
                <CheckCircle className="mr-1" size={16} />
                Resolve Case
              </Button>
            </form>
          </div>

          <StatusTimeline currentStatus={complaint.status} reachedAt={reachedAt} />
        </div>
      </div>
    </div>
  )
}
