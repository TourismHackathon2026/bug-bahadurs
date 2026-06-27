"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ComplaintStatus, ComplaintCategory } from "@/lib/constants"
import { getSession } from "@/lib/session"
import { createComplaint as repoCreateComplaint } from "@/server/complaints"
import { categorizeComplaint } from "@/server/ai"

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
  let createdId: string | undefined

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

    const complaint = await repoCreateComplaint({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      incidentDate: parsedDate,
      locationLat: parsed.data.locationLat ?? undefined,
      locationLng: parsed.data.locationLng ?? undefined,
      locationLabel: parsed.data.locationLabel ?? undefined,
      touristId: session.userId,
    })

    createdId = complaint.id

    // Enqueue background AI job if feature-flagged
    if (process.env.FF_AI_CATEGORIZATION === "true") {
      categorizeComplaint(complaint.id, complaint.description).catch((err) => {
        console.error("[Action:complaint] Background AI categorization failed", err)
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/complaints")
  } catch (error) {
    console.error("[Action:complaint] createComplaint failed", error)
    return { success: false, error: "Failed to submit the complaint. Please try again." }
  }

  if (createdId) {
    redirect(`/dashboard/complaints/${createdId}`)
  }

  return { success: false, error: "Could not redirect after creating complaint." }
}

/**
 * Server action to update complaint status
 */
export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action:complaint] updateComplaintStatus for ${id} to ${status} - not implemented`)
  return { success: false, error: "Not yet implemented" }
}

/**
 * Server action to resolve a complaint
 */
export async function resolveComplaint(
  id: string,
  summary: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action:complaint] resolveComplaint for ${id} - not implemented`)
  return { success: false, error: "Not yet implemented" }
}
