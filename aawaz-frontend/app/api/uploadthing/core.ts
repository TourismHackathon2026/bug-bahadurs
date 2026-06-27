import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("[UploadThing] documentUploader complete:", file.url)
    return { fileUrl: file.url }
  }),
  evidenceUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 5 },
    video: { maxFileSize: "128MB", maxFileCount: 5 },
    pdf: { maxFileSize: "32MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    console.log("[UploadThing] evidenceUploader complete:", file.url)
    return { fileUrl: file.url }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
