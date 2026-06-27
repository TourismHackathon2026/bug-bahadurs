"use server"

import { revalidatePath } from "next/cache"
import { approveTouristRegistration, rejectTouristRegistration } from "@/server/admin"

/**
 * Server action to approve tourist registration
 */
export async function approveRegistration(userId: string): Promise<{ success: boolean; error?: string }> {
  const result = await approveTouristRegistration(userId)
  if (result.success) {
    revalidatePath("/admin/registrations")
  }
  return { success: result.success, error: result.error }
}

/**
 * Server action to reject tourist registration with reason
 */
export async function rejectRegistration(
  userId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (!reason.trim()) {
    return { success: false, error: "Rejection reason is required." }
  }
  const result = await rejectTouristRegistration(userId, reason)
  if (result.success) {
    revalidatePath("/admin/registrations")
  }
  return { success: result.success, error: result.error }
}

/**
 * Server action to create a new authority account
 */
export async function createAuthority(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("[Action:admin] createAuthority - not implemented")
  return { success: false, error: "Not yet implemented" }
}

