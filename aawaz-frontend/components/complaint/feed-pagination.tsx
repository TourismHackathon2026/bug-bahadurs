"use client"

import { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { getDashboardComplaints } from "@/actions/dashboard.actions"
import { ComplaintCard } from "@/components/complaint/complaint-card"
import { Button } from "@/components/ui/button"
import type { DashboardComplaint } from "@/actions/dashboard.actions"

type Props = {
  initialComplaints: DashboardComplaint[]
  initialTotal: number
}

export function FeedPagination({ initialComplaints, initialTotal }: Props) {
  const searchParams = useSearchParams()
  const [complaints, setComplaints] = useState(initialComplaints)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [allLoaded, setAllLoaded] = useState(complaints.length >= initialTotal)

  const hasMore = complaints.length < initialTotal

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const nextPage = page + 1
    const filters: Record<string, string> = {}
    for (const key of ["status", "category", "priority", "search", "sort", "from", "to"]) {
      const val = searchParams.get(key)
      if (val) filters[key] = val
    }

    const parsed: Record<string, unknown> = {}
    if (filters.status) parsed.status = filters.status.split(",")
    if (filters.category) parsed.category = filters.category
    if (filters.priority) parsed.priority = filters.priority
    if (filters.search) parsed.search = filters.search
    if (filters.sort) parsed.sort = filters.sort
    if (filters.from) parsed.startDate = new Date(filters.from)
    if (filters.to) {
      const d = new Date(filters.to)
      d.setHours(23, 59, 59, 999)
      parsed.endDate = d
    }

    const result = await getDashboardComplaints(parsed as any, nextPage, 10)
    if (result.complaints.length > 0) {
      setComplaints((prev) => [...prev, ...result.complaints])
      setPage(nextPage)
    }
    if (complaints.length + result.complaints.length >= initialTotal) {
      setAllLoaded(true)
    }
    setLoading(false)
  }, [page, loading, hasMore, searchParams, complaints.length, initialTotal])

  return (
    <>
      <div className="grid gap-6">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.reference} {...complaint} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </>
  )
}
