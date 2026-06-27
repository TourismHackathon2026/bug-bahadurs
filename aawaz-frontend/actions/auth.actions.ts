"use server"

import crypto from "crypto"

import { redirect } from "next/navigation"
import { z } from "zod"

import { NotificationType, RegistrationStatus, Role } from "@/lib/constants"
import { hashPassword, verifyPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"
import { clearSession, setSession } from "@/lib/session"

const registerSchema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(2).max(120),
  password: z.string().min(6).max(200),
  documentType: z.string().trim().min(1),
  documentRef: z.string().trim().min(1),
  documentUrl: z.string().trim().min(1),
})

const loginSchema = z.object({
  loginId: z.string().trim().regex(/^\d{8}$/),
  password: z.string().min(1),
})

type ActionResult = { success: boolean; error?: string }

function readField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function encryptDocumentRef(documentRef: string): string {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be configured before handling registrations.")
  }

  const key = crypto.createHash("sha256").update(secret).digest()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([cipher.update(documentRef, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return `v1:${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`
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
    const encryptedDocumentRef = encryptDocumentRef(parsed.data.documentRef)

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
          documentRef: encryptedDocumentRef,
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
      loginId: readField(formData, "loginId"),
      password: readField(formData, "password"),
    })

    if (!parsed.success) {
      return { success: false, error: "Enter a valid 8-digit Login ID and password." }
    }

    user = await prisma.user.findUnique({
      where: { loginId: parsed.data.loginId },
      select: {
        id: true,
        role: true,
        passwordHash: true,
        displayName: true,
      },
    })

    if (!user) {
      return { success: false, error: "We couldn't find an approved account for that Login ID." }
    }

    const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash)

    if (!passwordMatches) {
      return { success: false, error: "The password does not match that Login ID." }
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
