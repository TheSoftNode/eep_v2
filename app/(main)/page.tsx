import BenefitsSection from "@/components/Landing/Benefits/BenefitsSection";
import MasterySection from "@/components/Landing/Benefits/MasterySection";
import DynamicCtaSection from "@/components/Landing/CTA/DynamicCtaSection";
import EEPFeatures from "@/components/Landing/Features/EEPFeatures";
import HeroSection from "@/components/Landing/Hero/HeroSection";
import HowItWorksSection from "@/components/Landing/HowItWorks/HowItWorks";
import PartnersSection from "@/components/Landing/Partners/PartnersSection";
import PricingSectionRefined from "@/components/Landing/Pricing/PricingSectionRefined";
import { TestimonialsSection } from "@/components/Landing/Testmonials/TestimonialsSection";
import Footer from "@/components/Layout/Footer/Footer";
import Navbar from "@/components/Layout/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <HeroSection />
      <EEPFeatures />
      <HowItWorksSection />
      <BenefitsSection />
      <MasterySection />
      <PartnersSection />
      <PricingSectionRefined />
      <TestimonialsSection />
      <DynamicCtaSection />

      <Footer />
    </>
  );
}
