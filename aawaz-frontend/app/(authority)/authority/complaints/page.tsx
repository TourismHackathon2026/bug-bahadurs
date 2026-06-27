import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getComplaintsForAuthority } from "@/server/complaints"
import {
  COMPLAINT_CATEGORY_LABELS,
  COMPLAINT_STATUS_LABELS,
  PRIORITY_LABELS,
  type ComplaintCategory,
  type ComplaintStatus,
  type Priority,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Assigned Complaints | Awaaz",
  description: "View and update complaints assigned to you.",
}

interface AuthorityComplaintsPageProps {
  searchParams?: Promise<{
    q?: string
    status?: ComplaintStatus
    category?: ComplaintCategory
    priority?: Priority
  }>
}

export default async function AuthorityComplaintsPage({ searchParams }: AuthorityComplaintsPageProps) {
  const emptyParams: Awaited<NonNullable<AuthorityComplaintsPageProps["searchParams"]>> = {}
  const [session, params] = await Promise.all([getSession(), searchParams ?? Promise.resolve(emptyParams)])
  if (!session || session.role !== "AUTHORITY") notFound()

  const profile = await prisma.authorityProfile.findUnique({
    where: { userId: session.userId },
    select: { authorityType: true },
  })

  if (!profile) notFound()

  const { complaints } = await getComplaintsForAuthority(
    profile.authorityType,
    {
      search: params.q,
      status: params.status ? [params.status] : undefined,
      category: params.category,
      priority: params.priority,
    },
    1,
    50
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assigned Complaints</h1>
          <p className="text-sm text-muted-foreground">
            List of civic complaints currently assigned to your department.
          </p>
        </div>
      </div>

      {/* Filter / search block */}
      <form className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            name="q"
            type="text"
            placeholder="Search by title or reference..."
            defaultValue={params.q}
            className="rounded-md border border-input bg-surface px-3 py-2 text-sm"
          />
          <select name="status" className="rounded-md border border-input bg-surface px-3 py-2 text-sm" defaultValue={params.status ?? ""}>
            <option value="">All Statuses</option>
            {Object.entries(COMPLAINT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select name="priority" className="rounded-md border border-input bg-surface px-3 py-2 text-sm" defaultValue={params.priority ?? ""}>
            <option value="">All Priorities</option>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <Button size="sm" type="submit">Apply Filters</Button>
        </div>
      </form>

      {/* Dense list/table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead className="border-b bg-surface-strong/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Reporter</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-surface-strong/30">
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold">
                    {item.referenceNo}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-[10px] text-muted-foreground">{COMPLAINT_CATEGORY_LABELS[item.category]}</span>
                  </td>
                  <td className="px-6 py-4">{(item as typeof item & { tourist?: { displayName: string } }).tourist?.displayName ?? "Tourist"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                    {item.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link href={`/authority/complaints/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {!complaints.length ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No complaints match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
