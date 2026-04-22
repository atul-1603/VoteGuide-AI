"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Eligible Voters", value: "900M+" },
  { label: "Constituencies", value: "543" },
  { label: "Election Phases", value: "6" },
  { label: "Free For All", value: "100%" },
];

export function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-background/50 backdrop-blur-sm py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <span className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
