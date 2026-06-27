"use client"

import { useNotifications } from "@/hooks/useNotifications"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type NotificationPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const { notifications, loading, markRead, markAllRead } = useNotifications()
  const router = useRouter()

  const handleNotificationClick = async (n: { id: string; complaintId: string | null; isRead: boolean }) => {
    if (!n.isRead) await markRead(n.id)
    if (n.complaintId) {
      onOpenChange(false)
      router.push(`/dashboard/complaints/${n.complaintId}`)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-surface px-6 sm:max-w-md">
        <SheetHeader className="px-0 pt-2 pb-4">
          <SheetTitle className="text-lg">Notifications</SheetTitle>
          <SheetDescription className="text-sm leading-5">
            Live updates from complaint status changes and authority replies.
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 flex justify-end border-b border-border pb-4">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className="flex w-full gap-4 px-0 py-5 text-left transition hover:bg-surface-strong/30"
                onClick={() => handleNotificationClick({ id: notification.id, complaintId: notification.complaintId, isRead: notification.isRead })}
              >
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold leading-snug">{notification.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="flex items-start pt-1.5">
                    <div className="size-2.5 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
