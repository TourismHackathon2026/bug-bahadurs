"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { AuthorityType, ComplaintStatus, Role } from "@/lib/constants"
import { hashPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { approveTouristRegistration, rejectTouristRegistration } from "@/server/admin"
import { updateComplaintStatus as repoUpdateComplaintStatus } from "@/server/complaints"

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

const createAuthoritySchema = z.object({
  displayName: z.string().trim().min(2, "Department name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
  authorityType: z.nativeEnum(AuthorityType, {
    message: "Please select a valid department type.",
  }),
})

const updateAuthoritySchema = z.object({
  id: z.string().uuid("Invalid authority id."),
  displayName: z.string().trim().min(2, "Department name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
})

function readField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

/**
 * Server action to create a new authority account
 */
export async function createAuthority(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean; error?: string; fields?: Record<string, string> }> {
  try {
    const parsed = createAuthoritySchema.safeParse({
      displayName: readField(formData, "displayName"),
      email: readField(formData, "email"),
      password: readField(formData, "password"),
      authorityType: readField(formData, "authorityType"),
    })

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed.",
        fields: parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
          const field = issue.path[0]
          if (typeof field === "string" && !acc[field]) {
            acc[field] = issue.message
          }
          return acc
        }, {}),
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    })

    if (existingUser) {
      return { success: false, error: "An account with that email already exists.", fields: { email: "That email is already in use." } }
    }

    const passwordHash = await hashPassword(parsed.data.password)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          role: Role.AUTHORITY,
          email: parsed.data.email,
          displayName: parsed.data.displayName,
          passwordHash,
        },
        select: { id: true },
      })

      await tx.authorityProfile.create({
        data: {
          userId: user.id,
          authorityType: parsed.data.authorityType,
        },
      })
    })

    revalidatePath("/admin/authorities")
    return { success: true }
  } catch (error) {
    console.error("[Action:admin] createAuthority failed", error)
    return { success: false, error: "Failed to create authority account." }
  }
}

/**
 * Server action to update an existing authority account
 */
export async function updateAuthority(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean; error?: string; fields?: Record<string, string> }> {
  try {
    const parsed = updateAuthoritySchema.safeParse({
      id: readField(formData, "id"),
      displayName: readField(formData, "displayName"),
      email: readField(formData, "email"),
    })

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed.",
        fields: parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
          const field = issue.path[0]
          if (typeof field === "string" && !acc[field]) {
            acc[field] = issue.message
          }
          return acc
        }, {}),
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, role: true },
    })

    if (!existingUser || existingUser.role !== Role.AUTHORITY) {
      return { success: false, error: "Authority account not found." }
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    })

    if (emailOwner && emailOwner.id !== parsed.data.id) {
      return { success: false, error: "An account with that email already exists.", fields: { email: "That email is already in use." } }
    }

    await prisma.user.update({
      where: { id: parsed.data.id },
      data: {
        displayName: parsed.data.displayName,
        email: parsed.data.email,
      },
    })

    revalidatePath("/admin/authorities")
    return { success: true }
  } catch (error) {
    console.error("[Action:admin] updateAuthority failed", error)
    return { success: false, error: "Failed to update authority account." }
  }
}

/**
 * Server action to escalate a complaint to investigation.
 */
export async function escalateComplaintAction(
  complaintId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." }
    }

    await repoUpdateComplaintStatus(
      complaintId,
      ComplaintStatus.INVESTIGATION,
      session.userId,
      "Escalated by admin",
    )

    revalidatePath("/admin/complaints")
    revalidatePath(`/admin/complaints/${complaintId}`)
    revalidatePath("/authority/complaints")

    return { success: true }
  } catch (error) {
    console.error("[Action:admin] escalateComplaintAction failed", error)
    return { success: false, error: "Failed to escalate complaint." }
  }
}

