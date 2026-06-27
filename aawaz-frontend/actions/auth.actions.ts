"use server"

import crypto from "crypto"

import { redirect } from "next/navigation"
import { z } from "zod"

import { NotificationType, RegistrationStatus, Role } from "@/lib/constants"
import { hashPassword, verifyPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"
import { clearSession, setSession } from "@/lib/session"
import { sseEmitter } from "@/lib/sse-emitter"
import { invalidateCache } from "@/lib/redis"

const registerSchema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(2).max(120),
  password: z.string().min(6).max(200),
  documentType: z.string().trim().min(1),
  documentRef: z.string().trim().min(1),
  documentUrl: z.string().trim().min(1),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

type ActionResult = { success: boolean; error?: string }

function readField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}



export async function registerTourist(formData: FormData): Promise<ActionResult> {
  try {
    const parsed = registerSchema.safeParse({
      email: readField(formData, "email"),
      displayName: readField(formData, "displayName"),
      password: readField(formData, "password"),
      documentType: readField(formData, "documentType"),
      documentRef: readField(formData, "documentRef"),
      documentUrl: readField(formData, "documentUrl"),
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Please check the registration details." }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    })

    if (existingUser) {
      return { success: false, error: "An account with that email already exists." }
    }

    const passwordHash = await hashPassword(parsed.data.password)

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          role: Role.TOURIST,
          passwordHash,
          loginId: null,
          email: parsed.data.email,
          displayName: parsed.data.displayName,
        },
        select: { id: true },
      })

      await tx.touristProfile.create({
        data: {
          userId: user.id,
          status: RegistrationStatus.PENDING,
          documentType: parsed.data.documentType,
          documentRef: parsed.data.documentRef,
          documentUrl: parsed.data.documentUrl,
        },
      })

      const adminUsers = await tx.user.findMany({
        where: { role: Role.ADMIN },
        select: { id: true },
      })

      if (adminUsers.length > 0) {
        await tx.notification.createMany({
          data: adminUsers.map((admin) => ({
            userId: admin.id,
            type: NotificationType.REGISTRATION_SUBMITTED,
            title: "New tourist registration",
            body: `${parsed.data.displayName} submitted a registration request.`,
            isRead: false,
          })),
        })

        for (const admin of adminUsers) {
          sseEmitter.emit(admin.id, "NEW_NOTIFICATION", {
            type: NotificationType.REGISTRATION_SUBMITTED,
            title: "New tourist registration",
            body: `${parsed.data.displayName} submitted a registration request.`,
          })
        }

        await Promise.all(
          adminUsers.map((a) => invalidateCache(`notifications:${a.id}:*`)),
        )
      }
    })

    return { success: true }
  } catch (error) {
    console.error("[Action:auth] registerTourist failed", error)
    return { success: false, error: "Registration could not be completed right now." }
  }
}

export async function login(formData: FormData): Promise<ActionResult> {
  let user:
    | {
        id: string
        role: Role
        passwordHash: string
        displayName: string
      }
    | null = null

  try {
    const parsed = loginSchema.safeParse({
      email: readField(formData, "email"),
      password: readField(formData, "password"),
    })

    if (!parsed.success) {
      return { success: false, error: "Enter a valid email address and password." }
    }

    user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        role: true,
        passwordHash: true,
        displayName: true,
      },
    })

    if (!user) {
      return { success: false, error: "We couldn't find an account for that email address." }
    }

    const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash)

    if (!passwordMatches) {
      return { success: false, error: "The password does not match that email address." }
    }

    await setSession({
      userId: user.id,
      role: user.role,
      displayName: user.displayName,
    })
  } catch (error) {
    console.error("[Action:auth] login failed", error)
    return { success: false, error: "Sign in failed. Please try again." }
  }

  if (!user) {
    return { success: false, error: "We couldn't sign you in just now." }
  }

  redirect(
    user.role === Role.TOURIST
      ? "/dashboard"
      : user.role === Role.AUTHORITY
        ? "/authority/dashboard"
        : "/admin/registrations"
  )
}

export async function logout(): Promise<void> {
  await clearSession()
  redirect("/login")
}
