import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { GoogleTranslate } from "@/components/layout/GoogleTranslate";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "VoteGuide — AI Election Assistant",
  description: "Your intelligent conversational interface for the election process, timelines, voter registration, and rights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} dark`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/30">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <GoogleTranslate />
        </AuthProvider>
      </body>
    </html>
  );
}
