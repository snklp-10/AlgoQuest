"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

const perks = [
  "7-day free trial, no credit card",
  "Cancel anytime, no questions",
  "Access to all 200+ problems",
  "AI assistant included",
];

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-blue-400/8 rounded-full blur-3xl" />

      <div
        ref={ref}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium mb-8">
            <Zap size={14} />
            Start your journey today
          </div>

          <h2 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Ready to Crack Your{" "}
            <span className="gradient-text">Dream Interview?</span>
          </h2>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ engineers who've used AlgoMind to land jobs at Google,
            Meta, Amazon, and more. Your offer letter is waiting.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-300/40 hover:shadow-blue-300/60 transition-all duration-200 gap-2 px-8 text-base h-12"
            >
              Start Learning Free
              <ArrowRight size={18} />
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 px-8 text-base h-12 gap-2"
            >
              View Pricing
            </Button> */}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {perks.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Floating company logos suggestion */}
        <div
          className={`mt-16 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="text-xs text-slate-400 mb-5 uppercase tracking-widest font-semibold">
            Our learners work at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              "Google",
              "Meta",
              "Amazon",
              "Apple",
              "Netflix",
              "Microsoft",
              "Stripe",
              "Airbnb",
            ].map((company) => (
              <span
                key={company}
                className="text-slate-300 font-bold text-lg tracking-tight hover:text-slate-400 transition-colors cursor-default"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
