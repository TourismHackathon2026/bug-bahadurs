import { Badge } from "@/components/ui/badge"
import {
  COMPLAINT_STATUS_BADGE_VARIANTS,
  COMPLAINT_STATUS_LABELS,
  type ComplaintStatus,
} from "@/lib/constants"

type StatusBadgeProps = {
  status: ComplaintStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={COMPLAINT_STATUS_BADGE_VARIANTS[status]}>
      {COMPLAINT_STATUS_LABELS[status]}
    </Badge>
  )
}

