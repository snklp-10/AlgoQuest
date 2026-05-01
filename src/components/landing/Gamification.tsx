"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Target, Award, Zap } from "lucide-react";

const leaderboard = [
  {
    rank: 1,
    name: "Alex Chen",
    avatar: "AC",
    xp: 12450,
    streak: 47,
    badge: "Legend",
    color: "bg-amber-400",
  },
  {
    rank: 2,
    name: "Priya Shah",
    avatar: "PS",
    xp: 11820,
    streak: 31,
    badge: "Master",
    color: "bg-slate-400",
  },
  {
    rank: 3,
    name: "James Wilson",
    avatar: "JW",
    xp: 10950,
    streak: 22,
    badge: "Expert",
    color: "bg-amber-600",
  },
  {
    rank: 4,
    name: "Sarah Kim",
    avatar: "SK",
    xp: 9870,
    streak: 18,
    badge: "Pro",
    color: "bg-blue-400",
  },
  {
    rank: 5,
    name: "Dev Kumar",
    avatar: "DK",
    xp: 8540,
    streak: 15,
    badge: "Rising",
    color: "bg-emerald-400",
  },
];

const achievements = [
  {
    icon: Flame,
    title: "30-Day Streak",
    desc: "Solved a problem every day",
    color: "text-orange-500",
    bg: "bg-orange-50",
    earned: true,
  },
  {
    icon: Trophy,
    title: "Speed Demon",
    desc: "Solved 10 problems in under 10 min",
    color: "text-amber-500",
    bg: "bg-amber-50",
    earned: true,
  },
  {
    icon: Star,
    title: "Tree Master",
    desc: "Completed all tree problems",
    color: "text-blue-500",
    bg: "bg-blue-50",
    earned: true,
  },
  {
    icon: Target,
    title: "Sharp Shooter",
    desc: "First-try solve on hard problem",
    color: "text-red-500",
    bg: "bg-red-50",
    earned: false,
  },
  {
    icon: Award,
    title: "Contest Winner",
    desc: "Top 10 in weekly contest",
    color: "text-violet-500",
    bg: "bg-violet-50",
    earned: false,
  },
  {
    icon: Zap,
    title: "Lightning Round",
    desc: "Solved 5 mediums in 30 min",
    color: "text-sky-500",
    bg: "bg-sky-50",
    earned: false,
  },
];

function XPBar({
  xp,
  max,
  animated,
}: {
  xp: number;
  max: number;
  animated: boolean;
}) {
  const pct = Math.min((xp / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full progress-bar"
        style={{ width: animated ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

export default function Gamification() {
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
    <section
      id="gamification"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-125 h-125 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-amber-50 text-amber-600 border-amber-200 mb-4">
            Gamified Learning
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Learn Like You <span className="gradient-text">Play</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Earn XP, maintain streaks, unlock achievements, and compete with
            learners worldwide. Every problem solved is a level up.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div
            className={`glass rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/20 overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-800">Weekly Leaderboard</h3>
              </div>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                Live
              </Badge>
            </div>
            <div className="divide-y divide-slate-50">
              {leaderboard.map((user, i) => (
                <div
                  key={user.name}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/40 transition-colors cursor-pointer animate-slide-up`}
                  style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.color}`}
                  >
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    {user.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">
                        {user.name}
                      </span>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] px-1.5">
                        {user.badge}
                      </Badge>
                    </div>
                    <XPBar xp={user.xp} max={13000} animated={visible} />
                  </div>

                  {/* XP + Streak */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-800">
                      {user.xp.toLocaleString()} XP
                    </div>
                    <div className="flex items-center gap-1 text-xs text-orange-500 justify-end">
                      <Flame size={11} />
                      {user.streak}d
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements + stats */}
          <div className="space-y-5">
            {/* Personal stats card */}
            <div
              className={`glass rounded-2xl border border-blue-100 p-5 shadow-lg transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Your Progress</h3>
                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                  <Flame size={15} />
                  21-day streak!
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  {
                    label: "XP Earned",
                    value: "5,240",
                    color: "text-blue-600",
                  },
                  { label: "Problems", value: "89", color: "text-emerald-600" },
                  { label: "Rank", value: "#342", color: "text-amber-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                    <div className={`text-xl font-extrabold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Level 8 — Expert</span>
                  <span>5,240 / 6,000 XP</span>
                </div>
                <XPBar xp={5240} max={6000} animated={visible} />
              </div>
            </div>

            {/* Achievements grid */}
            <div
              className={`glass rounded-2xl border border-blue-100 p-5 shadow-lg transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h3 className="font-bold text-slate-800 mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((ach, i) => (
                  <div
                    key={ach.title}
                    className={`rounded-xl p-3 text-center transition-all duration-300 ${
                      ach.earned
                        ? `${ach.bg} border border-current/20 cursor-pointer hover:scale-105`
                        : "bg-slate-50 opacity-40 grayscale"
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                    title={ach.title}
                  >
                    <ach.icon
                      size={20}
                      className={`mx-auto mb-1 ${ach.earned ? ach.color : "text-slate-400"}`}
                    />
                    <div className="text-[10px] font-semibold text-slate-600 leading-tight">
                      {ach.title}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                3 of 6 achievements unlocked
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
