import type { Metadata } from "next"
import { getPendingRegistrations } from "@/server/admin"
import { RegistrationsClient } from "@/components/admin/registrations-client"

export const metadata: Metadata = {
  title: "Pending Registrations | Awaaz",
  description: "Review pending tourist registrations.",
}

export default async function PendingRegistrationsPage() {
  const pendingRegistrations = await getPendingRegistrations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Tourist Registrations</h1>
        <p className="text-sm text-muted-foreground">
          Review verification documents and approve tourist registration requests.
        </p>
      </div>

      <RegistrationsClient initialRegistrations={pendingRegistrations} />
    </div>
  )
}

