"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calendar, Route, MapPin, Bell, Globe2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI Chat Assistant",
    description: "Get instant answers about voter registration, ID requirements, and election laws powered by Gemini 2.5 Flash.",
    icon: MessageSquare,
  },
  {
    title: "Election Timeline",
    description: "Stay updated with a complete schedule of election phases, polling dates, and result declarations.",
    icon: Calendar,
  },
  {
    title: "Voter Journey",
    description: "Track your progress from registration to casting your ballot with a personalized checklist.",
    icon: Route,
  },
  {
    title: "Station Finder",
    description: "Locate your nearest polling booth and get step-by-step directions using Google Maps.",
    icon: MapPin,
  },
  {
    title: "Calendar Reminders",
    description: "Add important election events directly to your Google Calendar so you never miss a deadline.",
    icon: Bell,
  },
  {
    title: "Multilingual Support",
    description: "Access all information in English, Hindi, Marathi, Tamil, and Bengali with real-time translation.",
    icon: Globe2,
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">Everything You Need to Vote</h2>
          <p className="text-lg text-muted-foreground">Comprehensive tools designed to make your electoral participation seamless, informed, and accessible.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-white/5 backdrop-blur-sm hover:border-primary/50 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
