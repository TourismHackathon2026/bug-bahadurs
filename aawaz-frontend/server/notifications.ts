import { prisma } from "@/lib/prisma"
import type { NotificationType } from "@/lib/constants"

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

export async function getNotifications(
  userId: string,
  page: number,
  limit: number,
): Promise<{ notifications: Notification[]; total: number }> {
  const where = { userId }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ])

  return { notifications, total }
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  })
}

export async function markAsRead(id: string): Promise<void> {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })
}

export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}
