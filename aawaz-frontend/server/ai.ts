import { ComplaintCategory, Priority } from "@/lib/constants"
import { prisma } from "@/lib/prisma"
import { routeComplaint } from "@/server/routing"
import { sseEmitter } from "@/lib/sse-emitter"

const NVIDIA_API_URL = process.env.NVIDIA_API_URL ?? "https://integrate.api.nvidia.com/v1/chat/completions"
const NVIDIA_MODEL = process.env.NVIDIA_AI_MODEL ?? "meta/llama-4-maverick-17b-128e-instruct"
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY

interface AiCategorizationResult {
  category: ComplaintCategory
  priority: Priority
  confidence: number
}

const validCategories = Object.values(ComplaintCategory)
const validPriorities = Object.values(Priority)

function redactPII(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted email]")
    .replace(/\b(?:\+?\d{1,3}[ -.]?)?(?:\(?\d{2,4}\)?[ -.]?)?\d{3,4}[ -.]?\d{3,4}\b/g, "[redacted phone]")
    .replace(/\b\d{9,20}\b/g, "[redacted id]")
    .trim()
}

function normalizeConfidence(value: unknown): number {
  const confidence = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(confidence)) return 0
  if (confidence >= 0 && confidence <= 1) return Math.round(confidence * 100)
  return Math.round(confidence)
}

function parseResponseContent(content: unknown): AiCategorizationResult | null {
  if (typeof content !== "string") return null

  const raw = content.trim()
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  try {
    const parsed = JSON.parse(jsonMatch[0])
    const rawCategory = typeof parsed.category === "string" ? parsed.category.toUpperCase().trim() : ""
    const rawPriority = typeof parsed.priority === "string" ? parsed.priority.toUpperCase().trim() : ""
    const category = validCategories.includes(rawCategory as ComplaintCategory)
      ? (rawCategory as ComplaintCategory)
      : null
    const priority = validPriorities.includes(rawPriority as Priority)
      ? (rawPriority as Priority)
      : "NORMAL"
    const confidence = normalizeConfidence(parsed.confidence ?? parsed.confidenceScore ?? parsed.confidence_percentage)

    if (!category) return null

    return {
      category,
      priority,
      confidence: Math.min(Math.max(confidence, 0), 100),
    }
  } catch (error) {
    console.error("[Service:AI] Failed to parse AI response JSON", error, content)
    return null
  }
}

function getTextFromAiResponse(responseJson: any): string | null {
  const choice = responseJson?.choices?.[0]
  if (!choice) return null

  if (typeof choice.message?.content === "string") {
    return choice.message.content
  }

  if (Array.isArray(choice.message?.content?.parts) && choice.message.content.parts.length > 0) {
    return choice.message.content.parts.join(" ")
  }

  if (typeof choice.text === "string") {
    return choice.text
  }

  if (typeof choice.delta?.content === "string") {
    return choice.delta.content
  }

  return null
}

function buildPrompt(description: string): string {
  return `You are a complaint triage assistant for a civic tourism platform in Nepal. Analyze the complaint description and return only a JSON object with the following keys:\n- category: one of TAXI_FRAUD, HOTEL_ISSUE, TREKKING_SAFETY, OVERCHARGING, HARASSMENT, THEFT, OTHER\n- priority: one of LOW, NORMAL, HIGH, URGENT\n- confidence: a number representing classification confidence from 0 to 100\n\nDo not add any explanatory text or markdown. If the complaint matches multiple categories, choose the single best category. If unsure, choose OTHER.\n\nComplaint:\n${description}`
}

export async function categorizeComplaint(
  id: string,
  description: string
): Promise<AiCategorizationResult | null> {
  if (!NVIDIA_API_KEY) {
    console.warn("[Service:AI] Missing NVIDIA_API_KEY. Skipping AI categorization.")
    return null
  }

  const sanitizedDescription = redactPII(description)
  const payload = {
    model: NVIDIA_MODEL,
    messages: [{ role: "user", content: buildPrompt(sanitizedDescription) }],
    max_tokens: 128,
    temperature: 0.0,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stream: false,
  }

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    console.error(`[Service:AI] NVIDIA API request failed: ${response.status} ${response.statusText}`, responseText)
    return null
  }

  const responseJson = await response.json().catch((error) => {
    console.error("[Service:AI] Failed to parse NVIDIA API response as JSON", error)
    return null
  })

  if (!responseJson) return null

  const content = getTextFromAiResponse(responseJson)
  if (!content) {
    console.error("[Service:AI] NVIDIA response is missing text content", responseJson)
    return null
  }

  const aiResult = parseResponseContent(content)
  if (!aiResult) {
    console.error("[Service:AI] Could not extract AI categorization from response", content)
    return null
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNo: true,
      category: true,
      priority: true,
      status: true,
      touristId: true,
      assignedToId: true,
    },
  })

  if (!complaint) {
    console.error(`[Service:AI] Complaint ${id} not found while updating AI categorization`)
    return null
  }

  const aiAuthorityType = routeComplaint(aiResult.category)

  const currentAssignedOfficer = complaint.assignedToId
    ? await prisma.user.findUnique({
        where: { id: complaint.assignedToId },
        select: { authorityProfile: { select: { authorityType: true } } },
      })
    : null

  const currentAuthorityType = currentAssignedOfficer?.authorityProfile?.authorityType
  let assignedOfficerId = complaint.assignedToId

  if (!assignedOfficerId || currentAuthorityType !== aiAuthorityType) {
    const targetOfficer = await prisma.user.findFirst({
      where: {
        role: "AUTHORITY",
        authorityProfile: {
          authorityType: aiAuthorityType,
        },
      },
      select: { id: true },
    })

    if (targetOfficer) {
      assignedOfficerId = targetOfficer.id
    }
  }

  const updateData: Record<string, unknown> = {
    aiCategory: aiResult.category,
    aiConfidence: aiResult.confidence,
  }

  if (aiResult.priority !== complaint.priority) {
    updateData.priority = aiResult.priority
  }

  if (assignedOfficerId && assignedOfficerId !== complaint.assignedToId) {
    updateData.assignedToId = assignedOfficerId
    if (complaint.status === "SUBMITTED") {
      updateData.status = "ASSIGNED"
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.complaint.update({
      where: { id },
      data: updateData,
    })

    await tx.notification.create({
      data: {
        userId: complaint.touristId,
        complaintId: id,
        type: "STATUS_CHANGED",
        title: "AI categorization completed",
        body: `Your complaint ${complaint.referenceNo} was categorized by AI as ${aiResult.category.replaceAll("_", " ")}.`, 
        isRead: false,
      },
    })

    if (assignedOfficerId && assignedOfficerId !== complaint.assignedToId) {
      await tx.notification.create({
        data: {
          userId: assignedOfficerId,
          complaintId: id,
          type: "NEW_ASSIGNMENT",
          title: "Complaint reassigned by AI",
          body: `A complaint was routed to your authority based on AI triage.`,
          isRead: false,
        },
      })
    }
  })

  sseEmitter.emit(complaint.touristId, "AI_CATEGORIZATION_COMPLETE", {
    complaintId: id,
    aiCategory: aiResult.category,
    aiConfidence: aiResult.confidence,
    authorityType: aiAuthorityType,
  })

  if (assignedOfficerId && assignedOfficerId !== complaint.assignedToId) {
    sseEmitter.emit(assignedOfficerId, "NEW_NOTIFICATION", {
      title: "Complaint reassigned by AI",
      body: `A complaint was routed to your authority based on AI triage.`,
    })
  }

  return aiResult
}
