import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Pending Registrations | Awaaz",
  description: "Review pending tourist registrations.",
}

export default function PendingRegistrationsPage() {
  const mockRegistrations = [
    {
      id: "u1",
      displayName: "John Miller",
      email: "john.miller@example.com",
      documentType: "Passport",
      documentRef: "US987654321",
      submittedDate: "June 26, 2026",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Tourist Registrations</h1>
        <p className="text-sm text-muted-foreground">
          Review verification documents and approve tourist registration requests.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Document Type</th>
                <th className="px-6 py-3">Document Number</th>
                <th className="px-6 py-3">Submission Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockRegistrations.length > 0 ? (
                mockRegistrations.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-strong/30">
                    <td className="px-6 py-4 font-medium">{item.displayName}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{item.documentType}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{item.documentRef}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{item.submittedDate}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                      <Button variant="secondary" size="sm">
                        Reject
                      </Button>
                      <Button size="sm">
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No pending registration applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
