import { prisma } from "@/lib/prisma"
import { Role, RegistrationStatus, NotificationType } from "@/lib/constants"
import { generateLoginId } from "@/lib/factory"
import { notifyInTx } from "@/services/notification"

export interface PendingRegistration {
  id: string
  displayName: string
  email: string
  documentType: string
  documentRef: string
  documentUrl: string
  createdAt: Date
}

/**
 * Fetch all tourist profile records with PENDING registration status.
 */
export async function getPendingRegistrations(): Promise<PendingRegistration[]> {
  const users = await prisma.user.findMany({
    where: {
      role: Role.TOURIST,
      touristProfile: {
        status: RegistrationStatus.PENDING,
      },
    },
    include: {
      touristProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return users.map((user) => ({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    documentType: user.touristProfile?.documentType ?? "",
    documentRef: user.touristProfile?.documentRef ?? "",
    documentUrl: user.touristProfile?.documentUrl ?? "",
    createdAt: user.createdAt,
  }))
}

/**
 * Approve a pending tourist registration.
 * Generates loginId, updates profile status, and logs credentials to console.
 */
export async function approveTouristRegistration(userId: string): Promise<{ success: boolean; loginId?: string; error?: string }> {
  try {
    const loginId = generateLoginId()

    // Check if user exists and has a pending registration
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: Role.TOURIST,
        touristProfile: {
          status: RegistrationStatus.PENDING,
        },
      },
      include: {
        touristProfile: true,
      },
    })

    if (!user) {
      return { success: false, error: "Pending tourist registration not found." }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update user's loginId
      await tx.user.update({
        where: { id: userId },
        data: { loginId },
      })

      // 2. Update tourist profile status to APPROVED
      await tx.touristProfile.update({
        where: { userId },
        data: { status: RegistrationStatus.APPROVED },
      })

      await notifyInTx(tx, {
        userId,
        type: NotificationType.REGISTRATION_APPROVED,
        title: "Registration Approved",
        body: `Your Awaaz registration has been approved. Your numeric Login ID is: ${loginId}`,
        email: {
          to: user.email,
          subject: "Your Awaaz Registration is Approved!",
          text: `Dear ${user.displayName},\n\nYour registration request has been approved.\nYour numeric Login ID is: ${loginId}\n\nPlease use this Login ID and your password to sign in.`,
        },
      })
    })

    return { success: true, loginId }
  } catch (error) {
    console.error("[Repository:admin] approveTouristRegistration failed", error)
    return { success: false, error: "Failed to approve registration." }
  }
}

/**
 * Reject a pending tourist registration with a reason.
 */
export async function rejectTouristRegistration(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists and has a pending registration
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: Role.TOURIST,
        touristProfile: {
          status: RegistrationStatus.PENDING,
        },
      },
    })

    if (!user) {
      return { success: false, error: "Pending tourist registration not found." }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update tourist profile status to REJECTED and set rejectionReason
      await tx.touristProfile.update({
        where: { userId },
        data: {
          status: RegistrationStatus.REJECTED,
          rejectionReason: reason,
        },
      })

      await notifyInTx(tx, {
        userId,
        type: NotificationType.REGISTRATION_REJECTED,
        title: "Registration Rejected",
        body: `Your registration request was rejected. Reason: ${reason}`,
        email: {
          to: user.email,
          subject: "Your Awaaz Registration was Rejected",
          text: `Dear ${user.displayName},\n\nYour registration request was rejected.\nReason: ${reason}\n\nIf you have any questions, please contact support.`,
        },
      })
    })

    return { success: true }
  } catch (error) {
    console.error("[Repository:admin] rejectTouristRegistration failed", error)
    return { success: false, error: "Failed to reject registration." }
  }
}
