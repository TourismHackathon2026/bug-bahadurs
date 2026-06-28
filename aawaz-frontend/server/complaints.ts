import { ComplaintStatus, Priority, ComplaintCategory } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { generateReferenceNumber } from "@/lib/factory";
import { routeComplaint } from "@/server/routing";
import { notifyInTx } from "@/services/notification";

export interface Complaint {
  id: string;
  referenceNo: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: Priority;
  incidentDate: Date;
  locationLat: number | null;
  locationLng: number | null;
  locationLabel: string | null;
  touristId: string;
  assignedToId: string | null;
  assignedTo?: {
    id?: string;
    displayName: string;
    email: string;
    authorityProfile?: {
      authorityType: string;
    };
  } | null;
  aiCategory: ComplaintCategory | null;
  aiConfidence: number | null;
  descOriginal: string | null;
  detectedLang: string | null;
  evidence?: Array<{ id: string }>;
  statusEvents?: StatusEvent[];
  tourist?: {
    id?: string;
    displayName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusEvent {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  note: string | null;
  actorId: string;
  createdAt: Date;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export async function createComplaint(data: {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority?: Priority;
  incidentDate: Date;
  locationLat?: number;
  locationLng?: number;
  locationLabel?: string;
  touristId: string;
  evidence?: Array<{
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
  }>;
}): Promise<Complaint> {
  const routedAuthorityType = routeComplaint(data.category);

  // Find an active authority officer for the routed authority type
  const assignedOfficer = await prisma.user.findFirst({
    where: {
      role: "AUTHORITY",
      authorityProfile: {
        authorityType: routedAuthorityType,
      },
    },
    select: { id: true, email: true, displayName: true },
  });

  const tourist = await prisma.user.findUnique({
    where: { id: data.touristId },
    select: { email: true, displayName: true },
  });

  const status = assignedOfficer ? "ASSIGNED" : "SUBMITTED";
  const referenceNo = generateReferenceNumber();

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
    });

    // Create initial status event
    await tx.statusEvent.create({
      data: {
        complaintId: created.id,
        status: "SUBMITTED",
        actorId: data.touristId,
        note: "Complaint submitted",
      },
    });

    if (assignedOfficer) {
      await tx.statusEvent.create({
        data: {
          complaintId: created.id,
          status: "ASSIGNED",
          actorId: data.touristId,
          note: `Automatically assigned to ${routedAuthorityType.replace("_", " ")}`,
        },
      });
    }

    if (data.evidence?.length) {
      await tx.evidence.createMany({
        data: data.evidence.map((file) => ({
          complaintId: created.id,
          storageKey: file.storageKey,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
        })),
      });
    }

    await notifyInTx(tx, {
      userId: data.touristId,
      complaintId: created.id,
      type: "COMPLAINT_SUBMITTED",
      title: "Complaint submitted successfully",
      body: `Your complaint ${referenceNo} has been submitted and is routed to ${routedAuthorityType.replace("_", " ")}.`,
      email: tourist?.email
        ? {
          to: tourist.email,
          subject: "Complaint Submitted Successfully",
          text: `Dear ${tourist?.displayName ?? "User"},\n\nYour complaint ${referenceNo} has been submitted successfully and is routed to ${routedAuthorityType.replace("_", " ")}.\n\nYou will be notified when there are updates.`,
        }
        : undefined,
    });

    if (assignedOfficer) {
      await notifyInTx(tx, {
        userId: assignedOfficer.id,
        complaintId: created.id,
        type: "NEW_ASSIGNMENT",
        title: "New complaint assigned",
        body: `A new complaint ${referenceNo} has been assigned to you.`,
        email: {
          to: assignedOfficer.email,
          subject: "New Complaint Assigned",
          text: `Dear ${assignedOfficer.displayName},\n\nA new complaint ${referenceNo} has been assigned to you.\n\nPlease review and take necessary action.`,
        },
      });
    }

    return created;
  });

  return complaint;
}

export async function getComplaintById(id: string) {
  console.log("[Repository:complaints] getComplaintById called with id:", id);

  if (!id) {
    console.error(
      "[Repository:complaints] getComplaintById - id is falsy:",
      id,
    );
    return null;
  }

  const result = await prisma.complaint.findUnique({
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
          authorityProfile: {
            select: {
              authorityType: true,
            },
          },
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
  });

  console.log("[Repository:complaints] getComplaintById result:", result?.id);
  return result;
}

export async function getComplaintsForTourist(
  touristId: string,
  filters: {
    status?: ComplaintStatus[];
    category?: ComplaintCategory;
    priority?: Priority;
    search?: string;
  },
  page: number,
  limit: number,
): Promise<{ complaints: Complaint[]; total: number }> {
  const where: Record<string, unknown> = { touristId };

  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
    ];
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
  ]);

  return { complaints, total };
}

