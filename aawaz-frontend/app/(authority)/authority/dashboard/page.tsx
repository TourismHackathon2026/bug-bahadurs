import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Authority Dashboard | Awaaz",
  description: "Overview of complaints assigned to your department.",
}

export default async function AuthorityDashboardPage() {
  const session = await getSession()
  if (!session || session.role !== "AUTHORITY") notFound()

  const [total, awaiting, active, resolved] = await Promise.all([
    prisma.complaint.count({ where: { assignedToId: session.userId } }),
    prisma.complaint.count({ where: { assignedToId: session.userId, status: "ASSIGNED" } }),
    prisma.complaint.count({
      where: {
        assignedToId: session.userId,
        status: { in: ["UNDER_REVIEW", "ASSIGNED", "INVESTIGATION"] },
      },
    }),
    prisma.complaint.count({ where: { assignedToId: session.userId, status: { in: ["RESOLVED", "CLOSED"] } } }),
  ])

  const recent = await prisma.complaint.findMany({
    where: { assignedToId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      referenceNo: true,
      title: true,
      status: true,
      priority: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authority Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Real-time summary of complaints assigned to your local office/department.
        </p>
      </div>

      {/* Overview stats */}
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

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Recent Complaints</h3>
          <Button asChild size="sm" variant="outline">
            <Link href="/authority/complaints">View all</Link>
          </Button>
        </div>
        <div className="mt-4 divide-y divide-border">
          {recent.map((complaint) => (
            <Link
              key={complaint.id}
              href={`/authority/complaints/${complaint.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm hover:text-primary"
            >
              <span>
                <span className="font-mono text-xs text-muted-foreground">{complaint.referenceNo}</span>
                <span className="ml-3 font-medium">{complaint.title}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {complaint.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))}
          {!recent.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No assigned complaints yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
