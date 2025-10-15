import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

// Usar token desde variable de entorno (Vite)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

interface MapboxPreviewProps {
  lat: number;
  lng: number;
  height?: number;
  zoom?: number;
}

export const MapboxPreview: React.FC<MapboxPreviewProps> = ({ lat, lng, height = 240, zoom = 14 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
      interactive: false,
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height, borderRadius: 8, overflow: "hidden" }}
      className="bg-muted"
      aria-label="Vista previa del mapa"
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Botón flotante “Cómo llegar” */}
      <div className="absolute bottom-2 right-2">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md rounded-full flex items-center gap-1"
          onClick={openGoogleMaps}
        >
          <Navigation className="h-4 w-4" />
          Cómo llegar
        </Button>
      </div>
    </div>
  );
};
