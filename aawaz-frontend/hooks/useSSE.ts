"use client"

import { useEffect, useState } from "react"

export interface SSEState {
  connected: boolean
  lastEvent: { type: string; payload: unknown } | null
}

/**
 * Hook to manage connection to the SSE route and handle real-time notifications
 */
export function useSSE(): SSEState {
  const [state, setState] = useState<SSEState>({
    connected: false,
    lastEvent: null,
  })

  useEffect(() => {
    console.log("[Hook:useSSE] Initializing Server-Sent Events client - stub")
    // Real implementation will open EventSource("/api/sse")
    
    return () => {
      console.log("[Hook:useSSE] Cleaning up SSE connection")
    }
  }, [])

  return state
}
