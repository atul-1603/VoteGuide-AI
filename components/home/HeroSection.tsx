"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mesh-bg pt-16">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-sm"
          >
            Know Your <span className="text-secondary">Vote.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/80 max-w-xl"
          >
            Your intelligent guide to the democratic process. AI-powered insights, polling station finder, and a personalized voter journey.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-lg h-14">
              <Link href="/chat">
                Chat with AI <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-white/20 hover:bg-white/10 hover:text-white text-white">
              <Link href="/timeline">View Timeline</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex justify-end"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Glassmorphism card for countdown */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl shadow-primary/20 flex flex-col items-center justify-center gap-6">
              <CalendarDays className="h-16 w-16 text-secondary opacity-80" />
              <div className="text-center">
                <h3 className="font-serif text-2xl font-semibold text-white mb-2">Next Election In</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">24</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider">Days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">12</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider">Hrs</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">45</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider">Min</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">09</span>
                    <span className="text-xs text-white/60 uppercase tracking-wider">Sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
