import { TimelineEvent } from "@/types/election";

export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    phase: "Registration",
    date: "2024-10-15",
    title: "Voter Registration Deadline",
    description: "Last day to register to vote or update your address for the upcoming General Elections.",
    details: ["Submit Form 6 online via NVSP", "Check name in electoral roll", "Corrections via Form 8"],
  },
  {
    id: "2",
    phase: "Campaigning",
    date: "2024-11-01",
    title: "Official Campaign Period Begins",
    description: "Candidates can officially begin public rallies, debates, and door-to-door campaigning.",
    details: ["Model Code of Conduct enforced", "Manifestos released"],
  },
  {
    id: "3",
    phase: "Campaigning",
    date: "2024-11-10",
    title: "Campaign Silence Period",
    description: "Campaigning ends 48 hours prior to the close of polls. No public meetings or rallies allowed.",
    details: ["Strict enforcement of Section 126", "Dry days declared"],
  },
  {
    id: "4",
    phase: "Polling",
    date: "2024-11-12",
    title: "Polling Day - Phase 1",
    description: "First phase of voting begins. Polls open from 7:00 AM to 6:00 PM.",
    details: ["Carry valid ID proof", "Find your polling booth", "Verify EVM & VVPAT slip"],
  },
  {
    id: "5",
    phase: "Results",
    date: "2024-11-20",
    title: "Counting & Results Declaration",
    description: "Counting of votes begins at 8:00 AM. Final results to be declared by evening.",
    details: ["Live updates on ECI website", "Victory processions regulated"],
  },
];
