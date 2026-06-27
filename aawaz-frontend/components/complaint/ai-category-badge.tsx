"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AUTHORITY_TYPE_LABELS, COMPLAINT_CATEGORY_LABELS, COMPLAINT_CATEGORY_LABELS as categoryLabels, PRIORITY_LABELS } from "@/lib/constants"

interface ComplaintAiBadgeProps {
  complaintId: string
  initialAiCategory: string | null
  initialAiConfidence: number | null
  initialPriority: string
}

interface AiResponse {
  aiCategory: string | null
  aiConfidence: number | null
  priority: string | null
  assignedAuthorityType?: string | null
}

interface AiErrorResponse {
  error: string
}

type AiApiResponse = AiResponse | AiErrorResponse

const POLL_INTERVAL = 3000

export function ComplaintAiBadge({
  complaintId,
  initialAiCategory,
  initialAiConfidence,
  initialPriority,
}: ComplaintAiBadgeProps) {
  const [aiState, setAiState] = useState<AiResponse>({
    aiCategory: initialAiCategory,
    aiConfidence: initialAiConfidence,
    priority: initialPriority,
    assignedAuthorityType: null,
  })
  const [error, setError] = useState<string | null>(null)

  const badgeText = useMemo(() => {
    if (!aiState.aiCategory) {
      return "AI categorizing…"
    }

    const categoryLabel = categoryLabels[aiState.aiCategory as keyof typeof COMPLAINT_CATEGORY_LABELS]
    const confidenceText = aiState.aiConfidence != null ? `· ${aiState.aiConfidence}%` : ""
    const priorityText = aiState.priority && aiState.priority !== initialPriority ? `· ${PRIORITY_LABELS[aiState.priority as keyof typeof PRIORITY_LABELS]}` : ""
    const authorityLabel = aiState.assignedAuthorityType ? AUTHORITY_TYPE_LABELS[aiState.assignedAuthorityType as keyof typeof AUTHORITY_TYPE_LABELS] : null
    const authorityText = authorityLabel ? `· ${authorityLabel}` : ""

    return `AI: ${categoryLabel} ${confidenceText} ${priorityText} ${authorityText}`.trim()
  }, [aiState.aiCategory, aiState.aiConfidence, aiState.assignedAuthorityType, aiState.priority, initialPriority])

  useEffect(() => {
    let active = true
    let timeoutId: ReturnType<typeof setTimeout>

    async function fetchAiStatus() {
      try {
        const response = await fetch(`/api/complaints/${complaintId}?_=${Date.now()}`, {
          credentials: "include",
          cache: "no-store",
        })
        const bodyText = await response.text()

        if (!response.ok) {
          console.error("[ComplaintAiBadge] API returned error", response.status, bodyText)
          const message = bodyText ? bodyText : `Failed to fetch AI state: ${response.status}`
          throw new Error(message)
        }

        const json = JSON.parse(bodyText) as AiApiResponse
        if (!active) return

        if ("error" in json) {
          console.error("[ComplaintAiBadge] API returned error payload", json)
          throw new Error(json.error || "Unknown API error")
        }

        setAiState({
          aiCategory: json.aiCategory,
          aiConfidence: json.aiConfidence,
          priority: json.priority ?? initialPriority,
          assignedAuthorityType: json.assignedAuthorityType ?? null,
        })
        setError(null)

        if (!json.aiCategory) {
          timeoutId = setTimeout(fetchAiStatus, POLL_INTERVAL)
        }
      } catch (err) {
        if (!active) return
        console.error("[ComplaintAiBadge] fetchAiStatus failed", err)
        setError("Unable to refresh AI status.")
        timeoutId = setTimeout(fetchAiStatus, POLL_INTERVAL * 2)
      }
    }

    if (!aiState.aiCategory) {
      fetchAiStatus()
    }

    return () => {
      active = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [complaintId, aiState.aiCategory, initialPriority])

  return (
    <div className="flex items-center gap-2">
      <Badge variant={aiState.aiCategory ? "default" : "secondary"}>
        {badgeText}
      </Badge>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  )
}
