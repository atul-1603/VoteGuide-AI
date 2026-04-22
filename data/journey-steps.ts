import { JourneyStep } from "@/types/election";

export const journeySteps: JourneyStep[] = [
  {
    id: "step-1",
    order: 1,
    title: "Verify Eligibility",
    description: "Ensure you are an Indian citizen, 18 years of age or older on the qualifying date.",
  },
  {
    id: "step-2",
    order: 2,
    title: "Register on NVSP Portal",
    description: "Submit Form 6 online or offline to get your name added to the electoral roll.",
    externalLink: "https://voters.eci.gov.in/",
  },
  {
    id: "step-3",
    order: 3,
    title: "Verify Name in Voter List",
    description: "Check if your name appears in the final electoral roll published for your constituency.",
    externalLink: "https://electoralsearch.eci.gov.in/",
  },
  {
    id: "step-4",
    order: 4,
    title: "Find Your Polling Station",
    description: "Locate the exact booth where you need to go to cast your vote on election day.",
  },
  {
    id: "step-5",
    order: 5,
    title: "Prepare Valid ID Proof",
    description: "Ensure you have your EPIC (Voter ID) or an alternative approved document like Aadhaar or PAN.",
  },
  {
    id: "step-6",
    order: 6,
    title: "Cast Your Vote",
    description: "Visit the polling station on election day, verify your identity, and press the button on the EVM.",
  },
];
