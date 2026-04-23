import { HeroSection } from "@/features/home/components/HeroSection";
import { StatsBar } from "@/features/home/components/StatsBar";
import { FeaturesGrid } from "@/features/home/components/FeaturesGrid";
import { HowItWorks } from "@/features/home/components/HowItWorks";
import { FAQAccordion } from "@/features/home/components/FAQAccordion";

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
