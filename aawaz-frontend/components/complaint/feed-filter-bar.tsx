"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { CalendarBlank, Funnel, MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "INVESTIGATION", label: "Investigation" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const

function activeFiltersFromParams(params: URLSearchParams): string[] {
  const tags: string[] = []
  const status = params.get("status")
  if (status) {
    for (const s of status.split(",")) {
      const label = STATUS_OPTIONS.find((o) => o.value === s)?.label
      if (label) tags.push(label)
    }
  }
  const priority = params.get("priority")
  if (priority) {
    const label = PRIORITY_OPTIONS.find((o) => o.value === priority)?.label
    if (label) tags.push(label)
  }
  const search = params.get("search")
  if (search) tags.push(`Search: "${search}"`)
  return tags
}

export function FeedFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeFilters = activeFiltersFromParams(searchParams)

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.delete("page")
      router.replace(`${pathname}?${next.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const removeFilter = useCallback(
    (type: "status" | "priority" | "search") => {
      setParam(type, null)
    },
    [setParam],
  )

  const clearFilters = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  const handleApply = useCallback(() => {
    const form = document.getElementById("feed-filters") as HTMLFormElement
    if (!form) return
    const data = new FormData(form)
    const next = new URLSearchParams()

    const status = data.getAll("status").filter(Boolean) as string[]
    if (status.length > 0) next.set("status", status.join(","))

    const priority = data.get("priority") as string
    if (priority) next.set("priority", priority)

    const search = data.get("search") as string
    if (search?.trim()) next.set("search", search.trim())

    next.delete("page")
    router.replace(`${pathname}?${next.toString()}`)
  }, [router, pathname])

  return (
    <div className="sticky top-0 z-10 rounded-lg border border-border/70 bg-surface/90 p-3 shadow-[0_12px_40px_oklch(0.29_0.012_96_/_0.07)] backdrop-blur">
      <form id="feed-filters" className="grid gap-3 lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            className="pl-9"
            placeholder="Search by title or reference"
            defaultValue={searchParams.get("search") ?? ""}
          />
        </div>

        <Select
          name="status"
          value={searchParams.get("status") ?? ""}
          onValueChange={(val) => setParam("status", val || null)}
        >
          <SelectTrigger>
            <Funnel className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          name="priority"
          value={searchParams.get("priority") ?? ""}
          onValueChange={(val) => setParam("priority", val || null)}
        >
          <SelectTrigger>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="justify-start" type="button" disabled>
          <CalendarBlank />
          Date range
        </Button>

        <Button type="button" onClick={handleApply}>
          <Funnel />
          Apply
        </Button>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1 pr-1">
              {filter}
              <button
                type="button"
                className="ml-0.5 rounded-sm p-0.5 hover:bg-surface-strong"
                onClick={() => {
                  if (filter.startsWith("Search")) removeFilter("search")
                  else if (PRIORITY_OPTIONS.some((o) => o.label === filter)) removeFilter("priority")
                  else removeFilter("status")
                }}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  )
}
