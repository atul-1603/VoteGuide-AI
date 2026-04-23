import Link from "next/link";
import { Vote } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background/80 py-12">
      <div className="container grid gap-8 md:grid-cols-4">
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-primary font-serif text-2xl font-bold" aria-label="VoteGuide Home">
            <Vote className="h-6 w-6" aria-hidden="true" />
            <span>VoteGuide</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm">
            Empowering citizens with AI-driven election guidance. Your secure, private, and informative companion for the democratic process.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-foreground mb-2">Features</h4>
          <Link href="/timeline" className="text-sm text-muted-foreground hover:text-primary transition-colors">Timeline</Link>
          <Link href="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link>
          <Link href="/find-station" className="text-sm text-muted-foreground hover:text-primary transition-colors">Polling Stations</Link>
          <Link href="/journey" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Journey</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-foreground mb-2">Legal</h4>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          <p className="text-xs text-muted-foreground mt-4">
            Built with Google Gemini + Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
