"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPinPicker } from "@/components/map/map-pin-picker"
import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { createComplaint } from "@/actions/complaint.actions"
import { Plus } from "@phosphor-icons/react"
import { toast } from "sonner"

export function NewComplaintForm() {
  const router = useRouter()
  const showMapPin = useFeatureFlag("MAP_PIN")
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("TAXI_FRAUD")
  const [incidentDate, setIncidentDate] = useState("")
  
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [label, setLabel] = useState("")
  
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("incidentDate", incidentDate)
    
    if (lat !== null) formData.append("locationLat", lat.toString())
    if (lng !== null) formData.append("locationLng", lng.toString())
    if (label) formData.append("locationLabel", label)

    try {
      const res = await createComplaint(formData)
      if (res && !res.success) {
        setError(res.error || "Failed to submit complaint.")
        toast.error(res.error || "Failed to submit complaint.")
        setIsPending(false)
      } else {
        toast.success("Complaint submitted successfully!")
      }
    } catch (err: any) {
      console.error(err)
      setError("An unexpected error occurred.")
      toast.error("An unexpected error occurred.")
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Complaint Title
            </label>
            <span className="text-[10px] text-muted-foreground font-mono">
              {title.length}/150
            </span>
          </div>
          <Input
            id="title"
            name="title"
            placeholder="Brief summary of what happened"
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detailed Description
            </label>
            <span className="text-[10px] text-muted-foreground font-mono">
              {description.length}/2000
            </span>
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Please provide specific details including times, names, rates or any dialogue..."
            required
            rows={5}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
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
              className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
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
            <Input
              id="incidentDate"
              name="incidentDate"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {showMapPin ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Incident Location (Map Pin)
            </label>
            <MapPinPicker
              onLocationSelect={(loc) => {
                setLat(loc.lat)
                setLng(loc.lng)
                setLabel(loc.label || "")
              }}
              disabled={isPending}
            />
            {label && (
              <p className="text-xs text-primary font-medium mt-1">
                Selected Location: {label} ({lat?.toFixed(4)}, {lng?.toFixed(4)})
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label htmlFor="locationLabel" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Incident Location (Address / Plain Text)
            </label>
            <Input
              id="locationLabel"
              name="locationLabel"
              placeholder="e.g. Thamel, Kathmandu (near Garden of Dreams)"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={isPending}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          <Plus className="mr-2" size={16} weight="bold" />
          {isPending ? "Submitting..." : "Submit Complaint"}
        </Button>
      </div>
    </form>
  )
}
