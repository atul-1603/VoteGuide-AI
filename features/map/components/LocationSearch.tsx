"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui";
import { Search } from "lucide-react";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  isLoaded: boolean;
}

export function LocationSearch({ onPlaceSelect, isLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Initialize Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "in" },
      fields: ["geometry", "name", "formatted_address"],
    });

    autocompleteRef.current?.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.geometry) {
        onPlaceSelect(place);
      }
    });
  }, [isLoaded, onPlaceSelect]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter your address or locality..."
        aria-label="Search for address or polling station"
        className="pl-9 bg-card/50 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-primary"
        disabled={!isLoaded}
      />
    </div>
  );
}
