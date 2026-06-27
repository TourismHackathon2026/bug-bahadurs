/**
 * Hook to check feature flag state in Client Components.
 * Gated by NEXT_PUBLIC_FF_* variables.
 *
 * Must use static references to NEXT_PUBLIC_* env vars so Next.js can
 * inline them at build time (dynamic keys like process.env[key] are not replaced).
 */
export function useFeatureFlag(flag: "MAP_PIN" | "AI_CATEGORIZATION" | "TRANSLATION" | "HEATMAP"): boolean {
  switch (flag) {
    case "MAP_PIN":
      return process.env.NEXT_PUBLIC_FF_MAP_PIN === "true"
    case "AI_CATEGORIZATION":
      return process.env.NEXT_PUBLIC_FF_AI_CATEGORIZATION === "true"
    case "TRANSLATION":
      return process.env.NEXT_PUBLIC_FF_TRANSLATION === "true"
    case "HEATMAP":
      return process.env.NEXT_PUBLIC_FF_HEATMAP === "true"
    default:
      return false
  }
}
