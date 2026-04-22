"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, MessageSquare, Bell, Calendar as CalendarIcon, Route, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!user) return null; // Handled by middleware

  return (
    <div className="flex-1 bg-background/50 py-12 mesh-bg">
      <div className="container max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">
            {getGreeting()}, {user.displayName?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">Here&apos;s your personalized voter dashboard.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Countdown Card */}
          <Card className="bg-card/60 backdrop-blur-md border-white/10 flex flex-col items-center justify-center py-6 text-center shadow-lg">
            <Clock className="w-10 h-10 text-secondary mb-4 opacity-80" />
            <h3 className="font-serif text-2xl font-bold text-white mb-1">24 Days</h3>
            <p className="text-sm text-muted-foreground">until next election</p>
          </Card>

          {/* Journey Summary Card */}
          <Card className="bg-card/60 backdrop-blur-md border-white/10 p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-white">Voter Journey</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">You have 5 steps remaining to become voter-ready.</p>
            </div>
            <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5">
              <Link href="/journey">Resume Journey</Link>
            </Button>
          </Card>

          {/* Reminders Card */}
          <Card className="bg-card/60 backdrop-blur-md border-white/10 p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-white">Upcoming Reminders</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                <li className="flex gap-2"><span className="text-secondary">•</span> Registration Deadline (Oct 15)</li>
                <li className="flex gap-2"><span className="text-secondary">•</span> Polling Day (Nov 12)</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Chat */}
          <Card className="bg-card/60 backdrop-blur-md border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-primary" /> Recent AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 p-3 rounded-lg rounded-tr-none ml-auto max-w-[85%]">
                  <p className="text-sm text-white">What ID do I need to vote?</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-lg rounded-tl-none mr-auto max-w-[85%] border border-primary/20">
                  <p className="text-sm text-white/90">You can use your EPIC (Voter ID), Aadhaar card, PAN card, or Driving License. Would you like a full list?</p>
                </div>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                <Link href="/chat">Continue Chat</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/60 backdrop-blur-md border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              <CardDescription>Fast access to essential tools</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                <Link href="/chat">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Ask AI
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                <Link href="/find-station">
                  <MapPin className="w-6 h-6 text-primary" />
                  Find Station
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                <Link href="/timeline">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  Timeline
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                <Link href="/journey">
                  <Route className="w-6 h-6 text-primary" />
                  My Journey
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
