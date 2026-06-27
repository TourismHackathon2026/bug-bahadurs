/**
 * Format date to standard user-facing format (e.g. 'Jan 15, 2026')
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return ""
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

/**
 * Format relative time (e.g. '2 hours ago', '3 days ago')
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return ""
  
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  
  if (diffSecs < 60) return "Just now"
  
  const diffMins = Math.floor(diffSecs / 60)
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  
  // Fall back to standard date if older
  return formatDate(d)
}

/**
 * Format complaint reference number
 */
export function formatReferenceNumber(refNo: string): string {
  return refNo.toUpperCase()
}

/**
 * Mask document number (e.g. passport or id number) to only show last 4 characters
 */
export function maskDocumentNumber(docNumber: string): string {
  if (!docNumber) return ""
  const cleaned = docNumber.trim()
  if (cleaned.length <= 4) return cleaned
  return `•••• ${cleaned.slice(-4)}`
}
