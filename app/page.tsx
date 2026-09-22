import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { StorySection } from "@/components/sections/StorySection";
import { WednesdaySection } from "@/components/sections/WednesdaySection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { ServicesHomeSection } from "@/components/sections/ServicesHomeSection";
import { NetworkSection } from "@/components/sections/NetworkSection";
import { SocialSection } from "@/components/sections/SocialSection";
import { JoinSection } from "@/components/sections/JoinSection";

export default function HomePage() {
  return (
    <main id="inicio">
      <Header />
      <HeroSection />
      <div className="chapter-ribbon" aria-hidden="true" />
      <ValuesSection />
      <StorySection />
      <div className="chapter-ribbon" aria-hidden="true" />
      <WednesdaySection />
      <ProgramsSection />
      <ServicesHomeSection />
      <NetworkSection />
      <SocialSection />
      <JoinSection />
      <Footer />
    </main>
  );
}
