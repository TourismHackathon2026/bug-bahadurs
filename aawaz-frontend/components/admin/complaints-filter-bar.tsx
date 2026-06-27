"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Funnel, MagnifyingGlass, X } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "INVESTIGATION", label: "Investigation" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const

export function AdmComplaintsFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get("status") ?? ""

  const navigate = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams)
      for (const [key, value] of Object.entries(params)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      next.delete("page")
      router.replace(`${pathname}?${next.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const handleApply = useCallback(() => {
    const form = document.getElementById("adm-complaint-filters") as HTMLFormElement
    if (!form) return
    const data = new FormData(form)
    const next = new URLSearchParams()
    const s = data.get("status") as string
    if (s && s !== "all") next.set("status", s)
    const search = data.get("search") as string
    if (search?.trim()) next.set("search", search.trim())
    router.replace(`${pathname}?${next.toString()}`)
  }, [router, pathname])

  const activeFilters: string[] = []
  if (status && status !== "all") {
    for (const s of status.split(",")) {
      const label = STATUS_OPTIONS.find((o) => o.value === s)?.label
      if (label) activeFilters.push(label)
    }
  }
  const searchTerm = searchParams.get("search") ?? ""
  if (searchTerm) activeFilters.push(`Search: "${searchTerm}"`)

  return (
    <div className="rounded-lg border border-border/70 bg-surface/90 p-3 shadow-sm backdrop-blur">
      <form
        id="adm-complaint-filters"
        className="grid gap-3 sm:grid-cols-[1fr_200px_auto]"
        onSubmit={(e) => { e.preventDefault(); handleApply() }}
      >
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            className="pl-9"
            placeholder="Search by title, reference..."
            defaultValue={searchTerm}
          />
        </div>

        <Select
          name="status"
          value={status}
          onValueChange={(val) => navigate({ status: val === "all" ? null : val })}
        >
          <SelectTrigger>
            <Funnel className="size-4 text-muted-foreground" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-surface-strong/30"
        >
          <Funnel size={16} />
          Apply
        </button>
      </form>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1 pr-1">
              {f}
              <button
                type="button"
                className="ml-0.5 rounded-sm p-0.5 hover:bg-surface-strong"
                onClick={() => navigate({ status: null, search: null })}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.replace(pathname)}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
