"use client"

import { useActionState } from "react"

import { SignIn, ShieldCheck } from "@phosphor-icons/react"

import { login } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AuthActionState = {
  success: boolean
  error?: string
}

const initialState: AuthActionState = {
  success: false,
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_state: AuthActionState, formData: FormData) => login(formData),
    initialState
  )

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

      <form action={formAction} className="mt-8 space-y-6">
        {state.error && (
          <div className="rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm font-medium text-destructive animate-in fade-in">
            {state.error}
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
              inputMode="numeric"
              placeholder="12345678"
              required
              disabled={pending}
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
              placeholder="********"
              required
              disabled={pending}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
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
