"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { resolveComplaint } from "@/actions/complaint.actions"

type Props = {
  complaintId: string
}

export function ResolveModal({ complaintId }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const summary = formData.get("summary") as string
      if (!summary?.trim()) return { success: false, error: "Resolution summary is required." }
      const result = await resolveComplaint(complaintId, summary.trim())
      if (result.success) {
        setOpen(false)
        router.refresh()
      }
      return result
    },
    { success: false },
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <CheckCircle className="mr-1.5" size={16} />
          Resolve Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Resolve Complaint</DialogTitle>
            <DialogDescription>
              Provide a resolution summary describing how this complaint was addressed. This will be shared with the complainant.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            name="summary"
            rows={4}
            placeholder="e.g. The complaint was investigated and the issue has been resolved. The concerned authority has taken necessary action..."
            required
          />

          {state.error && (
            <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending} variant="default">
              {pending ? "Resolving..." : "Confirm Resolution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
