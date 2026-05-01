"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, Bot, Map, Trophy, Zap, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Interactive Visualizations",
    description:
      "Watch algorithms execute step-by-step with animated data structures. Pause, rewind, and inspect every operation.",
    badge: "Visual",
    color: "blue",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-600 border-blue-200",
    detail: "15+ data structures",
  },
  {
    icon: Bot,
    title: "AI Code Assistant",
    description:
      "Get contextual hints, bug fixes, and explanations from our AI tutor. It understands your code and guides you intelligently.",
    badge: "AI-Powered",
    color: "emerald",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    detail: "GPT-4 powered",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    description:
      "Adaptive learning paths tailored to your skill level, target company, and available time. Never feel lost again.",
    badge: "Adaptive",
    color: "violet",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badgeBg: "bg-violet-50 text-violet-600 border-violet-200",
    detail: "100+ curated paths",
  },
  {
    icon: Trophy,
    title: "Gamified Challenges",
    description:
      "Earn XP, climb leaderboards, unlock badges, and compete in weekly coding contests. Learning should be fun.",
    badge: "Gamified",
    color: "amber",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    detail: "500+ challenges",
  },
  {
    icon: Zap,
    title: "Real Interview Simulation",
    description:
      "Practice under timed conditions with company-specific problem sets. Get detailed performance analysis.",
    badge: "Mock Interviews",
    color: "rose",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-600 border-rose-200",
    detail: "FAANG focused",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Deep insights into your performance trends, weak spots, and mastery levels across topics.",
    badge: "Analytics",
    color: "sky",
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50 text-sky-600 border-sky-200",
    detail: "Detailed metrics",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group card-hover rounded-2xl p-6 bg-white border border-slate-100 shadow-sm transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <feature.icon size={22} className={feature.iconColor} />
        </div>
        <Badge className={`${feature.badgeBg} border text-[11px]`}>
          {feature.badge}
        </Badge>
      </div>
      <h3 className="font-semibold text-slate-800 text-base mb-2">
        {feature.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">
        {feature.description}
      </p>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        {feature.detail}
      </div>
    </div>
  );
}

export default function Features() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleVisible(true);
      },
      { threshold: 0.1 },
    );
    if (titleRef.current) obs.observe(titleRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
            Everything You Need
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Built for Serious <span className="gradient-text">Learners</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            A complete ecosystem designed to take you from beginner to
            interview-ready, faster than any other platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
