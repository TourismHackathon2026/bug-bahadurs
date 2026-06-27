import type { Metadata } from "next"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPinPicker } from "@/components/map/map-pin-picker"
import { Note, CalendarBlank, MapPin, Plus } from "@phosphor-icons/react/dist/ssr"

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

      <form className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Complaint Title
            </label>
            <Input id="title" name="title" placeholder="Brief summary of what happened" required maxLength={150} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detailed Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please provide specific details including times, names, rates or any dialogue..."
              required
              rows={5}
              maxLength={2000}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                required
              >
                <option value="TAXI_FRAUD">Taxi Fraud</option>
                <option value="HOTEL_ISSUE">Hotel Issue</option>
                <option value="TREKKING_SAFETY">Trekking Safety</option>
                <option value="OVERCHARGING">Overcharging</option>
                <option value="HARASSMENT">Harassment</option>
                <option value="THEFT">Theft</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="incidentDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Incident Date
              </label>
              <Input id="incidentDate" name="incidentDate" type="date" required max={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Incident Location (Map Pin)
            </label>
            <MapPinPicker />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            <Plus className="mr-2" size={16} weight="bold" />
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  )
}
