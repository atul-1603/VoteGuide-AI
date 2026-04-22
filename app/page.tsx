import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQAccordion } from "@/components/home/FAQAccordion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <HowItWorks />
      <FAQAccordion />
    </div>
  );
}
