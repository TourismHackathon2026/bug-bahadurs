import { cookies } from "next/headers"
import { createSessionToken, SESSION_COOKIE_NAME, type Session, verifySessionToken } from "@/lib/session-token"

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

export async function setSession(session: Session): Promise<void> {
  const token = await createSessionToken(session)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
