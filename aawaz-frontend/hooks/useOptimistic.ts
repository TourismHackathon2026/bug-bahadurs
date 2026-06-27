"use client"

import { useOptimistic as reactUseOptimistic } from "react"

/**
 * Custom wrapper around React 19's useOptimistic hook.
 * Fallback to useState can be added if needed, but since React 19 is standard here,
 * we utilize the native hook directly.
 */
export function useOptimistic<State, Action>(
  passthrough: State,
  reducer: (state: State, action: Action) => State
) {
  return reactUseOptimistic(passthrough, reducer)
}
