"use server"

/**
 * Server action to confirm evidence has been successfully uploaded to object storage
 */
export async function confirmEvidence(
  complaintId: string,
  storageKey: string,
  mimeType: string,
  sizeBytes: number
): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action:evidence] confirmEvidence for ${complaintId} - not implemented`)
  return { success: false, error: "Not yet implemented" }
}
