import { Role } from "@/lib/constants"
import { SignJWT, jwtVerify, type JWTPayload } from "jose"

export interface Session {
  userId: string
  role: Role
  displayName: string
}

export const SESSION_COOKIE_NAME = "awaaz_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

type SessionJwtPayload = JWTPayload & Session

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.")
  }

  return new TextEncoder().encode(secret)
}

export function getRoleHome(role: Role): string {
  switch (role) {
    case Role.TOURIST:
      return "/dashboard"
    case Role.AUTHORITY:
      return "/authority/dashboard"
    case Role.ADMIN:
      return "/admin/registrations"
  }
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && Object.values(Role).includes(value as Role)
}

function parseSessionPayload(payload: Record<string, unknown>): Session | null {
  if (
    typeof payload.userId !== "string" ||
    !isRole(payload.role) ||
    typeof payload.displayName !== "string"
  ) {
    return null
  }

  return {
    userId: payload.userId,
    role: payload.role,
    displayName: payload.displayName,
  }
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret())
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify<SessionJwtPayload>(token, getSessionSecret())
    return parseSessionPayload(payload)
  } catch {
    return null
  }
}
