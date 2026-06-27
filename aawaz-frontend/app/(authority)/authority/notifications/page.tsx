import type { Metadata } from "next"
import { Bell, ShieldCheck, UserCheck } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
  title: "Authority Notifications | Awaaz",
  description: "View updates on your assigned cases.",
}

export default function AuthorityNotificationsPage() {
  const mockNotifications = [
    {
      id: "1",
      title: "New Complaint Assigned",
      body: "A new complaint AWAAZ-2026-00189 (Harassment) has been assigned to your department.",
      time: "1 hour ago",
      icon: UserCheck,
      isRead: false,
    },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Department Notifications</h1>
        <button className="text-xs font-semibold text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notif) => {
            const Icon = notif.icon
            return (
              <div key={notif.id} className={`flex gap-4 p-4 transition-colors ${!notif.isRead ? "bg-primary/5" : "hover:bg-surface-strong/30"}`}>
                <div className={`flex size-10 items-center justify-center rounded-lg border ${!notif.isRead ? "border-primary/20 bg-secondary text-primary" : "border-border bg-surface text-muted-foreground"}`}>
                  <Icon size={20} weight="fill" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{notif.body}</p>
                </div>
                {!notif.isRead && (
                  <div className="flex items-center">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Bell size={32} />
            <p className="mt-2 text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}
