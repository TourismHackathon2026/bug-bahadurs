"use client";

import { useState, type FormEvent, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPinPickerLazy as MapPinPicker } from "@/components/map/map-pin-picker-lazy";
import { VoiceComplaintRecorder } from "@/components/complaint/voice-complaint-recorder";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { createComplaint } from "@/actions/complaint.actions";
import { uploadFiles } from "@/lib/uploadthing";
import {
  Plus,
  X,
  Image,
  FileText,
  Video,
  UploadSimple,
  MagnifyingGlass,
  Spinner,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

type SelectedEvidenceFile = {
  file: File;
};

type UploadedFile = {
  fileUrl: string;
  name: string;
  type: string;
  size: number;
};

export function NewComplaintForm() {
  const router = useRouter();
  const showMapPin = true;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TAXI_FRAUD");
  const [incidentDate, setIncidentDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const today = new Date().toISOString().split("T")[0];

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  // Address search state
  const [addressInput, setAddressInput] = useState("");
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<SelectedEvidenceFile[]>(
    [],
  );
  const [isUploading, setIsUploading] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle voice complaint extraction
  const handleVoiceComplaintExtracted = (data: {
    title: string;
    description: string;
    category: string;
  }) => {
    setTitle(data.title);
    setDescription(data.description);
    setCategory(data.category);
    toast.success("Complaint fields populated from voice!");
  };

  // Debounced address search using Nominatim API
  const handleAddressSearch = useCallback(
    (query: string) => {
      setAddressInput(query);
      setGeocodeResults([]);

      if (!query.trim()) {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
          debounceTimer.current = null;
        }
        setIsSearching(false);
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const params = new URLSearchParams({
            q: query,
            format: "json",
            limit: "5",
            countrycodes: "np", // Bias results toward Nepal
          });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params}`,
            {
              headers: {
                "User-Agent": "awaaz-app", // Nominatim requires user-agent
              },
            }
          );

          if (!response.ok) throw new Error("Failed to search address");

          const results: GeocodeResult[] = await response.json();
          setGeocodeResults(results);
        } catch (err) {
          console.error("[NewComplaintForm] Address search failed:", err);
          setGeocodeResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500); // 500ms debounce
    },
    []
  );

  // Handle selecting an address from search results
  const handleSelectAddress = (result: GeocodeResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setLat(lat);
    setLng(lon);
    setLabel(result.display_name);
    setAddressInput("");
    setGeocodeResults([]);
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const candidates = Array.from(files);
    const allowed = [...selectedFiles.map((item) => item.file), ...candidates];

    if (allowed.length > 5) {
      toast.error("You can attach up to 5 evidence files.");
      return;
    }

    const invalidFile = candidates.find(
      (file) => file.size > 128 * 1024 * 1024,
    );
    if (invalidFile) {
      toast.error("Each file must be 128MB or smaller.");
      return;
    }

    setSelectedFiles((current) => [
      ...current,
      ...candidates.map((file) => ({ file })),
    ]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("incidentDate", incidentDate);

    if (lat !== null) formData.append("locationLat", lat.toString());
    if (lng !== null) formData.append("locationLng", lng.toString());
    if (label) formData.append("locationLabel", label);

    console.log("[NewComplaintForm] submitting complaint payload", {
      title,
      category,
      incidentDate,
      locationLat: lat,
      locationLng: lng,
      locationLabel: label,
      evidenceCount: selectedFiles.length,
    });

    let evidenceFiles: UploadedFile[] = [];

    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        const response = await uploadFiles("evidenceUploader", {
          files: selectedFiles.map((item) => item.file),
        });

        if (!response || response.length === 0) {
          throw new Error("Evidence upload failed.");
        }

        evidenceFiles = response.map((item, index) => ({
          fileUrl: item.url,
          name: selectedFiles[index]?.file.name ?? `file-${index}`,
          type: selectedFiles[index]?.file.type ?? "application/octet-stream",
          size: selectedFiles[index]?.file.size ?? 0,
        }));
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to upload evidence files.");
        toast.error(err?.message || "Failed to upload evidence files.");
        setIsPending(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    evidenceFiles.forEach((f, i) => {
      formData.append(`evidence[${i}][url]`, f.fileUrl);
      formData.append(`evidence[${i}][name]`, f.name);
      formData.append(`evidence[${i}][type]`, f.type);
      formData.append(`evidence[${i}][size]`, f.size.toString());
    });

    try {
      const res = await createComplaint(formData);
      if (res && !res.success) {
        setError(res.error || "Failed to submit complaint.");
        toast.error(res.error || "Failed to submit complaint.");
        setIsPending(false);
      } else {
        toast.success("Complaint submitted successfully!");
        router.push(`/dashboard/complaints/${res.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
      setIsPending(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image size={18} weight="fill" />;
    if (type.startsWith("video/")) return <Video size={18} weight="fill" />;
    return <FileText size={18} weight="fill" />;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Voice Complaint Recorder */}
      <VoiceComplaintRecorder
        onComplaintExtracted={handleVoiceComplaintExtracted}
        disabled={isPending}
      />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
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
            className="bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
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
            className="bg-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="h-11 w-full rounded-md border border-input bg-white px-3 text-sm leading-6 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
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
            <label
              htmlFor="incidentDate"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Incident Date
            </label>
            <Input
              id="incidentDate"
              name="incidentDate"
              type="date"
              required
              max={today}
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              disabled={isPending}
              className="bg-white h-11"
            />
          </div>
        </div>

        {showMapPin ? (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Incident Location (Map Pin)
            </label>

            {/* Address Search Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {isSearching ? (
                  <Spinner size={18} weight="fill" className="animate-spin" />
                ) : (
                  <MagnifyingGlass size={18} />
                )}
              </div>
              <Input
                type="text"
                placeholder="Search address (e.g., Thamel, Kathmandu)..."
                value={addressInput}
                onChange={(e) => handleAddressSearch(e.target.value)}
                disabled={isPending || isSearching}
                className="bg-white pl-10"
              />
            </div>

            {/* Geocode Results Dropdown */}
            {geocodeResults.length > 0 && (
              <div className="absolute z-50 w-full max-w-md rounded-md border border-border bg-white shadow-lg">
                {geocodeResults.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAddress(result)}
                    className="w-full border-b border-border px-4 py-3 text-left text-sm hover:bg-surface transition-colors last:border-b-0"
                  >
                    <p className="font-medium text-foreground truncate">
                      {result.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.lat}, {result.lon}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <MapPinPicker
              onLocationSelect={(loc) => {
                setLat(loc.lat);
                setLng(loc.lng);
                setLabel(loc.label || "");
              }}
              selectedLocation={
                lat !== null && lng !== null
                  ? { lat, lng, label }
                  : undefined
              }
              disabled={isPending}
            />
            {label && (
              <p className="text-xs text-primary font-medium mt-1">
                Selected Location: {label} ({lat?.toFixed(4)}, {lng?.toFixed(4)}
                )
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <label
              htmlFor="locationLabel"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
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
              className="bg-white"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evidence (Images, Videos, PDFs)
          </label>

          <div className="grid gap-3 rounded-lg border border-dashed border-border bg-surface p-4">
            <p className="text-sm text-foreground">
              Select files now, upload when the form is submitted.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="evidenceFiles"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/70"
              >
                <UploadSimple size={16} />
                Choose files
              </label>
              <span className="text-xs text-muted-foreground">
                Max 5 files · 128MB each
              </span>
            </div>
            <input
              id="evidenceFiles"
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              disabled={isPending}
              className="hidden"
              onChange={(event) => handleFileSelection(event.target.files)}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Selected files:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5"
                  >
                    <span className="text-primary">
                      {getFileIcon(item.file.type)}
                    </span>
                    <span className="text-sm truncate max-w-[200px]">
                      {item.file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {(item.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(index)}
                      disabled={isPending}
                    >
                      <X size={12} weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
        <Button type="submit" disabled={isPending || isUploading}>
          <Plus className="mr-2" size={16} weight="bold" />
          {isPending
            ? "Submitting..."
            : isUploading
              ? "Uploading..."
              : "Submit Complaint"}
        </Button>
      </div>
    </form>
  );
}
