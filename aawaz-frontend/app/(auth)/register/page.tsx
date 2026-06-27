import type { Metadata } from "next"
import { RegistrationForm } from "@/components/auth/registration-form"

export const metadata: Metadata = {
  title: "Register | Awaaz",
  description: "Register as a tourist to file complaints.",
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <RegistrationForm />
    </main>
  )
}
