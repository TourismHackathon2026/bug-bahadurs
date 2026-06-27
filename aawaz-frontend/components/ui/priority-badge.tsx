import { WarningCircle } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { PRIORITY_LABELS, type Priority } from "@/lib/constants"

type PriorityBadgeProps = {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const isElevated = priority === "HIGH" || priority === "URGENT"

  return (
    <Badge variant={isElevated ? "priority" : "outline"}>
      {isElevated ? <WarningCircle weight="bold" /> : null}
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}

