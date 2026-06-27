// ★ Repository pattern — all DB access for evidence lives here

export interface Evidence {
  id: string
  complaintId: string
  storageKey: string
  mimeType: string
  sizeBytes: number
  uploadedAt: Date
}

export async function createEvidence(data: {
  complaintId: string
  storageKey: string
  mimeType: string
  sizeBytes: number
}): Promise<Evidence> {
  console.log("[Repository:evidence] createEvidence - not implemented", data)
  throw new Error("Not yet implemented")
}

export async function getEvidenceForComplaint(complaintId: string): Promise<Evidence[]> {
  console.log(`[Repository:evidence] getEvidenceForComplaint for ${complaintId} - not implemented`)
  return []
}

/**
 * Returns a signed PUT URL for the client to upload directly to object storage
 */
export async function generateSignedUploadUrl(
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; storageKey: string }> {
  console.log(`[Repository:evidence] generateSignedUploadUrl for ${filename} (${contentType}) - not implemented`)
  throw new Error("Not yet implemented")
}
