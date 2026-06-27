"use client"

import { useState } from "react"
import { ChatCircleText, ShieldCheck, UserCheck, Bell } from "@phosphor-icons/react"
import { markNotificationRead, markAllNotificationsRead } from "@/actions/notification.actions"
import type { Notification as NotificationType } from "@/server/notifications"
import { NotificationType as NotificationTypeEnum } from "@/lib/constants"

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function iconForType(type: string) {
  switch (type) {
    case NotificationTypeEnum.COMPLAINT_SUBMITTED:
      return ChatCircleText
    case NotificationTypeEnum.STATUS_CHANGED:
    case NotificationTypeEnum.RESOLVED:
      return ShieldCheck
    case NotificationTypeEnum.NEW_ASSIGNMENT:
      return UserCheck
    default:
      return Bell
  }
}

type NotificationListProps = {
  notifications: NotificationType[]
}

export function NotificationList({ notifications: initial }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initial)

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    await markNotificationRead(id)
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    await markAllNotificationsRead()
  }

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <p className="text-xs text-muted-foreground">
          {notifications.filter((n) => !n.isRead).length} unread
        </p>
        <button
          className="text-xs font-semibold text-primary hover:underline"
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </button>
      </div>
      {notifications.map((notif) => {
        const Icon = iconForType(notif.type)
        return (
          <button
            key={notif.id}
            type="button"
            className={`flex w-full gap-4 p-4 text-left transition-colors ${
              !notif.isRead ? "bg-primary/5" : "hover:bg-surface-strong/30"
            }`}
            onClick={() => handleMarkRead(notif.id)}
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg border ${
                !notif.isRead
                  ? "border-primary/20 bg-secondary text-primary"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <Icon size={20} weight="fill" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{notif.title}</p>
                <span className="text-xs text-muted-foreground">{timeAgo(notif.createdAt)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{notif.body}</p>
            </div>
            {!notif.isRead && (
              <div className="flex items-center">
                <div className="size-2 rounded-full bg-primary" />
              </div>
            )}
          </button>
        )
      })}
    </>
  )
}
