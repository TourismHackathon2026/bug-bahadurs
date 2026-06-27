"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Robot } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COMPLAINT_CATEGORY_LABELS, PRIORITY_LABELS, type ComplaintCategory, type Priority } from "@/lib/constants"
import { overrideCategorizationAction } from "@/actions/complaint.actions"

type Props = {
  complaintId: string
  currentCategory: string
  currentPriority: string
}

export function AiOverrideModal({ complaintId, currentCategory, currentPriority }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const category = formData.get("category") as string
      const priority = formData.get("priority") as string
      if (!category || !priority) return { success: false, error: "Both category and priority are required." }
      const result = await overrideCategorizationAction(complaintId, category as ComplaintCategory, priority as Priority)
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
        <Button variant="ghost" size="sm" className="w-full">
          <Robot className="mr-1.5" size={16} />
          Override AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Override AI Categorization</DialogTitle>
            <DialogDescription>
              Manually set the category and priority. This will replace the AI&apos;s suggestion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Category</label>
              <Select name="category" defaultValue={currentCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMPLAINT_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Priority</label>
              <Select name="priority" defaultValue={currentPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {state.error && (
            <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">{state.error}</p>
          )}

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Override"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
