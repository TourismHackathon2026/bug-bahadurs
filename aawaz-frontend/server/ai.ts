import { Priority } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const NVIDIA_API_URL =
  process.env.NVIDIA_API_URL ??
  "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL =
  process.env.NVIDIA_AI_MODEL ?? "meta/llama-4-maverick-17b-128e-instruct";
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

interface AiCategorizationResult {
  category: string;
  priority: Priority;
  confidence: number;
}

const validPriorities = Object.values(Priority);

function redactPII(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted email]")
    .replace(
      /\b(?:\+?\d{1,3}[ -.]?)?(?:\(?\d{2,4}\)?[ -.]?)?\d{3,4}[ -.]?\d{3,4}\b/g,
      "[redacted phone]",
    )
    .replace(/\b\d{9,20}\b/g, "[redacted id]")
    .trim();
}

function normalizeConfidence(value: unknown): number {
  const confidence = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(confidence)) return 0;
  if (confidence >= 0 && confidence <= 1) return Math.round(confidence * 100);
  return Math.round(confidence);
}

function parseResponseContent(content: unknown): AiCategorizationResult | null {
  if (typeof content !== "string") return null;

  const raw = content.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const category =
        typeof parsed.category === "string" ? parsed.category.trim() : "";
      const rawPriority =
        typeof parsed.priority === "string"
          ? parsed.priority.toUpperCase().trim()
          : "";
      const priority = validPriorities.includes(rawPriority as Priority)
        ? (rawPriority as Priority)
        : "NORMAL";
      const confidence = normalizeConfidence(
        parsed.confidence ??
        parsed.confidenceScore ??
        parsed.confidence_percentage,
      );

      if (!category) return null;

      return {
        category,
        priority,
        confidence: Math.min(Math.max(confidence, 0), 100),
      };
    } catch (error) {
      console.error(
        "[Service:AI] Failed to parse AI response JSON",
        error,
        content,
      );
    }
  }

  if (!raw) return null;
  return {
    category: raw,
    priority: "NORMAL",
    confidence: 0,
  };
}

function getTextFromAiResponse(responseJson: unknown): string | null {
  const choices =
    typeof responseJson === "object" && responseJson !== null
      ? (responseJson as { choices?: unknown[] }).choices
      : undefined;
  const choice = choices?.[0] as {
    message?: { content?: unknown };
    text?: unknown;
    delta?: { content?: unknown };
  } | undefined;
  if (!choice) return null;

  if (typeof choice.message?.content === "string") {
    return choice.message.content;
  }

  const content = choice.message?.content;
  if (
    content &&
    typeof content === "object" &&
    "parts" in content &&
    Array.isArray((content as { parts: unknown[] }).parts) &&
    (content as { parts: unknown[] }).parts.length > 0
  ) {
    return (content as { parts: unknown[] }).parts.join(" ");
  }

  if (typeof choice.text === "string") {
    return choice.text;
  }

  if (typeof choice.delta?.content === "string") {
    return choice.delta.content;
  }

  return null;
}

function buildPrompt(description: string): string {
  return `You are a complaint triage assistant for a civic tourism platform in Nepal. Analyze the complaint description and return only a JSON object with the following keys:\n- category: a short free-form text label that best describes the complaint in plain language\n- priority: one of LOW, NORMAL, HIGH, URGENT\n- confidence: a number representing classification confidence from 0 to 100\n\nDo not use a fixed category list. The category can be any concise descriptive phrase, such as "Taxi overcharging", "Hotel cleanliness issue", or "Harassment complaint". Do not add any explanatory text or markdown.\n\nComplaint:\n${description}`;
}

export async function categorizeComplaint(
  id: string,
  description: string,
): Promise<AiCategorizationResult | null> {
  console.log("[Service:AI] categorizeComplaint START - id:", id);

  if (!NVIDIA_API_KEY) {
    console.warn(
      "[Service:AI] Missing NVIDIA_API_KEY. Skipping AI categorization.",
    );
    return null;
  }

  console.log(
    "[Service:AI] NVIDIA_API_KEY is set, proceeding with categorization",
  );
  const sanitizedDescription = redactPII(description);
  console.log(
    "[Service:AI] Sanitized description length:",
    sanitizedDescription.length,
  );
  const payload = {
    model: NVIDIA_MODEL,
    messages: [{ role: "user", content: buildPrompt(sanitizedDescription) }],
    max_tokens: 128,
    temperature: 0.0,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stream: false,
  };

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("[Service:AI] NVIDIA API response status:", response.status);

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");
    console.error(
      `[Service:AI] NVIDIA API request failed: ${response.status} ${response.statusText}`,
      responseText,
    );
    return null;
  }

  const responseJson = await response.json().catch((error) => {
    console.error(
      "[Service:AI] Failed to parse NVIDIA API response as JSON",
      error,
    );
    return null;
  });

  if (!responseJson) return null;

  const content = getTextFromAiResponse(responseJson);
  if (!content) {
    console.error(
      "[Service:AI] NVIDIA response is missing text content",
      responseJson,
    );
    return null;
  }

  const aiResult = parseResponseContent(content);
  console.log(aiResult)
  if (!aiResult) {
    console.error(
      "[Service:AI] Could not extract AI categorization from response",
      content,
    );
    return null;
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNo: true,
      priority: true,
      touristId: true,
    },
  });

  if (!complaint) {
    console.error(
      `[Service:AI] Complaint ${id} not found while updating AI categorization`,
    );
    return null;
  }

  const updateData: {
    aiCategory: string
    aiConfidence: number
    priority?: Priority
  } = {
    aiCategory: aiResult.category,
    aiConfidence: aiResult.confidence,
  };

  console.log(
    "[Service:AI] Extracted category:",
    aiResult.category,
    "priority:",
    aiResult.priority,
    "confidence:",
    aiResult.confidence,
  );

  if (aiResult.priority !== complaint.priority) {
    updateData.priority = aiResult.priority;
  }

  await prisma.$transaction(async (tx) => {
    await tx.complaint.update({
      where: { id },
      data: updateData,
    });
  });

  console.log(
    "[Service:AI] categorizeComplaint COMPLETE - complaint:",
    id,
    "updated with category:",
    aiResult.category,
  );
  return aiResult;
}

