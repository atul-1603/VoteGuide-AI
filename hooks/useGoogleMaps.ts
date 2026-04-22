import { useState, useEffect } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { env } from "@/env";

let isApiOptionsSet = false;

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setLoadError(new Error("Google Maps API key is missing"));
      return;
    }

    if (!isApiOptionsSet) {
      setOptions({
        key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        v: "weekly",
        libraries: ["places", "marker", "routes"],
      });
      isApiOptionsSet = true;
    }

    Promise.all([
      importLibrary("maps"),
      importLibrary("places"),
      importLibrary("marker"),
      importLibrary("routes"),
    ])
      .then(() => {
        setIsLoaded(true);
      })
      .catch((e: Error) => {
        setLoadError(e);
      });
  }, []);

  return { isLoaded, loadError };
}
