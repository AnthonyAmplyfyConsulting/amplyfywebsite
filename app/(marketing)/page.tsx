import { HeroSection } from "@/components/hero-section";
import { TrustBar } from "@/components/trust-bar";
import { ExpertiseSection } from "@/components/expertise-section";
import { ProcessSteps } from "@/components/process-steps";
import { Testimonials } from "@/components/testimonials";
import { CaseStudy } from "@/components/case-study";
import { PricingSection } from "@/components/pricing-section";
import { ContactSection } from "@/components/contact-section";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-[#ff9900] selection:text-white">
      <HeroSection />
      <TrustBar />
      <div id="expertise">
        <ExpertiseSection />
      </div>
      <div id="process">
        <ProcessSteps />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="results">
        <CaseStudy />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  );
}
