"use client";

import { useEffect } from "react";

// ─── Google Translate Typings ───────────────────────────────────────

interface GoogleTranslateElement {
  new (
    options: {
      pageLanguage: string;
      layout: number;
      autoDisplay: boolean;
    },
    elementId: string
  ): void;
}

interface GoogleTranslateElementConstructor extends GoogleTranslateElement {
  InlineLayout: {
    SIMPLE: number;
    HORIZONTAL: number;
    VERTICAL: number;
  };
}

interface GoogleTranslateAPI {
  TranslateElement: GoogleTranslateElementConstructor;
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: {
      translate?: GoogleTranslateAPI;
      accounts?: typeof google.accounts;
    };
  }
}

// ─── Component ──────────────────────────────────────────────────────

export function GoogleTranslate() {
  useEffect(() => {
    // Check if script is already added
    if (document.querySelector('script[src*="translate.google.com"]')) {
      return;
    }

    const addScript = () => {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    addScript();
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="notranslate" 
      style={{ 
        position: "fixed", 
        bottom: "20px", 
        right: "20px", 
        zIndex: -1,
        opacity: 0,
        pointerEvents: "none" 
      }} 
    />
  );
}

// ─── Language Switcher ──────────────────────────────────────────────

let isChanging = false;

export function changeLanguage(langCode: string) {
  if (isChanging) return;
  isChanging = true;

  // 1. Set the cookie - This is the most reliable way
  // Format: /source_lang/target_lang
  const cookieValue = `/en/${langCode}`;
  const domain = window.location.hostname;
  
  // Set cookie for both current domain and as a general path
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
  
  // 2. Try to trigger the select element if it exists (for immediate effect in some cases)
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  }

  // 3. Reload the page to apply translation
  // Google Translate usually needs a fresh load to pick up the googtrans cookie reliably
  window.location.reload();

  // Reset after a short delay (though reload will happen anyway)
  setTimeout(() => {
    isChanging = false;
  }, 1000);
}
