"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { approveRegistration, rejectRegistration } from "@/actions/admin.actions"
import { FileText, Check, X, Warning } from "@phosphor-icons/react"

export interface PendingRegistration {
  id: string
  displayName: string
  email: string
  documentType: string
  documentRef: string
  documentUrl: string
  createdAt: Date
}

interface RegistrationsClientProps {
  initialRegistrations: PendingRegistration[]
}

export function RegistrationsClient({ initialRegistrations }: RegistrationsClientProps) {
  const [selectedReg, setSelectedReg] = useState<PendingRegistration | null>(null)
  const [rejectingReg, setRejectingReg] = useState<PendingRegistration | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [loading, setLoading] = useState<string | null>(null) // holds action type (e.g. 'approve-id' or 'reject-id')

  const handleApprove = async (reg: PendingRegistration) => {
    setLoading(`approve-${reg.id}`)
    try {
      const res = await approveRegistration(reg.id)
      if (res.success) {
        toast.success(`Approved registration for ${reg.displayName}. Credentials printed in server console.`)
        setSelectedReg(null)
      } else {
        toast.error(res.error ?? "Failed to approve registration.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectingReg) return
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.")
      return
    }

    setLoading(`reject-${rejectingReg.id}`)
    try {
      const res = await rejectRegistration(rejectingReg.id, rejectionReason)
      if (res.success) {
        toast.success(`Rejected registration for ${rejectingReg.displayName}.`)
        setRejectingReg(null)
        setRejectionReason("")
      } else {
        toast.error(res.error ?? "Failed to reject registration.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Document Type</th>
                <th className="px-6 py-3">Document Number</th>
                <th className="px-6 py-3">Submission Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialRegistrations.length > 0 ? (
                initialRegistrations.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-strong/30">
                    <td className="px-6 py-4 font-medium">{item.displayName}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{item.documentType}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{item.documentRef}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReg(item)}
                      >
                        <FileText className="mr-1 size-3.5" />
                        Review
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectingReg(item)}
                      >
                        <X className="mr-1 size-3.5" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item)}
                        disabled={loading !== null}
                      >
                        <Check className="mr-1 size-3.5" />
                        {loading === `approve-${item.id}` ? "Approving..." : "Approve"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No pending registration applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={selectedReg !== null} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Registration</DialogTitle>
            <DialogDescription>
              Verify document details for the tourist.
            </DialogDescription>
          </DialogHeader>

          {selectedReg && (
            <div className="space-y-4 py-2 text-sm text-foreground">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground text-xs">Name:</span>
                <span className="col-span-2 font-medium">{selectedReg.displayName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground text-xs">Email:</span>
                <span className="col-span-2">{selectedReg.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground text-xs">Doc Type:</span>
                <span className="col-span-2">{selectedReg.documentType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground text-xs">Doc Ref:</span>
                <span className="col-span-2 font-mono">{selectedReg.documentRef}</span>
              </div>
              {selectedReg.documentUrl && (
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={selectedReg.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-primary hover:underline gap-1"
                  >
                    <FileText size={16} />
                    View Uploaded ID Document (new tab)
                  </a>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-between flex-row gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedReg(null)}
            >
              Cancel
            </Button>
            {selectedReg && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setRejectingReg(selectedReg)
                    setSelectedReg(null)
                  }}
                >
                  <X className="mr-1 size-3.5" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(selectedReg)}
                  disabled={loading !== null}
                >
                  <Check className="mr-1 size-3.5" />
                  {loading === `approve-${selectedReg?.id}` ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Modal */}
      <Dialog open={rejectingReg !== null} onOpenChange={(open) => !open && setRejectingReg(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-destructive">
              <Warning className="size-4" />
              Reject Registration
            </DialogTitle>
            <DialogDescription>
              Please enter the reason for rejecting {rejectingReg?.displayName}&apos;s registration.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Reason for Rejection
            </label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. The uploaded document is blurry / mismatched name."
              className="w-full text-xs"
              rows={3}
            />
          </div>

          <DialogFooter className="sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectingReg(null)
                setRejectionReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReject}
              disabled={loading !== null || !rejectionReason.trim()}
            >
              <X className="mr-1 size-3.5" />
              {loading === `reject-${rejectingReg?.id}` ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
