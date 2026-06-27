import type { Metadata } from "next"
import { FeedComposerCTA } from "@/components/complaint/feed-composer-cta"
import { FeedFilterBar } from "@/components/complaint/feed-filter-bar"
import { ComplaintCard } from "@/components/complaint/complaint-card"
import { ShieldCheck, ChatCircle, Circle } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Dashboard | Awaaz",
  description: "View and filter your civic complaints.",
}

export default function TouristDashboardPage() {
  // Mock data for initial rendering matching the layout
  const mockComplaints = [
    {
      reference: "AWAAZ-2026-00231",
      title: "Overcharged by Taxi Driver in Kathmandu",
      description: "Took a taxi from Tribhuvan International Airport to Thamel. The meter was tampered with, and the driver demanded 4000 NPR instead of the standard rate.",
      category: "Taxi Fraud",
      status: "SUBMITTED" as const,
      priority: "NORMAL" as const,
      lastUpdated: "2 hours ago",
      evidenceCount: 2,
    },
    {
      reference: "AWAAZ-2026-00189",
      title: "Harassment near trekking trail entrance",
      description: "While registering for the trekking permit, several unauthorized local guides blocked the pathway and verbally harassed us when we refused services.",
      category: "Harassment",
      status: "INVESTIGATION" as const,
      priority: "HIGH" as const,
      lastUpdated: "1 day ago",
      evidenceCount: 1,
      responsePreview: "Nepal Police: Officer assigned to check the checkpoint CCTV footage.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Complaints", value: "2", color: "text-primary" },
          { label: "Open cases", value: "2", color: "text-accent" },
          { label: "Resolved", value: "0", color: "text-success" },
          { label: "Needs Evidence", value: "0", color: "text-muted-foreground" },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <FeedComposerCTA />
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Complaint Feed</h2>
        <FeedFilterBar activeFilters={["Active Cases"]} />
        
        <div className="grid gap-6 mt-4">
          {mockComplaints.map((complaint) => (
            <ComplaintCard key={complaint.reference} {...complaint} />
          ))}
        </div>
      </div>
    </div>
  )
}
