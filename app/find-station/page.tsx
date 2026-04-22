"use client";

import { useState } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { LocationSearch } from "@/components/map/LocationSearch";
import { StationMap } from "@/components/map/StationMap";
import { StationCard } from "@/components/map/StationCard";

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi

export default function FindStationPage() {
  const { isLoaded, loadError } = useGoogleMaps();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(12);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setZoom(15);
      setSelectedStationId(null);
      setShowDirections(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <h2 className="text-2xl font-bold text-destructive mb-2">Map Loading Error</h2>
        <p className="text-muted-foreground">Please check your Google Maps API key configuration.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar Panel */}
      <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 border-r border-white/10 flex flex-col bg-background/80 backdrop-blur-xl z-10 shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Find Your Booth</h1>
          <p className="text-sm text-muted-foreground mb-6">Search your address to locate the nearest polling station.</p>
          <LocationSearch isLoaded={isLoaded} onPlaceSelect={handlePlaceSelect} />
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-transparent to-background/50">
          <StationCard 
            stationId={selectedStationId} 
            onGetDirections={() => setShowDirections(true)}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-muted/20">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <StationMap
            center={center}
            zoom={zoom}
            isLoaded={isLoaded}
            onMarkerClick={(id) => {
              setSelectedStationId(id);
              setShowDirections(false);
            }}
            destinationId={showDirections ? selectedStationId : null}
          />
        )}
      </div>
    </div>
  );
}
