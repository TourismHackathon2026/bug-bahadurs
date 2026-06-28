"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { PRIORITY_LABELS } from "@/lib/constants"

interface ComplaintAiBadgeProps {
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

export function ComplaintAiBadge({
  initialAiCategory,
  initialAiConfidence,
  initialPriority,
}: ComplaintAiBadgeProps) {
  const aiState: AiResponse = {
    aiCategory: initialAiCategory,
    aiConfidence: initialAiConfidence,
    priority: initialPriority,
    assignedAuthorityType: null,
  }

  const badgeText = useMemo(() => {
    if (!aiState.aiCategory) {
      return "Generating..."
    }

    const categoryLabel = aiState.aiCategory
    const confidenceText = aiState.aiConfidence != null ? `· ${aiState.aiConfidence}%` : ""
    const priorityText = aiState.priority && aiState.priority !== initialPriority ? `· ${PRIORITY_LABELS[aiState.priority as keyof typeof PRIORITY_LABELS]}` : ""

    return `AI: ${categoryLabel} ${confidenceText} ${priorityText}`.trim()
  }, [aiState.aiCategory, aiState.aiConfidence, aiState.priority, initialPriority])

  return (
    <div className="flex items-center gap-2">
      <Badge variant={aiState.aiCategory ? "default" : "secondary"}>
        {badgeText}
      </Badge>
    </div>
  )
}
