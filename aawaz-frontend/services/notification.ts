import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { sseEmitter } from "@/lib/sse-emitter"
import { invalidateCache } from "@/lib/redis"
import type { NotificationType } from "@/lib/constants"

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

async function dispatch(params: NotifyParams): Promise<void> {
  sseEmitter.emit(params.userId, "NEW_NOTIFICATION", {
    type: params.type,
    title: params.title,
    body: params.body,
    complaintId: params.complaintId,
  })

  if (params.email) {
    await sendEmail({
      to: params.email.to,
      subject: params.email.subject,
      text: params.email.text,
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
