"use server"

/**
 * Server action to register a tourist
 */
export async function registerTourist(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("[Action:auth] registerTourist - not implemented")
  return { success: false, error: "Not yet implemented" }
}

/**
 * Server action to log in a user (tourist, authority, or admin)
 */
export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log("[Action:auth] login - not implemented")
  return { success: false, error: "Not yet implemented" }
}

/**
 * Server action to log out a user
 */
export async function logout(): Promise<void> {
  console.log("[Action:auth] logout - not implemented")
}
