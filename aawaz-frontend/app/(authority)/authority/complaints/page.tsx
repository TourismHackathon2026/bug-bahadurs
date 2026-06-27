import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { FileText, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Assigned Complaints | Awaaz",
  description: "View and update complaints assigned to you.",
}

export default function AuthorityComplaintsPage() {
  const mockComplaints = [
    {
      id: "c1",
      referenceNo: "AWAAZ-2026-00189",
      title: "Harassment near trekking trail entrance",
      category: "HARASSMENT",
      status: "INVESTIGATION" as const,
      priority: "HIGH" as const,
      touristName: "Sarah Jenkins",
      date: "June 24, 2026",
    },
    {
      id: "c2",
      referenceNo: "AWAAZ-2026-00115",
      title: "Overcharged double for lodging in Pokhara",
      category: "HOTEL_ISSUE",
      status: "ASSIGNED" as const,
      priority: "NORMAL" as const,
      touristName: "Pierre Dubois",
      date: "June 20, 2026",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assigned Complaints</h1>
          <p className="text-sm text-muted-foreground">
            List of civic complaints currently assigned to your department.
          </p>
        </div>
      </div>

      {/* Filter / search block */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Search by title or reference..."
            className="rounded-md border border-input bg-surface px-3 py-2 text-sm"
            disabled
          />
          <select className="rounded-md border border-input bg-surface px-3 py-2 text-sm" disabled>
            <option>All Statuses</option>
          </select>
          <select className="rounded-md border border-input bg-surface px-3 py-2 text-sm" disabled>
            <option>All Priorities</option>
          </select>
        </div>
      </div>

      {/* Dense list/table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Reporter</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockComplaints.map((item) => (
                <tr key={item.id} className="hover:bg-surface-strong/30">
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold">
                    {item.referenceNo}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">{item.touristName}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link href={`/authority/complaints/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
