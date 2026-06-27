import { CheckCircle, Circle, Clock } from "@phosphor-icons/react/dist/ssr"

import { COMPLAINT_STATUS_LABELS, ComplaintStatus, type ComplaintStatus as ComplaintStatusType } from "@/lib/constants"
import { cn } from "@/lib/utils"

const TIMELINE_STEPS: readonly ComplaintStatusType[] = [
  ComplaintStatus.SUBMITTED,
  ComplaintStatus.UNDER_REVIEW,
  ComplaintStatus.ASSIGNED,
  ComplaintStatus.INVESTIGATION,
  ComplaintStatus.RESOLVED,
]

type StatusTimelineProps = {
  currentStatus: ComplaintStatusType
  reachedAt?: Partial<Record<ComplaintStatusType, string>>
}

export function StatusTimeline({ currentStatus, reachedAt = {} }: StatusTimelineProps) {
  const currentIndex =
    currentStatus === ComplaintStatus.CLOSED
      ? TIMELINE_STEPS.length - 1
      : TIMELINE_STEPS.indexOf(currentStatus)

  return (
    <div className="rounded-lg border bg-surface p-4">
      <h3 className="text-sm font-semibold">Status timeline</h3>
      <div className="mt-4 space-y-4">
        {TIMELINE_STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const Icon = isComplete ? CheckCircle : isCurrent ? Clock : Circle

          return (
            <div key={step} className="grid grid-cols-[24px_1fr] gap-3">
              <div className="relative flex justify-center">
                <Icon
                  className={cn(
                    "size-5 bg-surface",
                    isComplete || isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                  weight={isComplete || isCurrent ? "fill" : "regular"}
                />
                {index < TIMELINE_STEPS.length - 1 ? (
                  <span className="absolute top-6 h-7 w-px bg-border" />
                ) : null}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium">{COMPLAINT_STATUS_LABELS[step]}</p>
                <p className="text-xs text-muted-foreground">
                  {reachedAt[step] ?? (isCurrent ? "Current step" : "Pending")}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

