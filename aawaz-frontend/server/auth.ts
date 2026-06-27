// ★ Repository pattern — all DB access for auth lives here
import { Role } from "@/lib/constants"

export interface User {
  id: string
  role: Role
  passwordHash: string
  loginId: string | null
  email: string
  displayName: string
  createdAt: Date
}

export interface TouristProfile {
  id: string
  userId: string
  status: string
  documentType: string
  documentRef: string
  documentUrl: string
  rejectionReason: string | null
}

export interface AuthorityProfile {
  id: string
  userId: string
  authorityType: string
}

/**
 * Find user by their numeric Login ID (8-digit)
 */
export async function findUserByLoginId(loginId: string): Promise<User | null> {
  console.log(`[Repository:auth] findUserByLoginId for ${loginId} - not implemented`)
  return null
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  console.log(`[Repository:auth] findUserByEmail for ${email} - not implemented`)
  return null
}

/**
 * Create a new user
 */
export async function createUser(data: {
  email: string
  displayName: string
  passwordHash: string
  role: Role
}): Promise<User> {
  console.log("[Repository:auth] createUser - not implemented", data)
  throw new Error("Not yet implemented")
}

/**
 * Create tourist profile for user
 */
export async function createTouristProfile(data: {
  userId: string
  documentType: string
  documentRef: string // encrypted
  documentUrl: string
}): Promise<TouristProfile> {
  console.log("[Repository:auth] createTouristProfile - not implemented", data)
  throw new Error("Not yet implemented")
}

/**
 * Create authority profile for user
 */
export async function createAuthorityProfile(data: {
  userId: string
  authorityType: string
}): Promise<AuthorityProfile> {
  console.log("[Repository:auth] createAuthorityProfile - not implemented", data)
  throw new Error("Not yet implemented")
}