export async function getComplaintsForAuthority(
  authorityType: string,
  filters: {
    status?: ComplaintStatus[];
    category?: ComplaintCategory;
    priority?: Priority;
    search?: string;
  },
  page: number,
  limit: number,
): Promise<{ complaints: Complaint[]; total: number }> {
  const where: Record<string, unknown> = {
    assignedTo: {
      authorityProfile: {
        authorityType,
      },
    },
  };

  if (filters.status?.length) where.status = { in: filters.status };
  if (filters.category) where.category = filters.category;
  if (filters.priority) where.priority = filters.priority;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
      {
        tourist: {
          displayName: { contains: filters.search, mode: "insensitive" },
        },
      },
    ];
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
  ]);

  return { complaints, total };
}

export async function getAllComplaints(
  filters: {
    status?: ComplaintStatus[];
    category?: ComplaintCategory;
    priority?: Priority;
    search?: string;
  },
  page: number,
  limit: number,
): Promise<{ complaints: Complaint[]; total: number }> {
  const where: Record<string, unknown> = {};

  if (filters.status?.length) where.status = { in: filters.status };
  if (filters.category) where.category = filters.category;
  if (filters.priority) where.priority = filters.priority;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { referenceNo: { contains: filters.search, mode: "insensitive" } },
    ];
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
  ]);

  return { complaints, total };
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  actorId: string,
  note?: string,
): Promise<Complaint> {
  const actor = await prisma.user.findUnique({
    where: { id: actorId },
    select: { id: true, role: true },
  });

  if (!actor) throw new Error("Actor not found");

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNo: true,
      touristId: true,
      assignedToId: true,
      status: true,
    },
  });

  if (!complaint) throw new Error("Complaint not found");
  if (actor.role === "AUTHORITY" && complaint.assignedToId !== actorId) {
    throw new Error("Complaint is not assigned to this authority");
  }

  const tourist = await prisma.user.findUnique({
    where: { id: complaint.touristId },
    select: { email: true, displayName: true },
  });

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.complaint.update({
      where: { id },
      data: { status },
    });

    await tx.statusEvent.create({
      data: {
        complaintId: id,
        status,
        actorId,
        note:
          note?.trim() ||
          `Status changed to ${status.replaceAll("_", " ").toLowerCase()}`,
      },
    });

    await notifyInTx(tx, {
      userId: complaint.touristId,
      complaintId: id,
      type: status === "RESOLVED" ? "RESOLVED" : "STATUS_CHANGED",
      title: status === "RESOLVED" ? "Complaint resolved" : "Complaint status updated",
      body: `Your complaint ${complaint.referenceNo} is now ${status.replaceAll("_", " ").toLowerCase()}.`,
      email: tourist?.email
        ? {
          to: tourist.email,
          subject: status === "RESOLVED" ? "Complaint Resolved" : "Complaint Status Updated",
          text: `Dear ${tourist?.displayName ?? "User"},\n\nYour complaint ${complaint.referenceNo} has been updated to ${status.replaceAll("_", " ").toLowerCase()}.\n\nYou can check the details in your dashboard.`,
        }
        : undefined,
    });

    return saved;
  });

  return updated;
}

export async function getHeatmapPoints(filters: {
  category?: ComplaintCategory[];
  startDate?: Date;
  endDate?: Date;
}): Promise<HeatmapPoint[]> {
  const where: Record<string, unknown> = {
    locationLat: { not: null },
    locationLng: { not: null },
  };

  if (filters.category?.length) {
    where.category = { in: filters.category };
  }

  if (filters.startDate || filters.endDate) {
    where.incidentDate = {
      ...(filters.startDate ? { gte: filters.startDate } : {}),
      ...(filters.endDate ? { lte: filters.endDate } : {}),
    };
  }

  const complaints = await prisma.complaint.findMany({
    where,
    select: {
      locationLat: true,
      locationLng: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (complaints.length === 0) {
    return [];
  }

  const grouped = new Map<string, { lat: number; lng: number; count: number }>();

  for (const complaint of complaints) {
    if (complaint.locationLat === null || complaint.locationLng === null) {
      continue;
    }

    const lat = Number(complaint.locationLat.toFixed(3));
    const lng = Number(complaint.locationLng.toFixed(3));
    const key = `${lat}:${lng}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      grouped.set(key, { lat, lng, count: 1 });
    }
  }

  const maxCount = Math.max(...Array.from(grouped.values()).map((point) => point.count));

  return Array.from(grouped.values()).map((point) => ({
    lat: point.lat,
    lng: point.lng,
    intensity: Number((point.count / maxCount).toFixed(3)),
  }));
}
