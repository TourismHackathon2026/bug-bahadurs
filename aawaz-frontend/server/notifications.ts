// ★ Repository pattern — all DB access for notifications lives here
import { NotificationType } from "@/lib/constants"

export interface Notification {
  id: string
  userId: string
  complaintId: string | null
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  createdAt: Date
}

export async function createNotification(data: {
  userId: string
  type: NotificationType
  title: string
  body: string
  complaintId?: string
}): Promise<Notification> {
  console.log("[Repository:notifications] createNotification - not implemented", data)
  throw new Error("Not yet implemented")
}

export async function getNotifications(
  userId: string,
  page: number,
  limit: number
): Promise<{ notifications: Notification[]; total: number }> {
  console.log(`[Repository:notifications] getNotifications for ${userId} - not implemented`)
  return { notifications: [], total: 0 }
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  console.log(`[Repository:notifications] getUnreadNotifications for ${userId} - not implemented`)
  return []
}

export async function getUnreadCount(userId: string): Promise<number> {
  console.log(`[Repository:notifications] getUnreadCount for ${userId} - not implemented`)
  return 0
}

export async function markAsRead(id: string): Promise<Notification> {
  console.log(`[Repository:notifications] markAsRead for ${id} - not implemented`)
  throw new Error("Not yet implemented")
}

export async function markAllAsRead(userId: string): Promise<void> {
  console.log(`[Repository:notifications] markAllAsRead for ${userId} - not implemented`)
  throw new Error("Not yet implemented")
}
