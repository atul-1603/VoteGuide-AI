import { TimelineEvent } from "@/types/election";

export const timelineEvents: TimelineEvent[] = [
  // Pre-Election Phase
  {
    id: "voter-list",
    phase: "Registration",
    date: "2026-02-01",
    endDate: "2026-02-28",
    title: "Voter List Finalization",
    description: "The Election Commission finalizes the electoral rolls. Citizens should verify their names during this period.",
    details: ["Verification of names in roll", "Final inclusion of new voters", "Correction of existing entries"],
  },
  {
    id: "announcement",
    phase: "Registration",
    date: "2026-03-15",
    title: "Election Announcement",
    description: "Official announcement of election dates by the Election Commission of India (ECI).",
    details: ["Model Code of Conduct (MCC) comes into force", "Detailed schedule release", "Press briefing by CEC"],
  },
  {
    id: "nomination",
    phase: "Registration",
    date: "2026-03-30",
    endDate: "2026-04-06",
    title: "Nomination Filing",
    description: "Candidates file their nomination papers with the Returning Officer.",
    details: ["Filing of Form 2A/2B", "Security deposit payment", "Affidavit submission (Form 26)"],
  },
  {
    id: "scrutiny",
    phase: "Registration",
    date: "2026-04-07",
    title: "Scrutiny of Nominations",
    description: "Examination of nomination papers to ensure eligibility and technical correctness.",
    details: ["Verification of affidavits", "Objections by other candidates", "Final list of valid nominations"],
  },
  {
    id: "withdrawal",
    phase: "Registration",
    date: "2026-04-09",
    title: "Withdrawal Deadline",
    description: "Last date for candidates to withdraw their names from the election.",
    details: ["Final list of contesting candidates", "Allotment of symbols to independents"],
  },

  // Campaign Phase
  {
    id: "campaign-period",
    phase: "Campaigning",
    date: "2026-03-15",
    endDate: "2026-04-29",
    title: "Campaign Period",
    description: "Official campaigning by political parties and candidates.",
    details: ["Public rallies and manifestos", "Door-to-door campaigning", "Media advertisements"],
  },
  {
    id: "campaign-silence",
    phase: "Campaigning",
    date: "2026-04-07", // 48h before Phase 1
    title: "Campaign Silence (Phase 1)",
    description: "Campaigning ends 48 hours prior to the close of polls for Phase 1 states.",
    details: ["Ban on public meetings", "Restricted media coverage", "Prohibition of bulk SMS/calls"],
    states: ["Assam", "Kerala", "Puducherry"],
  },
  {
    id: "exit-poll-ban",
    phase: "Campaigning",
    date: "2026-04-09",
    endDate: "2026-04-29",
    title: "Exit Poll Ban",
    description: "Publication or broadcast of exit poll results is strictly prohibited during the polling period.",
    details: ["Applies to all media outlets", "Ensures fair voting sentiment", "Penalty for violations"],
  },

  // Polling Phase
  {
    id: "polling-p1",
    phase: "Polling",
    date: "2026-04-09",
    title: "Polling Day - Phase 1",
    description: "First phase of voting. Polls open from 7:00 AM to 6:00 PM.",
    details: ["Vote casting in booths", "Identity verification with EPIC", "Indelible ink marking"],
    states: ["Assam", "Kerala", "Puducherry"],
  },
  {
    id: "polling-p2",
    phase: "Polling",
    date: "2026-04-23",
    title: "Polling Day - Phase 2",
    description: "Second phase of voting.",
    details: ["Vote casting in booths", "Identity verification with EPIC", "Indelible ink marking"],
    states: ["Tamil Nadu", "West Bengal (Phase 1)"],
  },
  {
    id: "polling-p3",
    phase: "Polling",
    date: "2026-04-29",
    title: "Polling Day - Phase 3",
    description: "Third and final phase of voting.",
    details: ["Vote casting in booths", "Identity verification with EPIC", "Indelible ink marking"],
    states: ["West Bengal (Phase 2)"],
  },

  // Results Phase
  {
    id: "results",
    phase: "Results",
    date: "2026-05-04",
    title: "Counting & Results Declaration",
    description: "Counting of votes and official declaration of winning candidates.",
    details: ["Strongroom opening in presence of observers", "EVM counting rounds", "VVPAT slip verification"],
  },
];
