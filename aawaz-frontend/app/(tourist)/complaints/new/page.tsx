import type { Metadata } from "next"
import { NewComplaintForm } from "@/components/complaint/new-complaint-form"

export const metadata: Metadata = {
  title: "File a Complaint | Awaaz",
  description: "Submit a new tourist civic complaint.",
}

export default function NewComplaintPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File a Complaint</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit details of the incident. Authorities will review it immediately.
        </p>
      </div>

      <NewComplaintForm />
    </div>
  )
}
