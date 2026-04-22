import { useState, useEffect } from "react";
import { env } from "@/env";

export function useCalendarAuth() {
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Load the Google Identity Services script
    const loadGis = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const google = (window as any).google;
        if (google?.accounts?.oauth2) {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/calendar.events",
            callback: (tokenResponse: any) => {
              if (tokenResponse.error !== undefined) {
                console.error("GIS Error:", tokenResponse);
                return;
              }
              setAccessToken(tokenResponse.access_token);
            },
          });
          setTokenClient(client);
        }
      };
      document.body.appendChild(script);
    };

    if (!(window as any).google?.accounts?.oauth2) {
      loadGis();
    } else {
      const google = (window as any).google;
      const client = google.accounts.oauth2.initTokenClient({
        client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: (tokenResponse: any) => {
          if (tokenResponse.error !== undefined) {
            console.error("GIS Error:", tokenResponse);
            return;
          }
          setAccessToken(tokenResponse.access_token);
        },
      });
      setTokenClient(client);
    }
  }, []);

  const requestToken = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  };

  return { requestToken, accessToken };
}
