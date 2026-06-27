// ★ Observer pattern — lightweight in-process event bus for SSE
// Works for single-instance deploy. For multi-instance, replace with Redis pub/sub.

export interface SSEEvent {
  type: string
  payload: unknown
  timestamp: string
}

type SSECallback = (event: SSEEvent) => void

class SSEEmitter {
  private listeners = new Map<string, Set<SSECallback>>()

  /**
   * Subscribe to events for a specific user.
   * Returns an unsubscribe function.
   */
  subscribe(userId: string, callback: SSECallback): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set())
    }
    
    const userListeners = this.listeners.get(userId)!
    userListeners.add(callback)
    
    console.log(`[SSE:Emitter] Subscribed listener for user ${userId}. Total: ${userListeners.size}`)
    
    return () => {
      userListeners.delete(callback)
      if (userListeners.size === 0) {
        this.listeners.delete(userId)
      }
      console.log(`[SSE:Emitter] Unsubscribed listener for user ${userId}. Total active: ${userListeners.size}`)
    }
  }

  /**
   * Emit an event to all active SSE streams connected for a user
   */
  emit(userId: string, type: string, payload: unknown): void {
    const userListeners = this.listeners.get(userId)
    if (!userListeners || userListeners.size === 0) {
      console.log(`[SSE:Emitter] No active listeners for user ${userId}. Dropping event ${type}.`)
      return
    }

    const event: SSEEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    }

    console.log(`[SSE:Emitter] Emitting event ${type} to ${userListeners.size} listeners for user ${userId}`)
    
    // Distribute event to all active connections
    userListeners.forEach((callback) => {
      try {
        callback(event)
      } catch (err) {
        console.error(`[SSE:Emitter] Error delivering event to listener for user ${userId}`, err)
      }
    })
  }

  /**
   * Get active connection count for a user
   */
  getConnectionCount(userId: string): number {
    return this.listeners.get(userId)?.size || 0
  }
}

// Global emitter instance held in module scope
export const sseEmitter = new SSEEmitter()
