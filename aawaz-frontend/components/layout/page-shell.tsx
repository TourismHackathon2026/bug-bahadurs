import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageShellProps = {
  children: ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("min-h-[100dvh] bg-background px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </main>
  )
}

