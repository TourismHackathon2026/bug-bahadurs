import crypto from "crypto"
import { promisify } from "util"

const pbkdf2Async = promisify(crypto.pbkdf2)

const ITERATIONS = 120_000
const KEY_LENGTH = 64
const DIGEST = "sha512"

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const derived = (await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)) as Buffer
  return `pbkdf2$${DIGEST}$${ITERATIONS}$${salt}$${derived.toString("hex")}`
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split("$")
  if (parts.length !== 5 || parts[0] !== "pbkdf2") {
    return false
  }

  const [, digest, iterationsRaw, salt, expected] = parts
  const iterations = Number(iterationsRaw)

  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false
  }

  const derived = (await pbkdf2Async(password, salt, iterations, expected.length / 2, digest)) as Buffer
  const expectedBuffer = Buffer.from(expected, "hex")

  if (derived.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(derived, expectedBuffer)
}
