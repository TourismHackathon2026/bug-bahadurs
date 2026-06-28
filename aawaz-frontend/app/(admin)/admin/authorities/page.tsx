import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreateAuthorityModal } from "@/components/admin/create-authority-modal"
import { EditAuthorityModal } from "@/components/admin/edit-authority-modal"

export const metadata: Metadata = {
  title: "Manage Authorities | Awaaz",
  description: "Create and manage authority accounts.",
}

export default function ManageAuthoritiesPage() {
  const mockAuthorities = [
    {
      id: "a1",
      displayName: "Traffic Police Division",
      email: "traffic@police.gov.np",
      authorityType: "TRAFFIC_POLICE",
      assignedCount: 4,
    },
    {
      id: "a2",
      displayName: "Nepal Tourism Board Support",
      email: "support@tourism.gov.np",
      authorityType: "TOURISM_BOARD",
      assignedCount: 7,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Authorities</h1>
          <p className="text-sm text-muted-foreground">
            Configure department accounts and monitor active case assignments.
          </p>
        </div>
        <div>
          <CreateAuthorityModal />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Department Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Department Type</th>
                <th className="px-6 py-3 text-center">Active Complaints</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAuthorities.map((item) => (
                <tr key={item.id} className="hover:bg-surface-strong/30">
                  <td className="px-6 py-4 font-medium">{item.displayName}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{item.authorityType}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-xs">{item.assignedCount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <EditAuthorityModal
                      id={item.id}
                      displayName={item.displayName}
                      email={item.email}
                    />
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
