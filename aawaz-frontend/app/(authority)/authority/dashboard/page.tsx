import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authority Dashboard | Awaaz",
  description: "Overview of complaints assigned to your department.",
}

export default function AuthorityDashboardPage() {
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
          { label: "Assigned Complaints", value: "12", color: "text-foreground" },
          { label: "Open / In Progress", value: "8", color: "text-accent" },
          { label: "Awaiting Action", value: "3", color: "text-destructive" },
          { label: "Resolved (This Week)", value: "4", color: "text-success" },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart mock block */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Complaints by Category</h3>
          <div className="flex h-60 w-full items-center justify-center bg-surface rounded-lg border text-muted-foreground text-xs">
            Bar Chart (Recharts) Placeholder - Category distribution
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Resolution Performance</h3>
          <div className="flex h-60 w-full items-center justify-center bg-surface rounded-lg border text-muted-foreground text-xs">
            Line Chart Placeholder - Response time over days
          </div>
        </div>
      </div>
    </div>
  )
}
