"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { ComplaintStatus, ComplaintCategory, Priority, NotificationType } from "@/lib/constants"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import {
  createComplaint as repoCreateComplaint,
  updateComplaintStatus as repoUpdateComplaintStatus,
} from "@/server/complaints"
import { categorizeComplaint, extractVoiceComplaint as extractVoiceComplaintAi } from "@/server/ai"
import { notifyInTx } from "@/services/notification"

const complaintSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(150, "Title must be at most 150 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000, "Description must be at most 2000 characters"),
  category: z.nativeEnum(ComplaintCategory, {
    message: "Please select a valid category.",
  }),
  incidentDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date"),
  locationLat: z.coerce.number().optional().nullable(),
  locationLng: z.coerce.number().optional().nullable(),
  locationLabel: z.string().trim().optional().nullable(),
})

function readField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

/**
 * Server action to create a new complaint
 */
export async function createComplaint(formData: FormData): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await getSession()
    if (!session || session.role !== "TOURIST") {
      return { success: false, error: "Unauthorized. Only tourists can file complaints." }
    }

    const parsed = complaintSchema.safeParse({
      title: readField(formData, "title"),
      description: readField(formData, "description"),
      category: readField(formData, "category"),
      incidentDate: readField(formData, "incidentDate"),
      locationLat: readField(formData, "locationLat") || null,
      locationLng: readField(formData, "locationLng") || null,
      locationLabel: readField(formData, "locationLabel") || null,
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input parameters." }
    }

    // Check incident date is not in the future
    const parsedDate = new Date(parsed.data.incidentDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // allow up to end of today
    if (parsedDate > today) {
      return { success: false, error: "Incident date cannot be in the future." }
    }

    const evidence = Array.from(formData.entries()).reduce<Array<{ storageKey: string; mimeType: string; sizeBytes: number }>>(
      (files, [key, value]) => {
        if (typeof value !== "string" || !key.match(/^evidence\[\d+\]\[url\]$/)) return files
        const index = key.match(/\[(\d+)\]/)?.[1]
        if (!index) return files
        const mimeType = readField(formData, `evidence[${index}][type]`) || "application/octet-stream"
        const sizeBytes = Number(readField(formData, `evidence[${index}][size]`) || 0)
        files.push({ storageKey: value, mimeType, sizeBytes })
        return files
      },
      []
    )

    const complaint = await repoCreateComplaint({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      incidentDate: parsedDate,
      locationLat: parsed.data.locationLat ?? undefined,
      locationLng: parsed.data.locationLng ?? undefined,
      locationLabel: parsed.data.locationLabel ?? undefined,
      touristId: session.userId,
      evidence,
    })

    void categorizeComplaint(complaint.id, complaint.description).catch((err) => {
      console.error("[Action:complaint] Background AI categorization failed", err)
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/complaints")
    revalidatePath("/authority/complaints")
    return { success: true, id: complaint.id }
  } catch (error) {
    console.error("[Action:complaint] createComplaint failed", error)
    return { success: false, error: "Failed to submit the complaint. Please try again." }
  }
}

/**
 * Server action to update complaint status
 */
export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session || (session.role !== "AUTHORITY" && session.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized." }
    }

    await repoUpdateComplaintStatus(id, status, session.userId, note)
    revalidatePath("/authority/dashboard")
    revalidatePath("/authority/complaints")
    revalidatePath(`/authority/complaints/${id}`)
    revalidatePath(`/dashboard/complaints/${id}`)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[Action:complaint] updateComplaintStatus failed", error)
    return { success: false, error: "Failed to update complaint status." }
  }
}

/**
 * Server action to resolve a complaint
 */
export async function resolveComplaint(
  id: string,
  summary: string
): Promise<{ success: boolean; error?: string }> {
  return updateComplaintStatus(id, ComplaintStatus.RESOLVED, summary || "Complaint resolved")
}

/**
 * Server action to manually override complaint categorization.
 */
export async function overrideCategorizationAction(
  complaintId: string,
  category: ComplaintCategory,
  priority: Priority,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session || (session.role !== "AUTHORITY" && session.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized." }
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        category,
        priority,
        aiCategory: category,
        aiConfidence: 100,
      },
    })

    revalidatePath("/authority/complaints")
    revalidatePath(`/authority/complaints/${complaintId}`)
    revalidatePath(`/dashboard/complaints/${complaintId}`)
    revalidatePath("/admin/complaints")
    revalidatePath(`/admin/complaints/${complaintId}`)

    return { success: true }
  } catch (error) {
    console.error("[Action:complaint] overrideCategorizationAction failed", error)
    return { success: false, error: "Failed to override categorization." }
  }
}

/**
 * Server action to request evidence from the complainant.
 */
export async function requestEvidenceAction(
  complaintId: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session || (session.role !== "AUTHORITY" && session.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized." }
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: {
        id: true,
        referenceNo: true,
        touristId: true,
        tourist: {
          select: { email: true, displayName: true },
        },
      },
    })

    if (!complaint) {
      return { success: false, error: "Complaint not found." }
    }

    await prisma.$transaction(async (tx) => {
      await notifyInTx(tx, {
        userId: complaint.touristId,
        complaintId,
        type: NotificationType.EVIDENCE_REQUESTED,
        title: "Evidence requested",
        body: message,
        email: complaint.tourist?.email
          ? {
            to: complaint.tourist.email,
            subject: `Evidence requested for ${complaint.referenceNo}`,
            text: `Dear ${complaint.tourist.displayName ?? "User"},\n\nEvidence has been requested for your complaint ${complaint.referenceNo}.\n\n${message}`,
          }
          : undefined,
      })
    })

    revalidatePath("/authority/complaints")
    revalidatePath(`/authority/complaints/${complaintId}`)
    revalidatePath(`/dashboard/complaints/${complaintId}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("[Action:complaint] requestEvidenceAction failed", error)
    return { success: false, error: "Failed to request evidence." }
  }
}

export async function extractVoiceComplaint(voiceTranscript: string): Promise<{
  success: boolean
  data?: { title: string; description: string; category: string }
  error?: string
}> {
  try {
    if (!voiceTranscript?.trim()) {
      console.error("[Action:complaint] Voice transcript is empty");
      return { success: false, error: "Voice transcript is empty." }
    }

    console.log("[Action:complaint] Extracting complaint from voice transcript:", {
      length: voiceTranscript.length,
      preview: voiceTranscript.substring(0, 100),
    });

    const result = await extractVoiceComplaintAi(voiceTranscript)

    if (!result) {
      console.error(
        "[Action:complaint] extractVoiceComplaintAi returned null. Check NVIDIA API key and response format.",
      );
      return {
        success: false,
        error: "Failed to extract complaint details from voice. Please try again or check your microphone input.",
      }
    }

    console.log("[Action:complaint] Successfully extracted complaint:", result);

    return {
      success: true,
      data: {
        title: result.title,
        description: result.description,
        category: result.category,
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Action:complaint] extractVoiceComplaint failed", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: "An error occurred while processing your voice complaint. Please try again.",
    }
  }
}
