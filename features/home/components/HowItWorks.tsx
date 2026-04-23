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
    <section className="py-24 bg-card/30 border-y border-white/5">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-lg text-muted-foreground">Three simple steps to become an empowered and prepared voter.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-white/10" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                  <span className="font-serif text-4xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
