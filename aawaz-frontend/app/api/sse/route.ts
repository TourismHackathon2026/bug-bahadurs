import { NextRequest } from "next/server"

/**
 * GET /api/sse
 * Establishes a Server-Sent Events stream for the client.
 * Auth cookie is read implicitly from headers.
 */
export async function GET(req: NextRequest) {
  console.log("[API:SSE] Client connecting to SSE endpoint")
  
  // Return a 501 Not Implemented response for now.
  // In Phase 4, this returns a text/event-stream ReadableStream.
  return new Response("SSE endpoint - not yet implemented", {
    status: 501,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
