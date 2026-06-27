"use client"

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react"

import { ArrowLeft, ArrowRight, UploadSimple, UserPlus } from "@phosphor-icons/react"

import { registerTourist } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { uploadFiles } from "@/lib/uploadthing"

type RegistrationDraft = {
  displayName: string
  email: string
  password: string
  documentType: string
  documentRef: string
}

const initialDraft: RegistrationDraft = {
  displayName: "",
  email: "",
  password: "",
  documentType: "PASSPORT",
  documentRef: "",
}

function maskDocumentRef(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return "Not entered yet"
  if (trimmed.length <= 4) return `****${trimmed}`
  return `${"*".repeat(Math.max(trimmed.length - 4, 4))}${trimmed.slice(-4)}`
}

export function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<RegistrationDraft>(initialDraft)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const documentPreview = useMemo(() => maskDocumentRef(draft.documentRef), [draft.documentRef])

  const updateField =
    (field: keyof RegistrationDraft) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDraft((current) => ({ ...current, [field]: event.target.value }))
    }

  const handleNext = () => {
    setError(null)

    if (step === 1) {
      if (!draft.displayName.trim() || !draft.email.trim() || !draft.password.trim()) {
        setError("Fill in your name, email, and password to continue.")
        return
      }

      if (!draft.email.includes("@")) {
        setError("Enter a valid email address.")
        return
      }

      if (draft.password.length < 6) {
        setError("Password must be at least 6 characters long.")
        return
      }

      setStep(2)
      return
    }

    if (step === 2) {
      if (!draft.documentType.trim() || !draft.documentRef.trim()) {
        setError("Add your document type and document number to continue.")
        return
      }

      if (!documentFile) {
        setError("Upload a passport or identity document to continue.")
        return
      }

      setStep(3)
    }
  }

  const handlePrev = () => {
    setError(null)
    setStep((current) => Math.max(current - 1, 1))
  }

  const uploadDocument = async () => {
    if (!documentFile) {
      throw new Error("A document file is required.")
    }

    const response = await uploadFiles("documentUploader", {
      files: [documentFile],
    })

    if (!response || response.length === 0) {
      throw new Error("Document upload failed.")
    }

    return response[0].url
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step < 3) {
      handleNext()
      return
    }

    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.set("displayName", draft.displayName)
      formData.set("email", draft.email)
      formData.set("password", draft.password)
      formData.set("documentType", draft.documentType)
      formData.set("documentRef", draft.documentRef)

      const documentUrl = await uploadDocument()
      formData.set("documentUrl", documentUrl)

      const result = await registerTourist(formData)
      if (result.success) {
        setSuccess(true)
        return
      }

      setError(result.error || "Registration failed.")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Application Submitted</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Your tourist registration is pending approval. You will receive an email with your 8-digit Login ID and next steps once an administrator reviews it.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Step {step} of 3</p>

        <div className="mt-4 flex w-full max-w-xs justify-between gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="John Doe"
                value={draft.displayName}
                onChange={updateField("displayName")}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={draft.email}
                onChange={updateField("email")}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={draft.password}
                onChange={updateField("password")}
                required
                disabled={loading}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Identity Verification</h3>
            <div className="space-y-1.5">
              <label htmlFor="documentType" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={draft.documentType}
                onChange={updateField("documentType")}
                required
                disabled={loading}
              >
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National ID Card</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="documentRef" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Document Number
              </label>
              <Input
                id="documentRef"
                name="documentRef"
                type="text"
                placeholder="PP123456"
                value={draft.documentRef}
                onChange={updateField("documentRef")}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="documentFile" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Identity Document
              </label>
              <Input
                id="documentFile"
                name="documentFile"
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {documentFile ? documentFile.name : "Upload a passport scan, national ID, or a clear photo of the document."}
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Review & Submit</h3>
            <div className="space-y-3 rounded-md border border-border bg-surface p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Full name</span>
                <span className="text-right font-medium">{draft.displayName || "Not entered yet"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Email</span>
                <span className="text-right font-medium">{draft.email || "Not entered yet"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Document type</span>
                <span className="text-right font-medium">{draft.documentType}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Document number</span>
                <span className="text-right font-mono text-xs">{documentPreview}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">File</span>
                <span className="text-right font-medium">{documentFile?.name || "Not selected"}</span>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Please confirm your details before submitting your registration. By registering, you confirm the details provided are authentic.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={handlePrev} className="flex-1" disabled={loading}>
              <ArrowLeft className="mr-2" size={16} />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button type="submit" className="flex-1" disabled={loading}>
              Next
              <ArrowRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  Submit Registration
                  <UploadSimple className="ml-2" size={16} />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
