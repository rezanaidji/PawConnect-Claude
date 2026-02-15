import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ROICalculator } from '../components/landing/ROICalculator';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { Footer } from '../components/landing/Footer';
import FloatingChatWidget from '../components/FloatingChatWidget';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <ROICalculator />
        <SocialProofSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
}
