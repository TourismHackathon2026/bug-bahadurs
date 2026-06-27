// Session management using signed httpOnly cookies
// TODO: Implement actual signing using 'jose' when package is installed

import { Role } from "@/lib/constants"

export interface Session {
  userId: string
  role: Role
  displayName: string
}

/**
 * Read the current session from cookies.
 * Called in Server Components, Middleware, and Server Actions.
 */
export async function getSession(): Promise<Session | null> {
  console.log("[Session] getSession called - stub")
  // Placeholder mock for development layout/navbar checking:
  // In real implementation, this reads and verifies the JWT cookie.
  return null
}

/**
 * Create a new signed session cookie.
 * Called in auth login Server Action.
 */
export async function setSession(session: Session): Promise<void> {
  console.log("[Session] setSession called - stub", session)
}

/**
 * Clear the session cookie.
 * Called in auth logout Server Action.
 */
export async function clearSession(): Promise<void> {
  console.log("[Session] clearSession called - stub")
}
