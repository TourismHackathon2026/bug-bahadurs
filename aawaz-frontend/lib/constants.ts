export const ComplaintStatus = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ASSIGNED: "ASSIGNED",
  INVESTIGATION: "INVESTIGATION",
  RESOLVED: "RESOLVED",
} as const

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus]

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  ASSIGNED: "Assigned",
  INVESTIGATION: "Investigation",
  RESOLVED: "Resolved",
}

export const COMPLAINT_STATUS_BADGE_VARIANTS: Record<
  ComplaintStatus,
  "submitted" | "review" | "assigned" | "investigation" | "resolved"
> = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "review",
  ASSIGNED: "assigned",
  INVESTIGATION: "investigation",
  RESOLVED: "resolved",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
}

