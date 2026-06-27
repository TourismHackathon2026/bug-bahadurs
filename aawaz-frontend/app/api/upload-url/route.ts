import crypto from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const pendingUploads = new Map<string, { storageKey: string; expiresAt: number }>()
const UPLOAD_TTL_MS = 15 * 60 * 1000
const STORAGE_DIR = path.join(process.cwd(), ".data", "uploads")

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

function createStorageKey(filename: string): string {
  const safeName = sanitizeFilename(filename) || "upload"
  return `documents/${crypto.randomUUID()}-${safeName}`
}

function createUploadToken(): string {
  return crypto.randomUUID().replace(/-/g, "")
}

function pruneExpiredUploads(now = Date.now()): void {
  for (const [token, entry] of pendingUploads.entries()) {
    if (entry.expiresAt <= now) {
      pendingUploads.delete(token)
    }
  }
}

async function handleCreateUploadUrl(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const filename = typeof body?.filename === "string" ? body.filename : ""
  const contentType = typeof body?.contentType === "string" ? body.contentType : ""

  if (!filename || !contentType) {
    return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 })
  }

  pruneExpiredUploads()

  const token = createUploadToken()
  const storageKey = createStorageKey(filename)

  pendingUploads.set(token, {
    storageKey,
    expiresAt: Date.now() + UPLOAD_TTL_MS,
  })

  const uploadUrl = new URL(request.url)
  uploadUrl.searchParams.set("token", token)

  return NextResponse.json({
    uploadUrl: uploadUrl.toString(),
    storageKey,
  })
}

async function handleUpload(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Missing upload token" }, { status: 400 })
  }

  pruneExpiredUploads()

  const entry = pendingUploads.get(token)
  if (!entry) {
    return NextResponse.json({ error: "Upload token expired or invalid" }, { status: 403 })
  }

  const bytes = Buffer.from(await request.arrayBuffer())
  const contentType = request.headers.get("content-type") ?? "application/octet-stream"

  await mkdir(STORAGE_DIR, { recursive: true })
  await writeFile(path.join(STORAGE_DIR, entry.storageKey), bytes)

  pendingUploads.delete(token)

  return NextResponse.json({
    storageKey: entry.storageKey,
    sizeBytes: bytes.length,
    contentType,
  })
}

export async function POST(request: NextRequest) {
  return handleCreateUploadUrl(request)
}

export async function PUT(request: NextRequest) {
  return handleUpload(request)
}
