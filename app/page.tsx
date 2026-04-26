import { HeroSection } from "@/features/home";
import { StatsBar } from "@/features/home";
import { FeaturesGrid } from "@/features/home";
import { HowItWorks } from "@/features/home";
import { FAQAccordion } from "@/features/home";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsBar />
      <div className="flex flex-col relative z-10 w-full">
        <FeaturesGrid />
        <HowItWorks />
        <FAQAccordion />
      </div>
    </div>
  );
}
