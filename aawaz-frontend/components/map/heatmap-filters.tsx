"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Funnel, X } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COMPLAINT_CATEGORY_LABELS } from "@/lib/constants"

const CATEGORIES = Object.entries(COMPLAINT_CATEGORY_LABELS)

export function HeatmapFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams)
      for (const [key, value] of Object.entries(params)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      router.replace(`${pathname}?${next.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const category = searchParams.get("category") ?? ""

  const handleApply = useCallback(() => {
    const form = document.getElementById("heatmap-filters") as HTMLFormElement
    if (!form) return
    const data = new FormData(form)
    const next = new URLSearchParams()

    const cat = data.get("category") as string
    if (cat && cat !== "all") next.set("category", cat)

    const from = data.get("from") as string
    if (from) next.set("from", from)

    const to = data.get("to") as string
    if (to) next.set("to", to)

    router.replace(`${pathname}?${next.toString()}`)
  }, [router, pathname])

  const activeFilters: string[] = []
  if (category) {
    for (const c of category.split(",")) {
      const label = COMPLAINT_CATEGORY_LABELS[c as keyof typeof COMPLAINT_CATEGORY_LABELS]
      if (label) activeFilters.push(label)
    }
  }
  const fromVal = searchParams.get("from") ?? ""
  const toVal = searchParams.get("to") ?? ""
  if (fromVal) activeFilters.push(`From: ${fromVal}`)
  if (toVal) activeFilters.push(`To: ${toVal}`)

  return (
    <div className="rounded-lg border border-border/70 bg-surface/90 p-3 shadow-sm backdrop-blur">
      <form
        id="heatmap-filters"
        className="grid gap-3 sm:grid-cols-[200px_160px_160px_auto]"
        onSubmit={(e) => { e.preventDefault(); handleApply() }}
      >
        <Select
          name="category"
          value={category}
          onValueChange={(val) => navigate({ category: val === "all" ? null : val })}
        >
          <SelectTrigger>
            <Funnel className="size-4 text-muted-foreground" />
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input name="from" type="date" defaultValue={fromVal} placeholder="From date" />

        <Input name="to" type="date" defaultValue={toVal} placeholder="To date" />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-surface-strong/30"
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
                onClick={() => router.replace(pathname)}
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
