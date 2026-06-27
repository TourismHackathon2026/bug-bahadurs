"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Pencil } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { updateAuthority } from "@/actions/admin.actions"

type Props = {
  id: string
  displayName: string
  email: string
}

export function EditAuthorityModal({ id, displayName, email }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("id", id)
      const result = await updateAuthority(null, formData)
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
        <Button variant="ghost" size="sm">
          <Pencil className="mr-1.5 size-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Authority</DialogTitle>
            <DialogDescription>Update the department name or email address.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label htmlFor="edit-name" className="mb-1 block text-xs font-medium text-foreground">
                Department Name
              </label>
              <Input id="edit-name" name="displayName" defaultValue={displayName} required />
            </div>
            <div>
              <label htmlFor="edit-email" className="mb-1 block text-xs font-medium text-foreground">
                Email Address
              </label>
              <Input id="edit-email" name="email" type="email" defaultValue={email} required />
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
              {pending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
