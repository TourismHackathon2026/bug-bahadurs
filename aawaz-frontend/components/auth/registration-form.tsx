"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, ArrowRight, ArrowLeft } from "@phosphor-icons/react"
import { registerTourist } from "@/actions/auth.actions"

export function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < 3) {
      handleNext()
      return
    }

    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await registerTourist(formData)
      if (result && result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm text-center">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Application Submitted</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Your tourist registration is pending approval. You will receive an email with your 8-digit Login ID and instructions once approved by an administrator.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Step {step} of 3</p>
        
        {/* Step indicators */}
        <div className="mt-4 flex w-full max-w-xs justify-between gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/25">
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
              <Input id="displayName" name="displayName" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
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
                required
              >
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National ID Card</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="documentRef" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Document Number
              </label>
              <Input id="documentRef" name="documentRef" type="text" placeholder="e.g. PP123456" required />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Review & Submit</h3>
            <p className="text-xs text-muted-foreground">
              Please confirm your details before submitting your registration. By registering, you confirm the details provided are authentic.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={handlePrev} className="flex-1">
              <ArrowLeft className="mr-2" size={16} />
              Back
            </Button>
          )}
          
          <Button type="submit" className="flex-grow" disabled={loading}>
            {step < 3 ? (
              <>
                Next
                <ArrowRight className="ml-2" size={16} />
              </>
            ) : loading ? (
              "Submitting..."
            ) : (
              <>
                Submit Registration
                <UserPlus className="ml-2" size={16} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
