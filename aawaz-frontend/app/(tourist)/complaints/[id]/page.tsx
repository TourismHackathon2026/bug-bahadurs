import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { ComplaintAiBadge } from "@/components/complaint/ai-category-badge"
import { ArrowLeft, Images, CalendarBlank, MapPin, FileText } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { getComplaintById } from "@/server/complaints"
import { AUTHORITY_TYPE_LABELS, COMPLAINT_CATEGORY_LABELS, type ComplaintStatus } from "@/lib/constants"
import { confirmEvidence } from "@/actions/evidence.actions"
import { ComplaintEvidenceUploader } from "@/components/complaint/complaint-evidence-uploader"
import { CopyReferenceButton } from "@/components/complaint/copy-reference-button"
import { MapPinPickerLazy as MapPinPicker } from "@/components/map/map-pin-picker-lazy"

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
  const [session, complaint] = await Promise.all([getSession(), getComplaintById(id)])

  if (!session || !complaint || complaint.touristId !== session.userId) {
    notFound()
  }

  const reachedAt = complaint.statusEvents.reduce<Partial<Record<ComplaintStatus, string>>>((acc, event) => {
    acc[event.status] = event.createdAt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    return acc
  }, {})

  const selectedLocation =
    complaint.locationLat !== null && complaint.locationLng !== null
      ? {
        lat: complaint.locationLat,
        lng: complaint.locationLng,
        label: complaint.locationLabel || "Reported location",
      }
      : undefined

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
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{complaint.referenceNo}</span>
                  <CopyReferenceButton reference={complaint.referenceNo} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{complaint.title}</h1>
              </div>
            </div>
            <div className="space-y-6">
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

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location preview</p>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedLocation ? selectedLocation.label : complaint.locationLabel || "No location coordinates available."}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <MapPinPicker disabled selectedLocation={selectedLocation} />
                </div>
              </div>
            </div>
            {/* Here */}
            <>


              <div className="flex flex-col mt-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold">Evidence attached ({complaint.evidence.length})</h3>
                <ComplaintEvidenceUploader complaintId={complaint.id} confirmEvidenceAction={confirmEvidence} />
              </div>
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
            </>
          </div>


        </div>

        {/* Sidebar timeline */}
        <div className="space-y-6">
          <StatusTimeline currentStatus={complaint.status} reachedAt={reachedAt} />
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold">Complaint summary</h2>
            <dl className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs uppercase text-muted-foreground">Type</dt>
                <dd className="text-sm font-medium">{COMPLAINT_CATEGORY_LABELS[complaint.category]}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs uppercase text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium">{complaint.status.replaceAll("_", " ")}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs uppercase text-muted-foreground">Priority</dt>
                <dd className="text-sm font-medium">{complaint.priority}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs uppercase text-muted-foreground">Assigned to</dt>
                <dd className="text-sm font-medium">
                  {complaint.assignedTo?.authorityProfile?.authorityType
                    ? AUTHORITY_TYPE_LABELS[complaint.assignedTo.authorityProfile.authorityType]
                    : "Unassigned"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-xs uppercase text-muted-foreground">AI Confidence</dt>
                <dd className="text-sm font-medium text-right">
                  <ComplaintAiBadge
                    initialAiCategory={complaint.aiCategory}
                    initialAiConfidence={complaint.aiConfidence}
                    initialPriority={complaint.priority}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}