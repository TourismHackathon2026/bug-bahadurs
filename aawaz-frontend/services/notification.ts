import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { sseEmitter } from "@/lib/sse-emitter"
import { invalidateCache } from "@/lib/redis"
import { NotificationType, type NotificationType as NotificationTypeValue } from "@/lib/constants"

export interface NotifyParams {
  userId: string
  complaintId?: string
  type: NotificationType
  title: string
  body: string
  email?: {
    to: string
    subject: string
    text: string
  }
}

function getComplaintLink(type: NotificationTypeValue, complaintId?: string): string | undefined {
  if (!complaintId) return undefined

  const authorityDetailTypes = new Set<NotificationTypeValue>([
    NotificationType.NEW_ASSIGNMENT,
    NotificationType.EVIDENCE_UPLOADED,
    NotificationType.ESCALATED,
  ])

  if (authorityDetailTypes.has(type)) {
    return `/authority/complaints/${complaintId}`
  }

  const touristDetailTypes = new Set<NotificationTypeValue>([
    NotificationType.COMPLAINT_SUBMITTED,
    NotificationType.STATUS_CHANGED,
    NotificationType.EVIDENCE_REQUESTED,
    NotificationType.RESOLVED,
  ])

  if (touristDetailTypes.has(type)) {
    return `/complaints/${complaintId}`
  }

  return undefined
}

async function dispatch(params: NotifyParams): Promise<void> {
  sseEmitter.emit(params.userId, "NEW_NOTIFICATION", {
    type: params.type,
    title: params.title,
    body: params.body,
    complaintId: params.complaintId,
  })

  if (params.email) {
    const complaintLink = getComplaintLink(params.type, params.complaintId)
    const text = complaintLink
      ? `${params.email.text}\n\nView complaint details: ${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || ""
      }${complaintLink}`
      : params.email.text

    await sendEmail({
      to: params.email.to,
      subject: params.email.subject,
      text,
      complaintLink,
    })
  }

  await invalidateCache(`notifications:${params.userId}:*`)
}

/**
 * Create a notification inside an existing Prisma transaction.
 * Call from inside `prisma.$transaction(async (tx) => { ... })`.
 */
export async function notifyInTx(
  tx: any,
  params: NotifyParams,
): Promise<void> {
  await tx.notification.create({
    data: {
      userId: params.userId,
      complaintId: params.complaintId ?? null,
      type: params.type,
      title: params.title,
      body: params.body,
      isRead: false,
    },
  })

  await dispatch(params)
}

/**
 * Create a notification standalone (outside a transaction).
 */
export async function notify(params: NotifyParams): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      complaintId: params.complaintId ?? null,
      type: params.type,
      title: params.title,
      body: params.body,
      isRead: false,
    },
  })

  await dispatch(params)
}
