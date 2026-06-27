import type { Metadata } from "next"
import { Bell } from "@phosphor-icons/react/dist/ssr"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getNotifications } from "@/server/notifications"
import { NotificationList } from "@/components/notification/notification-list"

export const metadata: Metadata = {
  title: "Authority Notifications | Awaaz",
  description: "View updates on your assigned cases.",
}

export default async function AuthorityNotificationsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { notifications } = await getNotifications(session.userId, 1, 50)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Department Notifications</h1>
      </div>

      {notifications.length > 0 ? (
        <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <NotificationList notifications={notifications} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          <Bell size={32} />
          <p className="mt-2 text-sm">No new notifications</p>
        </div>
      )}
    </div>
  )
}
