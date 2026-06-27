"use client"

/**
 * Hook to check feature flag state in Client Components.
 * Gated by NEXT_PUBLIC_FF_* variables.
 */
export function useFeatureFlag(flag: "MAP_PIN" | "AI_CATEGORIZATION" | "TRANSLATION" | "HEATMAP"): boolean {
  const envKey = `NEXT_PUBLIC_FF_${flag}`
  
  // process.env is populated by Next.js at build time
  const val = process.env[envKey] || process.env[`NEXT_PUBLIC_${flag}`]
  
  return val === "true"
}
