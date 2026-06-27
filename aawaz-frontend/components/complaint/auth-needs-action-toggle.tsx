"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Switch } from "@/components/ui/switch"

type Props = {
  checked: boolean
}

export function AuthNeedsActionToggle({ checked }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggle = useCallback(() => {
    const next = new URLSearchParams(searchParams)
    if (checked) {
      next.delete("needsAction")
    } else {
      next.set("needsAction", "1")
    }
    router.replace(`${pathname}?${next.toString()}`)
  }, [router, pathname, searchParams, checked])

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
      <Switch checked={checked} onCheckedChange={toggle} />
      Needs action
    </label>
  )
}
