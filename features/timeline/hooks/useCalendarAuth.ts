import { useState, useEffect } from "react";
import { env } from "@/config";

/**
 * Hook for managing Google Calendar OAuth2 token acquisition.
 * Uses Google Identity Services (GIS) to request calendar.events scope.
 */
export function useCalendarAuth() {
  const [tokenClient, setTokenClient] =
    useState<google.accounts.oauth2.TokenClient | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const handleTokenResponse = (
      tokenResponse: google.accounts.oauth2.TokenResponse
    ) => {
      if (tokenResponse.error !== undefined) {
        console.error("GIS Error:", tokenResponse);
        return;
      }
      setAccessToken(tokenResponse.access_token);
    };

    const initializeClient = (
      oauth2: typeof google.accounts.oauth2
    ): google.accounts.oauth2.TokenClient => {
      return oauth2.initTokenClient({
        client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: handleTokenResponse,
      });
    };

    // Load the Google Identity Services script if not already available
    if (!window.google?.accounts?.oauth2) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.oauth2) {
          setTokenClient(initializeClient(window.google.accounts.oauth2));
        }
      };
      document.body.appendChild(script);
    } else {
      setTokenClient(initializeClient(window.google.accounts.oauth2));
    }
  }, []);

  const requestToken = () => {
    tokenClient?.requestAccessToken({ prompt: "consent" });
  };

  return { requestToken, accessToken };
}
