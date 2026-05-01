"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Patel",
    role: "SWE @ Google",
    avatar: "AP",
    avatarColor: "bg-emerald-400",
    rating: 5,
    text: "AlgoMind completely changed how I prepared. The visual BST traversals finally made me understand why inorder gives sorted output. Went from 0 to FAANG in 3 months.",
    company: "Google",
  },
  {
    name: "Marcus Thompson",
    role: "Backend Engineer @ Meta",
    avatar: "MT",
    avatarColor: "bg-blue-400",
    rating: 5,
    text: "The AI assistant is incredibly smart. When I was stuck on a DP problem at midnight, it didn't just give me the answer — it walked me through the thought process.",
    company: "Meta",
  },
  {
    name: "Yuki Tanaka",
    role: "Intern @ Amazon",
    avatar: "YT",
    avatarColor: "bg-amber-400",
    rating: 5,
    text: "The gamification kept me consistent. I maintained a 60-day streak and solved 150+ problems. The leaderboard made it feel like a game, not a chore.",
    company: "Amazon",
  },
  {
    name: "Carlos Mendes",
    role: "SWE @ Stripe",
    avatar: "CM",
    avatarColor: "bg-violet-400",
    rating: 5,
    text: "The personalized roadmap was spot on. It identified my weakness in graph algorithms early and scheduled them perfectly. Saved me weeks of aimless grinding.",
    company: "Stripe",
  },
  {
    name: "Priya Nair",
    role: "Senior SWE @ Netflix",
    avatar: "PN",
    avatarColor: "bg-rose-400",
    rating: 5,
    text: "Best DSA platform I've tried. The Dijkstra's visualization alone is worth it — watching shortest paths update in real-time makes the algorithm click instantly.",
    company: "Netflix",
  },
  {
    name: "David Kim",
    role: "SWE @ Microsoft",
    avatar: "DK",
    avatarColor: "bg-sky-400",
    rating: 5,
    text: "The code sync feature is brilliant — seeing which line of code corresponds to which step in the visualization saved me hours of debugging my understanding.",
    company: "Microsoft",
  },
];

function TestimonialCard({
  t,
  index,
  visible,
}: {
  t: (typeof testimonials)[0];
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className={`card-hover rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col gap-4 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Quote size={20} className="text-blue-200" />
      <p className="text-slate-600 text-sm leading-relaxed flex-1">
        "{t.text}"
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-sm font-bold text-white`}
          >
            {t.avatar}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
            <div className="text-xs text-slate-500">{t.role}</div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
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
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-amber-50 text-amber-600 border-amber-200 mb-4">
            Success Stories
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            From <span className="gradient-text">Our Community</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Thousands of engineers have used AlgoMind to land their dream jobs
            at top companies.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[
                "bg-emerald-400",
                "bg-blue-400",
                "bg-amber-400",
                "bg-violet-400",
                "bg-rose-400",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${c} border-2 border-white -ml-2 first:ml-0`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 font-medium">
              50,000+ learners trust AlgoMind
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
