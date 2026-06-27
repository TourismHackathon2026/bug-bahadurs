import { randomInt } from "crypto"

export function generateReferenceNumber(): string {
  const year = new Date().getFullYear()
  const suffix = randomInt(0, 100000).toString().padStart(5, "0")

  return `AWAAZ-${year}-${suffix}`
}

export function generateLoginId(): string {
  return randomInt(10000000, 100000000).toString()
}
