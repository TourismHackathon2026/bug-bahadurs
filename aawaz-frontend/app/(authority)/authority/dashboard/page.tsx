import type { Metadata } from "next"
import { ComplaintCard } from "@/components/complaint/complaint-card"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Authority Dashboard | Awaaz",
  description: "Overview of complaints assigned to your department.",
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

async function fetchAuthorityDashboardData(userId: string) {
  const [total, awaiting, active, resolved, complaints] = await Promise.all([
    prisma.complaint.count({ where: { assignedToId: userId } }),
    prisma.complaint.count({ where: { assignedToId: userId, status: "ASSIGNED" } }),
    prisma.complaint.count({
      where: {
        assignedToId: userId,
        status: { in: ["UNDER_REVIEW", "ASSIGNED", "INVESTIGATION"] },
      },
    }),
    prisma.complaint.count({ where: { assignedToId: userId, status: { in: ["RESOLVED", "CLOSED"] } } }),
    prisma.complaint.findMany({
      where: { assignedToId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        evidence: { select: { id: true } },
        statusEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ])

  return {
    total,
    awaiting,
    active,
    resolved,
    complaints: complaints.map((complaint) => ({
      id: complaint.id,
      reference: complaint.referenceNo,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority,
      evidenceCount: complaint.evidence.length,
      lastUpdated: formatLastUpdated(complaint.statusEvents?.[0]?.createdAt ?? complaint.updatedAt),
      responsePreview: complaint.statusEvents?.[0]?.note ?? undefined,
    })),
  }
}

export default async function AuthorityDashboardPage() {
  const session = await getSession()
  if (!session || session.role !== "AUTHORITY") {
    return null
  }

  const { total, awaiting, active, resolved, complaints } = await fetchAuthorityDashboardData(session.userId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authority Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complaints assigned to you, displayed in a scrollable feed for faster triage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Assigned Complaints", value: total, color: "text-foreground" },
          { label: "Open / In Progress", value: active, color: "text-accent" },
          { label: "Awaiting Action", value: awaiting, color: "text-destructive" },
          { label: "Resolved", value: resolved, color: "text-success" },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Assigned complaint feed</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the latest complaints assigned to your department in a familiar card-style feed.
          </p>
        </div>

        <div className="grid gap-6">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                href={`/authority/complaints/${complaint.id}`}
                {...complaint}
              />
            ))
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No complaints are currently assigned to you.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
