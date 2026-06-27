"use client"

import { useActionState } from "react"
import { escalateComplaintAction } from "@/actions/admin.actions"

type Props = {
  complaintId: string
}

export function EscalateButton({ complaintId }: Props) {
  const [state, action, pending] = useActionState(
    async () => escalateComplaintAction(complaintId),
    { success: false },
  )

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending || state.success}
        className="rounded-md border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        {pending ? "..." : state.success ? "Escalated" : "Escalate"}
      </button>
    </form>
  )
}
