import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import Roadmap from "@/components/landing/Roadmap";
import Showcase from "@/components/landing/Showcase";
import Testimonials from "@/components/landing/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Testimonials />
      <Roadmap />
      <Footer />
    </div>
  );
}
