"use client"

import { useState } from "react"
import { WarningCircle } from "@phosphor-icons/react"
import { useSSE } from "@/hooks/useSSE"

type Props = {
  complaintId: string
  initialMessage?: string
}

export function EvidenceRequestedBanner({ complaintId, initialMessage }: Props) {
  const [message, setMessage] = useState(initialMessage ?? null)
  const sseState = useSSE()

  if (
    !message &&
    sseState.lastEvent?.type === "EVIDENCE_REQUESTED" &&
    typeof sseState.lastEvent.payload === "object" &&
    sseState.lastEvent.payload !== null &&
    "complaintId" in sseState.lastEvent.payload &&
    (sseState.lastEvent.payload as Record<string, unknown>).complaintId === complaintId
  ) {
    setMessage((sseState.lastEvent.payload as Record<string, string>).message ?? "Evidence has been requested")
  }

  if (!message) return null

  return (
    <div className="flex items-start gap-3 rounded-lg border border-yellow-300/40 bg-yellow-50 p-4">
      <WarningCircle size={20} className="mt-0.5 shrink-0 text-yellow-600" />
      <div>
        <p className="text-sm font-semibold text-yellow-800">Evidence Requested</p>
        <p className="mt-1 text-sm text-yellow-700">{message}</p>
        <p className="mt-1 text-xs text-yellow-600">
          Use the uploader below to submit the requested evidence.
        </p>
      </div>
    </div>
  )
}
