// Validation schemas and types
// TODO: Replace with Zod schemas when package is installed

export interface LoginInput {
  loginId: string
  password: string
}

export interface RegisterInput {
  email: string
  displayName: string
  password: string
  confirmPassword?: string
  documentType: string
  documentRef: string
}

export interface ComplaintInput {
  title: string
  description: string
  category: string
  incidentDate: string
  locationLat?: number
  locationLng?: number
  locationLabel?: string
}

type InputRecord = Record<string, unknown>

function isInputRecord(input: unknown): input is InputRecord {
  return input !== null && typeof input === "object" && !Array.isArray(input)
}

/**
 * Basic validator for login input
 */
export function validateLoginInput(input: unknown): {
  success: boolean
  data?: LoginInput
  error?: string
} {
  if (!isInputRecord(input)) {
    return { success: false, error: "Invalid input shape" }
  }
  
  const { loginId, password } = input
  if (!loginId || typeof loginId !== "string" || loginId.trim() === "") {
    return { success: false, error: "Login ID is required" }
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    return { success: false, error: "Password is required" }
  }
  
  return { success: true, data: { loginId, password } }
}

/**
 * Basic validator for registration input
 */
export function validateRegisterInput(input: unknown): {
  success: boolean
  data?: RegisterInput
  error?: string
} {
  if (!isInputRecord(input)) {
    return { success: false, error: "Invalid input shape" }
  }

  const { email, displayName, password, documentType, documentRef } = input

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { success: false, error: "Valid email address is required" }
  }
  if (!displayName || typeof displayName !== "string" || displayName.trim().length < 2) {
    return { success: false, error: "Display name must be at least 2 characters" }
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }
  if (!documentType || typeof documentType !== "string") {
    return { success: false, error: "Document type is required" }
  }
  if (!documentRef || typeof documentRef !== "string" || documentRef.trim() === "") {
    return { success: false, error: "Document number/reference is required" }
  }

  return {
    success: true,
    data: { email, displayName, password, documentType, documentRef },
  }
}

/**
 * Basic validator for complaint submission input
 */
export function validateComplaintInput(input: unknown): {
  success: boolean
  data?: ComplaintInput
  error?: string
} {
  if (!isInputRecord(input)) {
    return { success: false, error: "Invalid input shape" }
  }

  const { title, description, category, incidentDate, locationLat, locationLng, locationLabel } = input

  if (!title || typeof title !== "string" || title.trim().length < 5 || title.length > 150) {
    return { success: false, error: "Title must be between 5 and 150 characters" }
  }
  if (!description || typeof description !== "string" || description.trim().length < 10 || description.length > 2000) {
    return { success: false, error: "Description must be between 10 and 2000 characters" }
  }
  if (!category || typeof category !== "string") {
    return { success: false, error: "Category is required" }
  }
  if (typeof incidentDate !== "string" || isNaN(Date.parse(incidentDate))) {
    return { success: false, error: "Valid incident date is required" }
  }

  return {
    success: true,
    data: {
      title,
      description,
      category,
      incidentDate,
      locationLat: typeof locationLat === "number" ? locationLat : undefined,
      locationLng: typeof locationLng === "number" ? locationLng : undefined,
      locationLabel: typeof locationLabel === "string" ? locationLabel : undefined,
    },
  }
}
