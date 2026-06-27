"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "@phosphor-icons/react"
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
import { requestEvidenceAction } from "@/actions/complaint.actions"

type Props = {
  complaintId: string
}

export function RequestEvidenceModal({ complaintId }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const message = formData.get("message") as string
      if (!message?.trim()) return { success: false, error: "Message is required." }
      const result = await requestEvidenceAction(complaintId, message.trim())
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
        <Button variant="outline" size="sm" className="w-full">
          <Upload className="mr-1.5" size={16} />
          Request Evidence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Request Additional Evidence</DialogTitle>
            <DialogDescription>
              Describe what evidence you need from the complainant. They will receive a notification.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            name="message"
            rows={4}
            placeholder="e.g. Please upload a clearer photo of the incident and any witness statements..."
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
            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
