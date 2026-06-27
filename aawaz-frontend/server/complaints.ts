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
  evidence?: Array<{
    storageKey: string
    mimeType: string
    sizeBytes: number
  }>
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

    if (data.evidence?.length) {
      await tx.evidence.createMany({
        data: data.evidence.map((file) => ({
          complaintId: created.id,
          storageKey: file.storageKey,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        })),
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

export async function getComplaintById(id: string) {
  return prisma.complaint.findUnique({
    where: { id },
    include: {
      evidence: {
        orderBy: { uploadedAt: "desc" },
      },
      tourist: {
        select: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      statusEvents: {
        orderBy: { createdAt: "asc" },
        include: {
          actor: {
            select: {
              displayName: true,
              role: true,
            },
          },
        },
      },
    },
  })
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
  const where: Record<string, unknown> = { touristId }

  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status }
  }

  if (filters.category) {
    where.category = filters.category
  }

  if (filters.priority) {
    where.priority = filters.priority
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        evidence: {
          select: { id: true },
        },
        statusEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.complaint.count({ where }),
  ])

  return { complaints, total }
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
  const where: Record<string, unknown> = {
    assignedTo: {
      authorityProfile: {
        authorityType,
      },
    },
  }

  if (filters.status?.length) where.status = { in: filters.status }
  if (filters.category) where.category = filters.category
  if (filters.priority) where.priority = filters.priority
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
      { tourist: { displayName: { contains: filters.search, mode: "insensitive" } } },
    ]
  }

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tourist: {
          select: { displayName: true, email: true },
        },
        evidence: {
          select: { id: true },
        },
        statusEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.complaint.count({ where }),
  ])

  return { complaints, total }
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
  const where: Record<string, unknown> = {}

  if (filters.status?.length) where.status = { in: filters.status }
  if (filters.category) where.category = filters.category
  if (filters.priority) where.priority = filters.priority
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tourist: { select: { displayName: true, email: true } },
        assignedTo: { select: { displayName: true, email: true } },
        evidence: { select: { id: true } },
      },
    }),
    prisma.complaint.count({ where }),
  ])

  return { complaints, total }
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  actorId: string,
  note?: string
): Promise<Complaint> {
  const actor = await prisma.user.findUnique({
    where: { id: actorId },
    select: { id: true, role: true },
  })

  if (!actor) throw new Error("Actor not found")

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNo: true,
      touristId: true,
      assignedToId: true,
      status: true,
    },
  })

  if (!complaint) throw new Error("Complaint not found")
  if (actor.role === "AUTHORITY" && complaint.assignedToId !== actorId) {
    throw new Error("Complaint is not assigned to this authority")
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.complaint.update({
      where: { id },
      data: { status },
    })

    await tx.statusEvent.create({
      data: {
        complaintId: id,
        status,
        actorId,
        note: note?.trim() || `Status changed to ${status.replaceAll("_", " ").toLowerCase()}`,
      },
    })

    await tx.notification.create({
      data: {
        userId: complaint.touristId,
        complaintId: id,
        type: status === "RESOLVED" ? "RESOLVED" : "STATUS_CHANGED",
        title: status === "RESOLVED" ? "Complaint resolved" : "Complaint status updated",
        body: `Your complaint ${complaint.referenceNo} is now ${status.replaceAll("_", " ").toLowerCase()}.`,
        isRead: false,
      },
    })

    return saved
  })

  sseEmitter.emit(complaint.touristId, "NEW_NOTIFICATION", {
    title: status === "RESOLVED" ? "Complaint resolved" : "Complaint status updated",
    body: `Your complaint ${complaint.referenceNo} is now ${status.replaceAll("_", " ").toLowerCase()}.`,
  })

  return updated
}

export async function getHeatmapPoints(filters: {
  category?: ComplaintCategory[]
  startDate?: Date
  endDate?: Date
}): Promise<HeatmapPoint[]> {
  console.log("[Repository:complaints] getHeatmapPoints - not implemented", filters)
  return []
}
