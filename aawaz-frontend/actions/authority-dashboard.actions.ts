"use server"

import { getSession } from "@/lib/session"
import { getComplaintsForAuthority } from "@/server/complaints"
import { ComplaintStatus, ComplaintCategory, Priority } from "@/lib/constants"

export interface AuthorityDashboardComplaint {
  id: string
  reference: string
  title: string
  description: string
  category: string
  status: ComplaintStatus
  priority: Priority
  lastUpdated: string
  evidenceCount: number
  responsePreview?: string
}

function formatLastUpdated(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return date.toLocaleDateString()
}

function mapComplaint(
  c: Awaited<ReturnType<typeof getComplaintsForAuthority>>["complaints"][number]
): AuthorityDashboardComplaint {
  const latestEvent = c.statusEvents?.[0]

  return {
    id: c.id,
    reference: c.referenceNo,
    title: c.title,
    description: c.description,
    category: c.category,
    status: c.status,
    priority: c.priority,
    lastUpdated: formatLastUpdated(latestEvent?.createdAt ?? c.updatedAt),
    evidenceCount: c.evidence?.length ?? 0,
    responsePreview: latestEvent?.note ?? undefined,
  }
}

export async function getAuthorityDashboardComplaints(
  authorityType: string,
  page = 1,
  limit = 10
): Promise<{ complaints: AuthorityDashboardComplaint[]; total: number }> {
  const { complaints, total } = await getComplaintsForAuthority(
    authorityType,
    {},
    page,
    limit
  )

  return {
    complaints: complaints.map(mapComplaint),
    total,
  }
}
