import { NextRequest } from "next/server";
import { getComplaintById } from "@/server/complaints";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token";

async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log("[API:complaints/:id] GET request for complaint id:", id);

  const session = await getSessionFromRequest(req);
  if (!session) {
    console.warn("[API:complaints/:id] Unauthorized - no session");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const complaint = await getComplaintById(id);
  console.log(
    "[API:complaints/:id] complaint from DB:",
    complaint?.id,
    "aiCategory:",
    complaint?.aiCategory,
    "priority:",
    complaint?.priority,
  );

  if (!complaint || complaint.touristId !== session.userId) {
    console.warn(
      "[API:complaints/:id] Not found or unauthorized access - complaint:",
      complaint?.id,
      "session user:",
      session.userId,
    );
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const assignedAuthorityType =
    complaint.assignedTo?.authorityProfile?.authorityType ?? null;

  const response = {
    aiCategory: complaint.aiCategory,
    aiConfidence: complaint.aiConfidence,
    priority: complaint.priority,
    assignedAuthorityType,
  };
  console.log("[API:complaints/:id] returning response:", response);

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
