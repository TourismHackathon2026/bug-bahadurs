export const ComplaintStatus = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ASSIGNED: "ASSIGNED",
  INVESTIGATION: "INVESTIGATION",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus]

export const Priority = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export const Role = {
  TOURIST: "TOURIST",
  AUTHORITY: "AUTHORITY",
  ADMIN: "ADMIN",
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const RegistrationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus]

export const AuthorityType = {
  NEPAL_POLICE: "NEPAL_POLICE",
  TOURISM_BOARD: "TOURISM_BOARD",
  HOTEL_ASSOCIATION: "HOTEL_ASSOCIATION",
  TRAFFIC_POLICE: "TRAFFIC_POLICE",
  MUNICIPALITY: "MUNICIPALITY",
} as const

export type AuthorityType = (typeof AuthorityType)[keyof typeof AuthorityType]

export const ComplaintCategory = {
  TAXI_FRAUD: "TAXI_FRAUD",
  HOTEL_ISSUE: "HOTEL_ISSUE",
  TREKKING_SAFETY: "TREKKING_SAFETY",
  OVERCHARGING: "OVERCHARGING",
  HARASSMENT: "HARASSMENT",
  THEFT: "THEFT",
  OTHER: "OTHER",
} as const

export type ComplaintCategory = (typeof ComplaintCategory)[keyof typeof ComplaintCategory]

export const NotificationType = {
  COMPLAINT_SUBMITTED: "COMPLAINT_SUBMITTED",
  STATUS_CHANGED: "STATUS_CHANGED",
  EVIDENCE_REQUESTED: "EVIDENCE_REQUESTED",
  EVIDENCE_UPLOADED: "EVIDENCE_UPLOADED",
  RESOLVED: "RESOLVED",
  REGISTRATION_APPROVED: "REGISTRATION_APPROVED",
  REGISTRATION_REJECTED: "REGISTRATION_REJECTED",
  NEW_ASSIGNMENT: "NEW_ASSIGNMENT",
  ESCALATED: "ESCALATED",
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  ASSIGNED: "Assigned",
  INVESTIGATION: "Investigation",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
}

export const COMPLAINT_STATUS_BADGE_VARIANTS: Record<
  ComplaintStatus,
  "submitted" | "review" | "assigned" | "investigation" | "resolved" | "closed"
> = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "review",
  ASSIGNED: "assigned",
  INVESTIGATION: "investigation",
  RESOLVED: "resolved",
  CLOSED: "closed",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
}

export const AUTHORITY_TYPE_LABELS: Record<AuthorityType, string> = {
  NEPAL_POLICE: "Nepal Police",
  TOURISM_BOARD: "Tourism Board",
  HOTEL_ASSOCIATION: "Hotel Association",
  TRAFFIC_POLICE: "Traffic Police",
  MUNICIPALITY: "Municipality",
}

export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  TAXI_FRAUD: "Taxi Fraud",
  HOTEL_ISSUE: "Hotel Issue",
  TREKKING_SAFETY: "Trekking Safety",
  OVERCHARGING: "Overcharging",
  HARASSMENT: "Harassment",
  THEFT: "Theft",
  OTHER: "Other",
}

