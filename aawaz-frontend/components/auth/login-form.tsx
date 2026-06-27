"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldCheck, SignIn } from "@phosphor-icons/react"
import { login } from "@/actions/auth.actions"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await login(formData)
      if (result && !result.success) {
        setError(result.error || "Failed to sign in")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border border-primary/20 bg-secondary text-primary">
          <ShieldCheck size={28} weight="fill" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Sign in to Awaaz</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your 8-digit Login ID and password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive font-medium border border-destructive/25 animate-in fade-in">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="loginId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Login ID
            </label>
            <Input
              id="loginId"
              name="loginId"
              type="text"
              placeholder="e.g. 12345678"
              required
              disabled={loading}
              pattern="[0-9]{8}"
              maxLength={8}
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
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            "Signing in..."
          ) : (
            <>
              <SignIn className="mr-2" size={18} weight="bold" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
