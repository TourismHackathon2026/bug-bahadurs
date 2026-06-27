// AI service — feature-flagged via FF_AI_CATEGORIZATION and FF_TRANSLATION
import { ComplaintCategory } from "@/lib/constants"

/**
 * Strips PII and enqueues/categorizes a complaint using structured AI responses
 */
export async function categorizeComplaint(
  id: string,
  description: string
): Promise<{ category: ComplaintCategory; confidence: number; priority: string } | null> {
  console.log(`[Service:AI] categorizeComplaint for ${id} - not implemented`)
  return null
}

/**
 * Detect language of complaint text
 */
export async function detectLanguage(text: string): Promise<string> {
  console.log(`[Service:AI] detectLanguage - not implemented`)
  return "en"
}

/**
 * Translate description to English/Nepali
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  console.log(`[Service:AI] translateText to ${targetLang} - not implemented`)
  return text
}
