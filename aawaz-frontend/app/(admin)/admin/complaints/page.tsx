import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"

export const metadata: Metadata = {
  title: "All Complaints | Awaaz",
  description: "Global complaint directory.",
}

export default function AdminAllComplaintsPage() {
  const mockComplaints = [
    {
      id: "c1",
      referenceNo: "AWAAZ-2026-00189",
      title: "Harassment near trekking trail entrance",
      category: "HARASSMENT",
      status: "INVESTIGATION" as const,
      priority: "HIGH" as const,
      assignedTo: "Traffic Police Division",
      reporter: "Sarah Jenkins",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Complaints Directory</h1>
        <p className="text-sm text-muted-foreground">
          Admin portal view with access to modify assignments or escalate complaints across all departments.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Reporter</th>
                <th className="px-6 py-3">Assigned Authority</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 text-right">Escalate</th>
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
                  <td className="px-6 py-4">{item.reporter}</td>
                  <td className="px-6 py-4">{item.assignedTo}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button className="rounded-md border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10">
                      Escalate
                    </button>
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
