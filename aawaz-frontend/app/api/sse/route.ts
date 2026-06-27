import { NextRequest } from "next/server"
import { sseEmitter } from "@/lib/sse-emitter"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }

  const session = await verifySessionToken(token)
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const userId = session.userId

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const sendEvent = (eventType: string, data: unknown) => {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
        try {
          controller.enqueue(encoder.encode(message))
        } catch {
          // stream closed
        }
      }

      sendEvent("connected", { userId })

      const unsubscribe = sseEmitter.subscribe(userId, (event) => {
        sendEvent(event.type, event.payload)
      })

      const keepalive = setInterval(() => {
        sendEvent("keepalive", { t: Date.now() })
      }, 30_000)

      req.signal.addEventListener("abort", () => {
        clearInterval(keepalive)
        unsubscribe()
      })
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
