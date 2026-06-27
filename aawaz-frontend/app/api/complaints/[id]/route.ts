import { NextRequest } from "next/server"
import { getComplaintById } from "@/server/complaints"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token"

async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const complaint = await getComplaintById(params.id)
  if (!complaint || complaint.touristId !== session.userId) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
  }

  const assignedAuthorityType = complaint.assignedTo?.authorityProfile?.authorityType ?? null

  return new Response(
    JSON.stringify({
      aiCategory: complaint.aiCategory,
      aiConfidence: complaint.aiConfidence,
      priority: complaint.priority,
      assignedAuthorityType,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  )
}
