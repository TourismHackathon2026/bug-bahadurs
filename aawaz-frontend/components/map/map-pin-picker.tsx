"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Crosshair, MapPin } from "@phosphor-icons/react";

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

export function MapPinPicker({
  onLocationSelect,
  defaultCenter = DEFAULT_CENTER,
  selectedLocation,
  disabled = false,
}: MapPinPickerProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedPosition, setSelectedPosition] = useState<
    Location | undefined
  >(selectedLocation);
  const [statusMessage, setStatusMessage] = useState(
    disabled
      ? "Showing recorded location on OpenStreetMap."
      : "Tap the map or allow location access to choose a location.",
  );
  const [attemptingLocation, setAttemptingLocation] = useState(false);
  const onLocationSelectRef = useRef(onLocationSelect);
  onLocationSelectRef.current = onLocationSelect;

  const markerIcon = useMemo(() => {
    return L.icon({
      iconUrl: new URL(
        "leaflet/dist/images/marker-icon.png",
        import.meta.url,
      ).toString(),
      iconRetinaUrl: new URL(
        "leaflet/dist/images/marker-icon-2x.png",
        import.meta.url,
      ).toString(),
      shadowUrl: new URL(
        "leaflet/dist/images/marker-shadow.png",
        import.meta.url,
      ).toString(),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    });
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setSelectedPosition(selectedLocation);
      setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
      setStatusMessage("Showing selected incident location.");
      return;
    }

    if (disabled) return;
  }, [disabled, selectedLocation]);

  useEffect(() => {
    if (disabled || selectedLocation) return;

    if (!navigator.geolocation) {
      console.log(
        "[MapPinPicker] Geolocation is not supported by this browser.",
      );
      setStatusMessage(
        "Geolocation unavailable. Tap the map to select a location.",
      );
      return;
    }

    setAttemptingLocation(true);
    console.log("[MapPinPicker] requesting current position");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Current location",
        };
        console.log("[MapPinPicker] current location obtained:", location);
        console.log("accuracy (meters):", position.coords.accuracy);
        setMapCenter({ lat: location.lat, lng: location.lng });
        setSelectedPosition(location);
        setStatusMessage(
          "Current location detected. Tap map to choose a different point.",
        );
        onLocationSelectRef.current?.(location);
        setAttemptingLocation(false);
      },
      (error) => {
        console.warn("[MapPinPicker] geolocation failed:", error);
        setStatusMessage(
          error?.message ||
            "Unable to get current location. Tap the map to choose a location.",
        );
        setAttemptingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [disabled, selectedLocation]);

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
        setMapCenter({ lat: location.lat, lng: location.lng });
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
    setMapCenter({ lat: location.lat, lng: location.lng });
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
          <p className="text-xs text-muted-foreground">{statusMessage}</p>
        </div>
      </div>

      <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={!disabled}
          zoomControl={!disabled}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {selectedPosition ? (
            <Marker
              position={[selectedPosition.lat, selectedPosition.lng]}
              icon={markerIcon}
            />
          ) : null}
          {!disabled && (
            <MapClickHandler onLocationSelect={handleMapSelection} />
          )}
        </MapContainer>
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
