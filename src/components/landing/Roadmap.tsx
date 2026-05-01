"use client";
import { useInView } from "../../hooks/useInView";
import {
  ArrowRight,
  Search,
  Binary,
  GitBranch,
  Layers,
  Zap,
  Target,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Assess Your Level",
    description:
      "Take a quick diagnostic to identify your current skill level and knowledge gaps.",
    color: "from-sky-600 to-cyan-600",
  },
  {
    icon: Target,
    title: "Set Your Goal",
    description:
      "Choose your target: FAANG, startup, competitive programming, or custom.",
    color: "from-emerald-600 to-teal-600",
  },
  {
    icon: Binary,
    title: "Follow Your Path",
    description:
      "Get a personalized roadmap with daily challenges tailored to your pace and goals.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Level Up Daily",
    description:
      "Solve problems, earn XP, maintain streaks, and climb the leaderboard.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: GitBranch,
    title: "Master Patterns",
    description:
      "AI identifies patterns in your solutions and reinforces them with targeted practice.",
    color: "from-sky-600 to-emerald-600",
  },
  {
    icon: Rocket,
    title: "Crush Interviews",
    description:
      "Mock interviews, company-specific tracks, and confidence to ace any technical round.",
    color: "from-amber-500 to-rose-500",
  },
];

export default function Roadmap() {
  const { ref, isVisible } = useInView();

  return (
    <section id="roadmap" className="relative py-28 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-400/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-sm font-medium text-rose-700 mb-6">
            Your Journey
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-slate-900">
            From Zero to
            <br />
            <span className="gradient-text">Interview Ready</span>
          </h2>
          <p className="text-slate-500 text-lg">
            A clear, structured path that adapts to you.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`group relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="bg-white rounded-2xl p-7 h-full border border-slate-200/80 hover-card">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-slate-300 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-sky-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow for desktop */}
              {i < steps.length - 1 && i % 3 !== 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-linear-to-br from-sky-50 to-emerald-50 rounded-2xl p-10 max-w-2xl mx-auto relative overflow-hidden border border-sky-100">
            <div className="relative z-10">
              <Layers className="w-10 h-10 text-sky-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Ready to Start Your Quest?
              </h3>
              <p className="text-slate-500 mb-6">
                Join 150,000+ developers mastering DSA the fun way.
              </p>
              <a
                href="#"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-sky-600 to-emerald-600 font-bold text-white"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
