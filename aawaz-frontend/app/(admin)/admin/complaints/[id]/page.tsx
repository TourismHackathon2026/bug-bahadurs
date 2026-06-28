import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { getComplaintById } from "@/server/complaints"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Badge } from "@/components/ui/badge"
import { MapPinPickerLazy as MapPinPicker } from "@/components/map/map-pin-picker-lazy"
import { EscalateButton } from "@/components/admin/escalate-button"
import {
  ArrowLeft,
  Images,
  CalendarBlank,
  MapPin,
  FileText,
  User,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import {
  COMPLAINT_CATEGORY_LABELS,
  AUTHORITY_TYPE_LABELS,
} from "@/lib/constants"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Complaint ${id} | Admin | Awaaz`,
    description: `Admin view of complaint ${id}.`,
  }
}

export default async function AdminComplaintDetailPage({ params }: Props) {
  const { id } = await params
  const [session, complaint] = await Promise.all([getSession(), getComplaintById(id)])

  if (!session || session.role !== "ADMIN" || !complaint) {
    notFound()
  }

  const reachedAt = complaint.statusEvents.reduce<Partial<Record<string, string>>>(
    (acc, event) => {
      acc[event.status] = event.createdAt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
      return acc
    },
    {},
  )

  return (
    <div className="space-y-6">
      <Link
        href="/admin/complaints"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to all complaints
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">{complaint.title}</h1>
                <p className="font-mono text-sm text-muted-foreground">{complaint.referenceNo}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">
                {COMPLAINT_CATEGORY_LABELS[complaint.category] ?? complaint.category}
              </Badge>
              {complaint.aiCategory && (
                <Badge variant="secondary">
                  AI: {complaint.aiCategory}
                  {complaint.aiConfidence != null && ` (${Math.round(complaint.aiConfidence * 100)}%)`}
                </Badge>
              )}
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {complaint.description}
            </p>

            <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank className="size-4" />
                Incident: {complaint.incidentDate.toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-4" />
                Filed: {complaint.createdAt.toLocaleDateString()}
              </span>
              {complaint.locationLabel && (
                <span className="inline-flex items-center gap-1.5 sm:col-span-2">
                  <MapPin className="size-4" />
                  {complaint.locationLabel}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight">Status Timeline</h2>
            <div className="mt-4">
              <StatusTimeline reachedAt={reachedAt} currentStatus={complaint.status} />
            </div>
          </div>

          {complaint.evidence && complaint.evidence.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight">
                Evidence ({complaint.evidence.length})
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {complaint.evidence.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3"
                  >
                    <Images className="size-5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs text-muted-foreground">{file.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-tight text-muted-foreground uppercase">
              Reporter
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="inline-flex items-center gap-1.5">
                <User className="size-4 text-muted-foreground" />
                {complaint.tourist?.displayName ?? "Unknown"}
              </p>
              <p className="text-muted-foreground">{complaint.tourist?.email}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-tight text-muted-foreground uppercase">
              Assigned Authority
            </h2>
            {complaint.assignedTo ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  {complaint.assignedTo.displayName}
                </p>
                <Badge variant="outline">
                  {AUTHORITY_TYPE_LABELS[complaint.assignedTo.authorityProfile?.authorityType as keyof typeof AUTHORITY_TYPE_LABELS] ?? complaint.assignedTo.authorityProfile?.authorityType}
                </Badge>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Not assigned</p>
            )}
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-tight text-destructive uppercase">
              Admin Actions
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Escalate this complaint for urgent administrative attention.
            </p>
            <div className="mt-4">
              <EscalateButton complaintId={complaint.id} />
            </div>
          </div>

          {complaint.locationLat != null && complaint.locationLng != null && (
            <div className="overflow-hidden rounded-xl border border-border shadow-sm">
              <div className="h-48">
                <MapPinPicker
                  selectedLocation={{ lat: complaint.locationLat, lng: complaint.locationLng }}
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
