// ★ Repository pattern — all DB access for complaints lives here
import { ComplaintStatus, Priority, ComplaintCategory } from "@/lib/constants"

export interface Complaint {
  id: string
  referenceNo: string
  title: string
  description: string
  category: ComplaintCategory
  status: ComplaintStatus
  priority: Priority
  incidentDate: Date
  locationLat: number | null
  locationLng: number | null
  locationLabel: string | null
  touristId: string
  assignedToId: string | null
  aiCategory: ComplaintCategory | null
  aiConfidence: number | null
  descOriginal: string | null
  detectedLang: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StatusEvent {
  id: string
  complaintId: string
  status: ComplaintStatus
  note: string | null
  actorId: string
  createdAt: Date
}

export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
}

export async function createComplaint(data: {
  title: string
  description: string
  category: ComplaintCategory
  priority?: Priority
  incidentDate: Date
  locationLat?: number
  locationLng?: number
  locationLabel?: string
  touristId: string
}): Promise<Complaint> {
  console.log("[Repository:complaints] createComplaint - not implemented", data)
  throw new Error("Not yet implemented")
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  console.log(`[Repository:complaints] getComplaintById for ${id} - not implemented`)
  return null
}

export async function getComplaintsForTourist(
  touristId: string,
  filters: {
    status?: ComplaintStatus[]
    category?: ComplaintCategory
    priority?: Priority
    search?: string
  },
  page: number,
  limit: number
): Promise<{ complaints: Complaint[]; total: number }> {
  console.log(`[Repository:complaints] getComplaintsForTourist for ${touristId} - not implemented`)
  return { complaints: [], total: 0 }
}

export async function getComplaintsForAuthority(
  authorityType: string,
  filters: {
    status?: ComplaintStatus[]
    category?: ComplaintCategory
    priority?: Priority
    search?: string
  },
  page: number,
  limit: number
): Promise<{ complaints: Complaint[]; total: number }> {
  console.log(`[Repository:complaints] getComplaintsForAuthority for ${authorityType} - not implemented`)
  return { complaints: [], total: 0 }
}

export async function getAllComplaints(
  filters: {
    status?: ComplaintStatus[]
    category?: ComplaintCategory
    priority?: Priority
    search?: string
  },
  page: number,
  limit: number
): Promise<{ complaints: Complaint[]; total: number }> {
  console.log("[Repository:complaints] getAllComplaints - not implemented")
  return { complaints: [], total: 0 }
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  actorId: string,
  note?: string
): Promise<Complaint> {
  console.log(`[Repository:complaints] updateComplaintStatus for ${id} to ${status} by ${actorId} - not implemented`)
  throw new Error("Not yet implemented")
}

export async function getHeatmapPoints(filters: {
  category?: ComplaintCategory[]
  startDate?: Date
  endDate?: Date
}): Promise<HeatmapPoint[]> {
  console.log("[Repository:complaints] getHeatmapPoints - not implemented", filters)
  return []
}
