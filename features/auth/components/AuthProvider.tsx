"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuthStore } from "@/features/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        const token = await user.getIdToken();
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        const cookieString = `session=${token}; path=/; max-age=3600; SameSite=Lax${secure}`;
        
        const isSessionMissing = !document.cookie.includes('session=');
        document.cookie = cookieString;
        
        if (isSessionMissing) {
          router.refresh();
        }
      } else {
        const isSessionPresent = document.cookie.includes('session=');
        document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        
        if (isSessionPresent) {
          router.refresh();
        }
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, router]);

  return <>{children}</>;
}
