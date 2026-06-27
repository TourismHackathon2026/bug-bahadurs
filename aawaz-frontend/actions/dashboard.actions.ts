"use server"

import { ComplaintStatus, ComplaintCategory, Priority } from "@/lib/constants"
import { getSession } from "@/lib/session"
import { getComplaintsForTourist } from "@/server/complaints"

export interface DashboardComplaint {
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

function mapComplaint(c: Awaited<ReturnType<typeof getComplaintsForTourist>>["complaints"][number] & {
  statusEvents?: Array<{ createdAt: Date; note: string | null }>
  evidence?: Array<{ id: string }>
}): DashboardComplaint {
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

export async function getDashboardComplaints(
  filters: {
    status?: ComplaintStatus[]
    category?: ComplaintCategory
    priority?: Priority
    search?: string
  } = {},
  page = 1,
  limit = 10
): Promise<{ complaints: DashboardComplaint[]; total: number }> {
  const session = await getSession()
  if (!session || session.role !== "TOURIST") {
    return { complaints: [], total: 0 }
  }

  const { complaints, total } = await getComplaintsForTourist(session.userId, filters, page, limit)
  return {
    complaints: complaints.map(mapComplaint),
    total,
  }
}

export async function getDashboardStats(): Promise<{
  total: number
  open: number
  resolved: number
  needsEvidence: number
}> {
  const session = await getSession()
  if (!session || session.role !== "TOURIST") {
    return { total: 0, open: 0, resolved: 0, needsEvidence: 0 }
  }

  const [totalResult, openResult, resolvedResult] = await Promise.all([
    getComplaintsForTourist(session.userId, {}, 1, 1),
    getComplaintsForTourist(
      session.userId,
      { status: ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED", "INVESTIGATION"] },
      1,
      1
    ),
    getComplaintsForTourist(session.userId, { status: ["RESOLVED", "CLOSED"] }, 1, 1),
  ])

  return {
    total: totalResult.total,
    open: openResult.total,
    resolved: resolvedResult.total,
    needsEvidence: 0,
  }
}
