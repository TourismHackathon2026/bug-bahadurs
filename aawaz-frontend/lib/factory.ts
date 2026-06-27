// ★ Factory pattern — reference number and login ID generation
import crypto from "crypto"

/**
 * Generate a unique public reference number for complaints: "AWAAZ-{year}-{5-digit-random}"
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear()
  
  // Safe CSPRNG random generation if crypto is available (Node.js/Next server context)
  let rand = ""
  try {
    const val = crypto.randomInt(10000, 99999)
    rand = val.toString()
  } catch (e) {
    // Fallback if running client-side (though this should only run on server)
    rand = Math.floor(10000 + Math.random() * 90000).toString()
  }
  
  return `AWAAZ-${year}-${rand}`
}

/**
 * Generate an 8-digit numeric string CSPRNG Login ID for users
 */
export function generateLoginId(): string {
  let loginId = ""
  try {
    const val = crypto.randomInt(10000000, 99999999)
    loginId = val.toString()
  } catch (e) {
    // Fallback if running client-side
    loginId = Math.floor(10000000 + Math.random() * 90000000).toString()
  }
  return loginId
}
