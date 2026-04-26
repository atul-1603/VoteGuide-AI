"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  center: google.maps.LatLngLiteral;
  zoom: number;
  isLoaded: boolean;
  onMarkerClick: (stationId: string) => void;
  destinationId?: string | null;
}

const mockStations = [
  { id: "1", name: "Govt Primary School", latOffset: 0.005, lngOffset: 0.002, booth: "142A" },
  { id: "2", name: "Community Center", latOffset: -0.003, lngOffset: 0.004, booth: "143B" },
  { id: "3", name: "High School Hall", latOffset: 0.002, lngOffset: -0.006, booth: "145C" },
];

export function StationMap({ center, zoom, isLoaded, onMarkerClick, destinationId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "VOTEGUIDE_MAP_ID", // Required for AdvancedMarkerElement
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);
    } else {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [isLoaded, center, zoom, map]);

  // Handle Markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.map = null);
    markersRef.current = [];

    // Add User Center Marker
    const userMarker = new window.google.maps.marker.AdvancedMarkerElement({
      position: center,
      map: map,
      title: "Your Location",
    });
    markersRef.current.push(userMarker);

    // Add Mock Station Markers
    mockStations.forEach((station) => {
      const position = {
        lat: center.lat + station.latOffset,
        lng: center.lng + station.lngOffset,
      };

      const pinElement = document.createElement("div");
      pinElement.className = "w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg";
      pinElement.innerText = "Vote";

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map: map,
        title: station.name,
        content: pinElement,
      });

      marker.addListener("gmp-click", () => {
        onMarkerClick(station.id);
      });

      markersRef.current.push(marker);
    });
  }, [map, center, isLoaded, onMarkerClick]);

  // Handle Directions
  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeWeight: 5,
        },
      });
    }

    if (destinationId) {
      const station = mockStations.find(s => s.id === destinationId);
      if (station) {
        const destination = {
          lat: center.lat + station.latOffset,
          lng: center.lng + station.lngOffset,
        };

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: center,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (
            result: google.maps.DirectionsResult | null,
            status: string
          ) => {
            if (status === "OK" && result) {
              directionsRendererRef.current?.setDirections(result);
              // Hide other markers if needed, or just let them stay
            } else {
              console.error("Directions request failed:", status);
            }
          }
        );
      }
    } else {
      directionsRendererRef.current?.setDirections(null);
    }
  }, [map, isLoaded, destinationId, center]);

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10" />;
}
