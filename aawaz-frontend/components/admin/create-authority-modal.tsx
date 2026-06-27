"use client"

import { useState, useActionState } from "react"
import { Plus, X } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createAuthority } from "@/actions/admin.actions"
import { AUTHORITY_TYPE_LABELS } from "@/lib/constants"

export function CreateAuthorityModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await createAuthority(null, formData)
      if (result.success) {
        setOpen(false)
        router.refresh()
      }
      return result
    },
    { success: false },
  )

  const error = state.error && state.error !== "Validation failed." ? state.error : null
  const fields = state.fields ?? {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1.5" size={16} weight="bold" />
          Create Authority
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={action} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Authority Account</DialogTitle>
            <DialogDescription>
              Add a new department account. The authority will log in using their email and password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label htmlFor="displayName" className="mb-1 block text-xs font-medium text-foreground">
                Department Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="e.g. Kathmandu Metropolitan Police"
                required
              />
              {fields.displayName && (
                <p className="mt-1 text-xs text-destructive">{fields.displayName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dept@example.gov.np"
                required
              />
              {fields.email && (
                <p className="mt-1 text-xs text-destructive">{fields.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                required
              />
              {fields.password && (
                <p className="mt-1 text-xs text-destructive">{fields.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="authorityType" className="mb-1 block text-xs font-medium text-foreground">
                Department Type
              </label>
              <Select name="authorityType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUTHORITY_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fields.authorityType && (
                <p className="mt-1 text-xs text-destructive">{fields.authorityType}</p>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
