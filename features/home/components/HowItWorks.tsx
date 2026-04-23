"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Sign In securely",
    description: "Use your Google account to log in and save your progress securely.",
  },
  {
    step: "2",
    title: "Follow Your Journey",
    description: "Complete your personalized checklist from registration to voting day.",
  },
  {
    step: "3",
    title: "Cast Your Vote",
    description: "Find your polling station, carry the right ID, and make your voice heard.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-card/30 border-y border-white/5 relative">
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">How It Works</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">Three simple steps to become an empowered and prepared voter.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (hidden on small screens) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(26,86,219,0.2)] group-hover:scale-110 transition-transform duration-300">
                  <span className="font-serif text-4xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed px-4">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
