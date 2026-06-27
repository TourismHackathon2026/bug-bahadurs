"use client"

import { useEffect, useState } from "react"

/**
 * Hook to check feature flag state in Client Components.
 * Gated by NEXT_PUBLIC_FF_* variables.
 */
export function useFeatureFlag(flag: "MAP_PIN" | "AI_CATEGORIZATION" | "TRANSLATION" | "HEATMAP"): boolean {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const envKey = `NEXT_PUBLIC_FF_${flag}`
    const val = process.env[envKey] || process.env[`NEXT_PUBLIC_${flag}`]
    setIsEnabled(val === "true")
  }, [flag])

  return isEnabled
}
