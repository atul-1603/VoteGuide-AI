"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

import { 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Bell, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  LogOut,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timelineEvents } from "@/data/timeline";
import { TimelineEvent } from "@/types/election";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user, loading, logOut } = useAuthStore();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const event = timelineEvents.find(e => {
        const eventDate = new Date(e.date);
        const endDate = e.endDate ? new Date(e.endDate) : null;
        if (endDate) return now <= endDate;
        return now <= eventDate;
      });

      if (event) {
        setNextEvent(event);
        const eventDate = new Date(event.date);
        const endDate = event.endDate ? new Date(event.endDate) : null;
        const isOngoing = endDate && now >= eventDate && now <= endDate;
        const targetTime = isOngoing ? endDate.getTime() : eventDate.getTime();
        const diff = targetTime - now.getTime();

        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          });
        }
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Calculate overall progress through timeline
  const completedCount = timelineEvents.filter(e => new Date(e.date) < new Date()).length;
  const progressPercent = (completedCount / timelineEvents.length) * 100;

  return (
    <div className="flex-1 bg-background pb-12">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 p-0.5">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">
                Welcome back, {user.displayName?.split(" ")[0] || "Citizen"}!
              </h1>
              <p className="text-muted-foreground">Stay informed and ready for the 2026 General Elections.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => router.push("/chat")}>
              <MessageSquare className="w-4 h-4 mr-2" /> Ask AI
            </Button>
            <Button variant="outline" className="border-white/10 text-destructive hover:bg-destructive/10" onClick={logOut}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Countdown Card */}
            <Card 
              className="bg-gradient-to-br from-primary/20 to-secondary/10 border-white/10 overflow-hidden"
              role="region"
              aria-live="polite"
              aria-label={`Countdown: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining for ${nextEvent?.endDate && new Date() >= new Date(nextEvent.date) ? nextEvent.title + ' end' : nextEvent?.title}`}
            >
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2">LIVE COUNTDOWN</Badge>
                    <h2 className="text-2xl font-bold text-white">
                      {nextEvent?.endDate && new Date() >= new Date(nextEvent.date) 
                        ? `${nextEvent.title} Ends In:` 
                        : `Next: ${nextEvent?.title}`}
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      The election cycle is moving fast. Ensure you are ready before the next phase begins.
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Days", value: timeLeft.days },
                      { label: "Hrs", value: timeLeft.hours },
                      { label: "Min", value: timeLeft.minutes },
                      { label: "Sec", value: timeLeft.seconds },
                    ].map((unit) => (
                      <div key={unit.label} className="flex flex-col items-center bg-background/40 backdrop-blur-md p-3 rounded-xl border border-white/5 min-w-[70px]">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          {unit.value.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="bg-card/40 border-white/5 hover:bg-card/60 transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                onClick={() => router.push("/find-station")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push("/find-station");
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Find My Booth"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform" aria-hidden="true">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">Find My Booth</h3>
                    <p className="text-xs text-muted-foreground">Locate your polling station on the map.</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </CardContent>
              </Card>
              <Card 
                className="bg-card/40 border-white/5 hover:bg-card/60 transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none" 
                onClick={() => router.push("/journey")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push("/journey");
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Voter Journey"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform" aria-hidden="true">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">Voter Journey</h3>
                    <p className="text-xs text-muted-foreground">Check your registration progress.</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card/40 border-white/5">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-tighter">AI Assistant</CardDescription>
                  <CardTitle className="text-2xl text-white">12 Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last chat: 2h ago
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/40 border-white/5">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-tighter">Election Progress</CardDescription>
                  <CardTitle className="text-2xl text-white">{Math.round(progressPercent)}%</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <Progress 
                    value={progressPercent} 
                    className="h-1.5 bg-white/5" 
                    aria-label={`Election progress: ${Math.round(progressPercent)}% completed`}
                  />
                </CardContent>
              </Card>
              <Card className="bg-card/40 border-white/5">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase font-bold tracking-tighter">Nearby Stations</CardDescription>
                  <CardTitle className="text-2xl text-white">3 Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
                    View list <ArrowRight className="w-3 h-3" />
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Timeline Snapshot */}
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Timeline Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {timelineEvents.slice(completedCount > 0 ? completedCount - 1 : 0, (completedCount > 0 ? completedCount - 1 : 0) + 3).map((event) => {
                    const isPast = new Date(event.date) < new Date();
                    const isOngoing = event.endDate && new Date() >= new Date(event.date) && new Date() <= new Date(event.endDate);
                    return (
                      <div key={event.id} className="p-4 flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isOngoing ? "bg-green-400 animate-pulse" : isPast ? "bg-muted" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isPast && !isOngoing ? "text-muted-foreground line-through" : "text-white"}`}>
                            {event.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase">{event.phase} • {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        {isOngoing && <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/20">LIVE</Badge>}
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-white/5">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-white" onClick={() => router.push("/timeline")}>
                    View Full Timeline <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications / Reminders */}
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" /> Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
                  <p className="text-xs font-bold text-white">Check Your Booth</p>
                  <p className="text-[10px] text-muted-foreground">Ensure your location is updated in the app for local alerts.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
                  <p className="text-xs font-bold text-white">ID Verification</p>
                  <p className="text-[10px] text-muted-foreground">Keep your EPIC card or Aadhaar ready for polling.</p>
                </div>
              </CardContent>
            </Card>

            {/* Language Preference */}
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" /> Language Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="text-sm text-white">English (Global)</span>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => (window as any).google?.translate?.TranslateElement?.showDropdown?.()}>
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
