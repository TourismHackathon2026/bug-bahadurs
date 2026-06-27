import type { Metadata } from "next"
import { Suspense } from "react"
import { FeedComposerCTA } from "@/components/complaint/feed-composer-cta"
import { FeedFilterBar } from "@/components/complaint/feed-filter-bar"
import { ComplaintCard } from "@/components/complaint/complaint-card"
import { ComplaintFeedSkeleton } from "@/components/complaint/complaint-feed-skeleton"
import { getDashboardComplaints, getDashboardStats } from "@/actions/dashboard.actions"
import type { ComplaintStatus, ComplaintCategory, Priority } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Dashboard | Awaaz",
  description: "View and filter your civic complaints.",
}

async function DashboardStats() {
  const stats = await getDashboardStats()
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {[
        { label: "Total Complaints", value: stats.total, color: "text-primary" },
        { label: "Open cases", value: stats.open, color: "text-accent" },
        { label: "Resolved", value: stats.resolved, color: "text-success" },
        { label: "Needs Evidence", value: stats.needsEvidence, color: "text-muted-foreground" },
      ].map((stat, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

function parseFilters(searchParams: URLSearchParams): {
  status?: ComplaintStatus[]
  category?: ComplaintCategory
  priority?: Priority
  search?: string
} {
  const filters: ReturnType<typeof parseFilters> = {}

  const status = searchParams.get("status")
  if (status) {
    filters.status = status.split(",").filter(Boolean) as ComplaintStatus[]
  }

  const priority = searchParams.get("priority")
  if (priority) {
    filters.priority = priority as Priority
  }

  const search = searchParams.get("search")
  if (search?.trim()) {
    filters.search = search.trim()
  }

  return filters
}

async function ComplaintFeed({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const urlParams = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    if (value) urlParams.set(key, Array.isArray(value) ? value.join(",") : value)
  }
  const filters = parseFilters(urlParams)
  const { complaints } = await getDashboardComplaints(filters, 1, 10)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">Complaint Feed</h2>
      <FeedFilterBar />

      <div className="grid gap-6 mt-4">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <ComplaintCard key={complaint.reference} {...complaint} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No complaints yet. File your first complaint to get started.
          </p>
        )}
      </div>
    </div>
  )
}

export default async function TouristDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg border border-border bg-card p-4 shadow-sm animate-pulse" />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <FeedComposerCTA />

      <Suspense fallback={<ComplaintFeedSkeleton />}>
        <ComplaintFeed searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
