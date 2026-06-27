"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { markNotificationRead, markAllNotificationsRead, fetchNotifications } from "@/actions/notification.actions"
import { useSSE } from "@/hooks/useSSE"

export interface Notification {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
  complaintId: string | null
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const sseState = useSSE()
  const initialFetchDone = useRef(false)

  const load = useCallback(async () => {
    const result = await fetchNotifications(1, 50)
    if (result.success && result.notifications) {
      setNotifications(result.notifications)
      setUnreadCount(result.unreadCount ?? 0)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      load()
    }
  }, [load])

  useEffect(() => {
    if (sseState.lastEvent?.type === "NEW_NOTIFICATION") {
      load()
    }
  }, [sseState.lastEvent, load])

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
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
    loading,
    markRead,
    markAllRead,
  }
}
