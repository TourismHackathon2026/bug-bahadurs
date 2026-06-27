import { BellRinging, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr"

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

const notifications = [
  {
    icon: BellRinging,
    title: "Status changed",
    body: "Your complaint AWA-2026-0142 moved to investigation.",
    time: "2 minutes ago",
  },
  {
    icon: WarningCircle,
    title: "Evidence requested",
    body: "Traffic Police requested one more receipt or image.",
    time: "1 hour ago",
  },
  {
    icon: CheckCircle,
    title: "Complaint resolved",
    body: "Tourism Board has marked AWA-2026-0098 as resolved.",
    time: "Yesterday",
  },
]

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-surface sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Live updates from complaint status changes and authority replies.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
        <div className="mt-4 divide-y">
          {notifications.map((notification) => (
            <div key={notification.title} className="flex gap-3 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <notification.icon size={18} weight="duotone" />
              </div>
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {notification.body}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

