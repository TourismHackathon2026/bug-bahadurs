import {
  ArrowRight,
  ChatCircleText,
  FileText,
  Images,
} from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ComplaintStatus, Priority } from "@/lib/constants"

export type ComplaintCardProps = {
  id: string
  reference: string
  title: string
  description: string
  category: string
  status: ComplaintStatus
  priority: Priority
  lastUpdated: string
  evidenceCount: number
  responsePreview?: string
}

export function ComplaintCard({
  id,
  reference,
  title,
  description,
  category,
  status,
  priority,
  lastUpdated,
  evidenceCount,
  responsePreview,
}: ComplaintCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-surface shadow-[0_18px_60px_oklch(0.29_0.012_96_/_0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_24px_70px_oklch(0.29_0.012_96_/_0.12)]">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {reference}
          </span>
          <Badge variant="outline">{category}</Badge>
          <StatusBadge status={status} />
          <PriorityBadge priority={priority} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {responsePreview ? (
          <div className="flex gap-3 rounded-md bg-secondary/70 p-3 text-sm text-secondary-foreground">
            <ChatCircleText className="mt-0.5 size-4 shrink-0" weight="duotone" />
            <p className="line-clamp-2">{responsePreview}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Images className="size-3.5" />
            {evidenceCount} evidence files
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" />
            Updated {lastUpdated}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t bg-surface-strong/50">
        <span className="text-xs text-muted-foreground">Status updates sync live</span>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/complaints/${id}`}>
            Open
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
