"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Crosshair, MapPin } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
  label?: string;
}

interface MapPinPickerProps {
  onLocationSelect?: (location: Location) => void;
  defaultCenter?: { lat: number; lng: number };
  selectedLocation?: Location;
  disabled?: boolean;
}

const DEFAULT_CENTER = { lat: 27.7172, lng: 85.324 };
const DEFAULT_ZOOM = 13;

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (location: Location) => void;
}) {
  useMapEvents({
    click(event) {
      const location = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        label: `Selected map pin (${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)})`,
      };
      console.log("[MapPinPicker] user selected location:", location);
      onLocationSelect?.(location);
    },
  });
  return null;
}

function MapCenterController({
  center,
}: {
  center: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);

  return null;
}

export function MapPinPicker({
  onLocationSelect,
  defaultCenter = DEFAULT_CENTER,
  selectedLocation,
  disabled = false,
}: MapPinPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<
    Location | undefined
  >(selectedLocation);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    selectedLocation
      ? "Showing selected incident location."
      : disabled
        ? "Showing recorded location on OpenStreetMap."
        : "Tap the map or allow location access to choose a location.",
  );
  const [attemptingLocation, setAttemptingLocation] = useState(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  const displayPosition = selectedLocation ?? selectedPosition;
  const mapCenter = displayPosition ?? defaultCenter;
  const visibleStatusMessage = selectedLocation
    ? "Showing selected incident location."
    : statusMessage;

  const markerIcon = useMemo(() => {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    });
  }, []);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  });

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setStatusMessage(
        "Geolocation unavailable. Tap the map to choose a location.",
      );
      console.log(
        "[MapPinPicker] locate me clicked but geolocation unsupported",
      );
      return;
    }

    setAttemptingLocation(true);
    console.log("[MapPinPicker] locate me requested");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Current location",
        };
        console.log("[MapPinPicker] locate me success:", location);
        setSelectedPosition(location);
        setStatusMessage(
          "Current location detected. Tap map to choose a different point.",
        );
        onLocationSelectRef.current?.(location);
        setAttemptingLocation(false);
      },
      (error) => {
        console.warn("[MapPinPicker] locate me failed:", error);
        setStatusMessage(
          error?.message ||
          "Unable to get current location. Tap the map to choose a location.",
        );
        setAttemptingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleMapSelection = (location: Location) => {
    setSelectedPosition(location);
    onLocationSelect?.(location);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin size={18} />
        </span>
        <div>
          <div>
            {disabled ? "Reported incident location" : "Incident location map"}
          </div>
          <p className="text-xs text-muted-foreground">{visibleStatusMessage}</p>
        </div>
      </div>

      <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border">
        {mapError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-background px-4 text-center text-sm text-foreground">
            <div className="text-lg font-semibold">Map failed to load</div>
            <p className="text-xs text-muted-foreground max-w-sm">{mapError}</p>
            {selectedPosition ? (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p className="font-mono text-sm">
                  {selectedPosition.lat.toFixed(6)},{" "}
                  {selectedPosition.lng.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPosition.lat},${selectedPosition.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary underline"
                >
                  Open in Google Maps
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No location coordinates are available for this report.
              </p>
            )}
          </div>
        ) : (
          <div className="relative h-full w-full">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={!disabled}
              zoomControl={!disabled}
              style={{ height: "100%", width: "100%" }}
              whenReady={() => setIsMapLoaded(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                eventHandlers={{
                  tileerror: () => {
                    console.warn("[MapPinPicker] map tile load failed");
                    setMapError(
                      "Unable to load map tiles. Please check your connection.",
                    );
                  },
                }}
              />
              <MapCenterController center={mapCenter} />
              {displayPosition ? (
                <Marker
                  position={[displayPosition.lat, displayPosition.lng]}
                  icon={markerIcon}
                />
              ) : null}
              {!disabled && (
                <MapClickHandler onLocationSelect={handleMapSelection} />
              )}
            </MapContainer>
            {!isMapLoaded && (
              <div className="absolute inset-0 z-10">
                <Skeleton className="h-full w-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {!disabled && (
        <div className="mt-3 flex flex-wrap items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Tap anywhere on the map to choose a location.
          </span>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={attemptingLocation}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-surface hover:text-foreground disabled:opacity-50"
            title="Show my location"
          >
            {attemptingLocation ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            ) : (
              <Crosshair size={18} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
