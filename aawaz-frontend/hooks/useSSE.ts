"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface SSEState {
  connected: boolean
  lastEvent: { type: string; payload: unknown } | null
}

export function useSSE(): SSEState {
  const [state, setState] = useState<SSEState>({
    connected: false,
    lastEvent: null,
  })
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) return

    const es = new EventSource("/api/sse")
    eventSourceRef.current = es

    es.addEventListener("connected", () => {
      setState((prev) => ({ ...prev, connected: true }))
    })

    es.onopen = () => {
      setState((prev) => ({ ...prev, connected: true }))
    }

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        setState((prev) => ({ ...prev, lastEvent: { type: event.type || "message", payload } }))
      } catch {
        // ignore parse errors
      }
    }

    es.addEventListener("NEW_NOTIFICATION", (event) => {
      try {
        const payload = JSON.parse(event.data)
        setState((prev) => ({ ...prev, lastEvent: { type: "NEW_NOTIFICATION", payload } }))
      } catch {
        // ignore
      }
    })

    es.onerror = () => {
      setState((prev) => ({ ...prev, connected: false }))
      es.close()
      eventSourceRef.current = null

      reconnectRef.current = setTimeout(connect, 5000)
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      eventSourceRef.current?.close()
      eventSourceRef.current = null
    }
  }, [connect])

  return state
}
