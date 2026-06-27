"use client"

import { Bell } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

type NotificationBellProps = {
  unreadCount: number
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  const label = unreadCount > 99 ? "99+" : String(unreadCount)

  return (
    <Button variant="outline" size="icon" className="relative" aria-label="Open notifications">
      <Bell weight="duotone" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
          {label}
        </span>
      ) : null}
    </Button>
  )
}

