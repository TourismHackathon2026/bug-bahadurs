import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import type { ComponentType } from "react"

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>() as ComponentType<any>

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
