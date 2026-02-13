import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WaveDivider from "@/components/ui/WaveDivider";
import Problem from "@/components/landing/Problem";
import PullQuote from "@/components/landing/PullQuote";
import HowItWorks from "@/components/landing/HowItWorks";
import Coverage from "@/components/landing/Coverage";
import Moat from "@/components/landing/Moat";
import CompanyShowcase from "@/components/landing/CompanyShowcase";
import AppPreview from "@/components/landing/AppPreview";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import WaitlistProvider from "@/components/landing/WaitlistProvider";

export default function Home() {
  return (
    <WaitlistProvider>
      <Navbar />
      <Hero />
      {/* Hero (cream) → PullQuote (ink) */}
      <WaveDivider
        bgColor="var(--color-cream)"
        fillColor="var(--color-ink)"
        path="M0,20 C240,60 480,0 720,40 C960,70 1200,10 1440,30 L1440,60 L0,60Z"
      />
      <PullQuote />
      {/* PullQuote (ink) → Problem (cream) */}
      <WaveDivider
        bgColor="var(--color-ink)"
        fillColor="var(--color-cream)"
        path="M0,30 C180,60 360,0 540,40 C720,70 900,10 1080,45 C1260,70 1380,20 1440,35 L1440,60 L0,60Z"
      />
      <Problem />
      {/* Problem (cream) → CompanyShowcase (ink) */}
      <WaveDivider
        bgColor="var(--color-cream)"
        fillColor="var(--color-ink)"
        path="M0,35 C200,5 400,55 600,25 C800,0 1000,50 1200,20 C1350,0 1420,40 1440,30 L1440,60 L0,60Z"
      />
      <CompanyShowcase />
      {/* CompanyShowcase (ink) → HowItWorks (paper) */}
      <WaveDivider
        bgColor="var(--color-ink)"
        fillColor="var(--color-paper)"
        path="M0,40 C300,10 600,50 900,20 C1100,0 1300,40 1440,25 L1440,60 L0,60Z"
      />
      <HowItWorks />
      <WaveDivider
        bgColor="var(--color-paper)"
        fillColor="var(--color-ink)"
        path="M0,40 C300,10 600,50 900,20 C1100,0 1300,40 1440,25 L1440,60 L0,60Z"
      />
      <AppPreview />
      <WaveDivider
        bgColor="var(--color-ink)"
        fillColor="var(--color-cream)"
        path="M0,20 C360,55 720,5 1080,40 C1260,55 1380,15 1440,30 L1440,60 L0,60Z"
      />
      <Moat />
      {/* Moat (cream) → Coverage (ink) */}
      <WaveDivider
        bgColor="var(--color-cream)"
        fillColor="var(--color-ink)"
        path="M0,35 C200,5 400,55 600,25 C800,0 1000,50 1200,20 C1350,0 1420,40 1440,30 L1440,60 L0,60Z"
      />
      <Coverage />
      <WaveDivider
        bgColor="var(--color-ink)"
        fillColor="var(--color-cream)"
        path="M0,25 C240,55 480,10 720,40 C960,65 1200,15 1440,35 L1440,60 L0,60Z"
      />
      <Pricing />
      <WaveDivider
        bgColor="var(--color-cream)"
        fillColor="var(--color-ink)"
        path="M0,30 C360,0 720,55 1080,15 C1260,0 1380,40 1440,25 L1440,60 L0,60Z"
      />
      <CTA />
      <Footer />
    </WaitlistProvider>
  );
}
