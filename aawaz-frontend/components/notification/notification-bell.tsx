"use client"

import { useState } from "react"
import { Bell } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { NotificationPanel } from "@/components/notification/notification-panel"
import { useNotifications } from "@/hooks/useNotifications"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const label = unreadCount > 99 ? "99+" : String(unreadCount)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        aria-label="Open notifications"
        onClick={() => setOpen(true)}
      >
        <Bell weight="duotone" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
            {label}
          </span>
        ) : null}
      </Button>
      <NotificationPanel open={open} onOpenChange={setOpen} />
    </>
  )
}
