"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Vote, Download } from "lucide-react";

export function ShareCard({ userName }: { userName: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#0A1628", scale: 2 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "voter-ready-badge.png";
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 gap-6 p-6 border border-primary/20 bg-primary/5 rounded-3xl backdrop-blur-md">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-serif font-bold text-white mb-2">Congratulations! 🎉</h3>
        <p className="text-muted-foreground">You are officially Voter Ready. Share your commitment to democracy.</p>
      </div>

      {/* Card to Export */}
      <div 
        ref={cardRef} 
        className="w-[350px] aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary/50 p-1 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-[2px] bg-background rounded-xl z-0" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 blur-3xl z-0" />
        
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <Vote className="w-10 h-10 text-white" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-white mb-1 uppercase tracking-wide">Voter Ready</h4>
          <p className="text-muted-foreground text-sm font-medium mb-6">#VoteGuide2026</p>
          <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
            <p className="text-white font-medium">{userName}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={downloadCard} disabled={isExporting} className="bg-primary hover:bg-primary/90 text-white">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Saving..." : "Download Badge"}
        </Button>
      </div>
    </div>
  );
}