interface VoiceComplaintFields {
  title: string;
  description: string;
  category: string;
}

function buildVoiceExtractionPrompt(voiceTranscript: string): string {
  return `You are a complaint processing assistant for a civic tourism platform in Nepal.
A tourist has reported an incident via voice. Your only task is to extract and structure the complaint into JSON.

IMPORTANT: Respond in English only. Do not roleplay, do not answer as a different assistant, and do not include any content aside from the JSON.
Return EXACTLY one valid JSON object with no additional text, markdown, or explanation.

The JSON must have these exact keys:
{
  "title": "A concise 2-5 word summary of the complaint (e.g., 'Taxi overcharged at airport')",
  "description": "The full detailed complaint preserving all original details mentioned",
  "category": "One category: TAXI_FRAUD, HOTEL_ISSUE, TREKKING_SAFETY, OVERCHARGING, HARASSMENT, THEFT, or OTHER"
}

Voice Transcript:
"${voiceTranscript}"

Return ONLY the JSON object, nothing else.`;
}

export async function extractVoiceComplaint(
  voiceTranscript: string,
): Promise<VoiceComplaintFields | null> {
  console.log(
    "[Service:AI] extractVoiceComplaint START - transcript length:",
    voiceTranscript.length,
  );

  if (!NVIDIA_API_KEY) {
    console.warn(
      "[Service:AI] Missing NVIDIA_API_KEY. Skipping voice complaint extraction.",
    );
    return null;
  }

  if (!voiceTranscript.trim()) {
    console.warn("[Service:AI] Voice transcript is empty");
    return null;
  }

  const sanitizedTranscript = redactPII(voiceTranscript);
  const payload = {
    model: NVIDIA_MODEL,
    messages: [
      {
        role: "user",
        content: buildVoiceExtractionPrompt(sanitizedTranscript),
      },
    ],
    max_tokens: 256,
    temperature: 0.2,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stream: false,
  };

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("RESPONSE", response)
    console.log(
      "[Service:AI] NVIDIA API response status for voice extraction:",
      response.status,
    );

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(
        `[Service:AI] NVIDIA API voice extraction failed: ${response.status}`,
        responseText,
      );
      return null;
    }

    const responseJson = await response.json().catch((error) => {
      console.error("[Service:AI] Failed to parse voice extraction response", error);
      return null;
    });

    if (!responseJson) {
      console.error("[Service:AI] Response JSON is null");
      return null;
    }

    const content = getTextFromAiResponse(responseJson);
    if (!content) {
      console.error(
        "[Service:AI] Voice extraction response missing text content. Response structure:",
        JSON.stringify(responseJson),
      );
      return null;
    }

    console.log("[Service:AI] Extracted text from AI response:", content.substring(0, 500));

    // Parse JSON from response - handle multiple possible formats
    let parsed;
    try {
      // First try: direct JSON parse
      parsed = JSON.parse(content.trim());
      console.log("[Service:AI] Successfully parsed JSON directly from response");
    } catch (e) {
      console.warn("[Service:AI] Direct JSON parse failed, attempting to extract JSON from text");
      // Second try: extract JSON from markdown or other text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          "[Service:AI] Could not find JSON in voice extraction response. Full content:",
          content,
        );
        return null;
      }
      try {
        parsed = JSON.parse(jsonMatch[0]);
        console.log("[Service:AI] Successfully extracted and parsed JSON from text");
      } catch (parseError) {
        console.error(
          "[Service:AI] Failed to parse extracted JSON string:",
          jsonMatch[0],
          parseError,
        );
        return null;
      }
    }

    // Validate parsed object
    if (!parsed || typeof parsed !== "object") {
      console.error("[Service:AI] Parsed result is not a valid object:", parsed);
      return null;
    }

    const result: VoiceComplaintFields = {
      title: typeof parsed.title === "string" ? parsed.title.trim() : "",
      description:
        typeof parsed.description === "string"
          ? parsed.description.trim()
          : "",
      category:
        typeof parsed.category === "string" ? parsed.category.trim() : "OTHER",
    };

    if (!result.title) {
      console.error("[Service:AI] Missing title field in voice extraction response", parsed);
      return null;
    }

    if (!result.description) {
      console.error(
        "[Service:AI] Missing description field in voice extraction response",
        parsed,
      );
      return null;
    }

    console.log("[Service:AI] Voice complaint extracted successfully:", {
      titleLength: result.title.length,
      descriptionLength: result.description.length,
      category: result.category,
    });
    return result;
  } catch (error) {
    console.error("[Service:AI] Voice complaint extraction error:", error);
    return null;
  }
}
