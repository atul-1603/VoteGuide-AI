"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

const faqs = [
  {
    question: "How do I register to vote?",
    answer: "You can register online via the NVSP portal or by filling out Form 6. You need passport size photos, age proof, and address proof.",
  },
  {
    question: "What documents are valid as Voter ID?",
    answer: "Apart from the EPIC (Voter ID card), you can use Aadhaar, PAN Card, Driving License, Passport, or Bank Passbook with a photograph.",
  },
  {
    question: "How do I find my polling station?",
    answer: "You can use the 'Find Station' feature on our app, or check the ECI portal by entering your EPIC number.",
  },
  {
    question: "Can I vote if I am not in my home state?",
    answer: "Generally, you must vote at the polling station where you are registered. If you have moved permanently, you must update your address to vote in your new location.",
  },
  {
    question: "What are the timings for voting?",
    answer: "Polling stations are usually open from 7:00 AM to 6:00 PM. However, timings may vary slightly depending on your constituency.",
  },
  {
    question: "Is there any provision for senior citizens or PwD?",
    answer: "Yes, senior citizens (85+) and Persons with Disabilities (PwD) have the option for home voting or priority access at polling booths with wheelchair assistance.",
  },
];

export function FAQAccordion() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Quick answers to common queries about the voting process.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                <AccordionTrigger className="text-left text-lg font-medium text-white hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
