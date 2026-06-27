"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

type ConfirmEvidenceAction = (
  complaintId: string,
  storageKey: string,
  mimeType: string,
  sizeBytes: number
) => Promise<{ success: boolean; error?: string }>

interface ComplaintEvidenceUploaderProps {
  complaintId: string
  confirmEvidenceAction: ConfirmEvidenceAction
}

export function ComplaintEvidenceUploader({
  complaintId,
  confirmEvidenceAction,
}: ComplaintEvidenceUploaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadComplete = async (
    files: Array<{
      url: string
      name: string
      type: string
      size: number
      serverData?: { fileUrl?: string }
    }>
  ) => {
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      await Promise.all(
        files.map(async (file) => {
          const fileUrl = file.serverData?.fileUrl || file.url
          const result = await confirmEvidenceAction(
            complaintId,
            fileUrl,
            file.type,
            file.size
          )

          if (!result.success) {
            throw new Error(result.error || "Failed to attach evidence.")
          }
        })
      )

      toast.success("Evidence attached successfully.")
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Unable to attach evidence.")
      toast.error(err?.message || "Unable to attach evidence.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <UploadIcon size={14} />
          Add Evidence
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add evidence to complaint</DialogTitle>
          <DialogDescription>
            Upload images, videos, or PDF files so the authority can review supporting documentation.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="mt-4">
          <UploadDropzone
            endpoint="evidenceUploader"
            onUploadComplete={handleUploadComplete}
            disabled={isUploading}
            className="border-2 border-dashed border-border rounded-lg p-6"
          >
            <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
              <UploadIcon size={24} />
              <div>
                <p className="font-medium">Drag & drop evidence files</p>
                <p className="text-sm">or click to browse</p>
              </div>
              <p className="text-xs">JPEG, PNG, MP4, PDF up to 128MB</p>
            </div>
          </UploadDropzone>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
