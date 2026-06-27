import { CalendarBlank, Funnel, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr"

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

type FeedFilterBarProps = {
  activeFilters?: string[]
}

export function FeedFilterBar({ activeFilters = [] }: FeedFilterBarProps) {
  return (
    <div className="sticky top-0 z-10 rounded-lg border border-border/70 bg-surface/90 p-3 shadow-[0_12px_40px_oklch(0.29_0.012_96_/_0.07)] backdrop-blur">
      <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title or reference" />
        </div>
        <Select>
          <SelectTrigger>
            <Funnel className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="review">Under review</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="justify-start">
          <CalendarBlank />
          Date range
        </Button>
        <Button>
          <Funnel />
          Apply
        </Button>
      </div>
      {activeFilters.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary">
              {filter}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
