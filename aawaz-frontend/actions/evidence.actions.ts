"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

/**
 * Server action to confirm evidence has been successfully uploaded to object storage
 */
export async function confirmEvidence(
  complaintId: string,
  storageKey: string,
  mimeType: string,
  sizeBytes: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: "Unauthorized." }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { touristId: true, assignedToId: true },
    })

    if (!complaint) return { success: false, error: "Complaint not found." }
    const canAttach =
      session.role === "ADMIN" ||
      complaint.touristId === session.userId ||
      complaint.assignedToId === session.userId

    if (!canAttach) return { success: false, error: "Unauthorized." }

    await prisma.evidence.create({
      data: {
        complaintId,
        storageKey,
        mimeType,
        sizeBytes,
      },
    })

    revalidatePath(`/dashboard/complaints/${complaintId}`)
    revalidatePath(`/authority/complaints/${complaintId}`)
    return { success: true }
  } catch (error) {
    console.error("[Action:evidence] confirmEvidence failed", error)
    return { success: false, error: "Failed to save evidence." }
  }
}
