import type { Metadata } from "next"
import { Suspense } from "react"
import { FeedComposerCTA } from "@/components/complaint/feed-composer-cta"
import { FeedFilterBar } from "@/components/complaint/feed-filter-bar"
import { ComplaintCard } from "@/components/complaint/complaint-card"
import { ComplaintFeedSkeleton } from "@/components/complaint/complaint-feed-skeleton"
import { getDashboardComplaints, getDashboardStats } from "@/actions/dashboard.actions"

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

async function ComplaintFeed() {
  const { complaints } = await getDashboardComplaints({}, 1, 10)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">Complaint Feed</h2>
      <FeedFilterBar activeFilters={["Active Cases"]} />
      
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

export default function TouristDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Summary strip */}
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
        <ComplaintFeed />
      </Suspense>
    </div>
  )
}
