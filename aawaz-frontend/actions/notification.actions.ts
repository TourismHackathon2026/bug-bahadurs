"use server"

import { getSession } from "@/lib/session"
import { markAsRead, markAllAsRead as repoMarkAllAsRead, getUnreadCount } from "@/server/notifications"
import { invalidateCache } from "@/lib/redis"

export async function markNotificationRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: "Unauthorized" }

    await markAsRead(id)
    await invalidateCache(`notifications:${session.userId}:*`)

    return { success: true }
  } catch (error) {
    console.error("[Action:notification] markNotificationRead failed", error)
    return { success: false, error: "Failed to mark notification as read." }
  }
}

export async function markAllNotificationsRead(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: "Unauthorized" }

    await repoMarkAllAsRead(session.userId)
    await invalidateCache(`notifications:${session.userId}:*`)

    return { success: true }
  } catch (error) {
    console.error("[Action:notification] markAllNotificationsRead failed", error)
    return { success: false, error: "Failed to mark all notifications as read." }
  }
}

export async function fetchNotifications(page = 1, limit = 20): Promise<{
  success: boolean
  notifications?: Array<{
    id: string
    title: string
    body: string
    type: string
    isRead: boolean
    createdAt: string
    complaintId: string | null
  }>
  unreadCount?: number
  total?: number
  error?: string
}> {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: "Unauthorized" }

    const { getNotifications } = await import("@/server/notifications")
    const [result, unreadCount] = await Promise.all([
      getNotifications(session.userId, page, limit),
      getUnreadCount(session.userId),
    ])

    return {
      success: true,
      notifications: result.notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        complaintId: n.complaintId,
      })),
      unreadCount,
      total: result.total,
    }
  } catch (error) {
    console.error("[Action:notification] fetchNotifications failed", error)
    return { success: false, error: "Failed to fetch notifications." }
  }
}
