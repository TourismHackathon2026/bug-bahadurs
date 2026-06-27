"use client"

import { useState, useEffect } from "react"
import { markNotificationRead, markAllNotificationsRead } from "@/actions/notification.actions"

export interface Notification {
  id: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  complaintId?: string
}

/**
 * Hook to manage notification state and unread badge count
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Stub: fetch notifications count and list
    console.log("[Hook:useNotifications] Fetching notifications - stub")
  }, [])

  const markRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
    
    await markNotificationRead(id)
  }

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
    
    await markAllNotificationsRead()
  }

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  }
}
