import AIAssistant from "@/components/landing/AIAssistant";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Gamification from "@/components/landing/Gamification";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import Roadmap from "@/components/landing/Roadmap";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Visualizer from "@/components/landing/Visualizer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Visualizer />
        <Gamification />
        <AIAssistant />
        <Roadmap />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
