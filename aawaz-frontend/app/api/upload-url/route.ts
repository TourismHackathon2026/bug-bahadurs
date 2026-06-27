import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/upload-url
 * Generates a signed PUT URL for direct uploads to object storage.
 */
export async function POST(req: NextRequest) {
  console.log("[API:UploadUrl] POST request received")
  
  return NextResponse.json(
    { error: "Not yet implemented" },
    { status: 501 }
  )
}
