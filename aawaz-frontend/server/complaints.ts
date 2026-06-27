import { ComplaintStatus, Priority, ComplaintCategory } from "@/lib/constants"
import { prisma } from "@/lib/prisma"
import { generateReferenceNumber } from "@/lib/factory"
import { routeComplaint } from "@/server/routing"
import { sseEmitter } from "@/lib/sse-emitter"

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
  const routedAuthorityType = routeComplaint(data.category)

  // Find an active authority officer for the routed authority type
  const assignedOfficer = await prisma.user.findFirst({
    where: {
      role: "AUTHORITY",
      authorityProfile: {
        authorityType: routedAuthorityType,
      },
    },
    select: { id: true },
  })

  const status = assignedOfficer ? "ASSIGNED" : "SUBMITTED"
  const referenceNo = generateReferenceNumber()

  const complaint = await prisma.$transaction(async (tx) => {
    const created = await tx.complaint.create({
      data: {
        referenceNo,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority ?? "NORMAL",
        incidentDate: data.incidentDate,
        locationLat: data.locationLat ?? null,
        locationLng: data.locationLng ?? null,
        locationLabel: data.locationLabel ?? null,
        touristId: data.touristId,
        assignedToId: assignedOfficer?.id ?? null,
        status,
      },
    })

    // Create initial status event
    await tx.statusEvent.create({
      data: {
        complaintId: created.id,
        status: "SUBMITTED",
        actorId: data.touristId,
        note: "Complaint submitted",
      },
    })

    if (assignedOfficer) {
      await tx.statusEvent.create({
        data: {
          complaintId: created.id,
          status: "ASSIGNED",
          actorId: data.touristId,
          note: `Automatically assigned to ${routedAuthorityType.replace("_", " ")}`,
        },
      })
    }

    // Create notifications
    // 1. Tourist notification
    await tx.notification.create({
      data: {
        userId: data.touristId,
        complaintId: created.id,
        type: "COMPLAINT_SUBMITTED",
        title: "Complaint submitted successfully",
        body: `Your complaint ${referenceNo} has been submitted and is routed to ${routedAuthorityType.replace("_", " ")}.`,
        isRead: false,
      },
    })

    // 2. Authority notification if assigned
    if (assignedOfficer) {
      await tx.notification.create({
        data: {
          userId: assignedOfficer.id,
          complaintId: created.id,
          type: "NEW_ASSIGNMENT",
          title: "New complaint assigned",
          body: `A new complaint ${referenceNo} has been assigned to you.`,
          isRead: false,
        },
      })
    }

    return created
  })

  // SSE Emit for tourist
  sseEmitter.emit(data.touristId, "NEW_NOTIFICATION", {
    title: "Complaint submitted successfully",
    body: `Your complaint ${referenceNo} has been submitted.`,
  })

  // SSE Emit for authority
  if (assignedOfficer) {
    sseEmitter.emit(assignedOfficer.id, "NEW_NOTIFICATION", {
      title: "New complaint assigned",
      body: `A new complaint ${referenceNo} has been assigned to you.`,
    })
  }

  return complaint
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
