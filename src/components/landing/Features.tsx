"use client";
import { useState } from "react";
import { useInView } from "../../hooks/useInView";
import {
  Gamepad2,
  Bot,
  BarChart3,
  Map,
  Star,
  Target,
  Flame,
  Shield,
  Trophy,
  Zap,
  Code2,
  Sparkles,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description:
      "Earn XP, unlock achievements, and maintain streaks. Every problem solved is a quest completed.",
    color: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.15)",
    details: [
      "XP & Level System",
      "Daily Streaks",
      "Achievement Badges",
      "Boss Battles",
    ],
    demo: "xp",
  },
  {
    icon: Bot,
    title: "AI Code Assistant",
    description:
      "Our AI analyzes your approach, provides contextual hints, and explains optimal solutions without giving away the answer.",
    color: "from-sky-600 to-cyan-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    details: [
      "Smart Hints",
      "Code Review",
      "Complexity Analysis",
      "Pattern Recognition",
    ],
    demo: "ai",
  },
  {
    icon: BarChart3,
    title: "Global Leaderboards",
    description:
      "Compete with learners worldwide. Climb rankings, join clan wars, and prove your algorithmic prowess.",
    color: "from-emerald-600 to-teal-600",
    glowColor: "rgba(5, 150, 105, 0.15)",
    details: [
      "Global Rankings",
      "Clan Competitions",
      "Weekly Challenges",
      "Rating System",
    ],
    demo: "leaderboard",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    description:
      "AI-crafted learning paths that adapt to your skill level, goals, and pace.",
    color: "from-rose-500 to-pink-500",
    glowColor: "rgba(244, 63, 94, 0.15)",
    details: [
      "Adaptive Paths",
      "Goal-Based Plans",
      "Skill Gap Analysis",
      "Progress Tracking",
    ],
    demo: "roadmap",
  },
];

const miniFeatures = [
  { icon: Star, label: "500+ Problems", color: "text-amber-500" },
  { icon: Target, label: "Company Tracks", color: "text-sky-600" },
  { icon: Flame, label: "Streak Rewards", color: "text-orange-500" },
  { icon: Shield, label: "Contest Prep", color: "text-emerald-600" },
];

function XPDemo() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-700">Level 12</span>
        </div>
        <span className="text-xs text-amber-600 font-medium">
          2,450 / 3,000 XP
        </span>
      </div>
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[82%]" />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["Streak Master", "Hash Hero", "Tree Climber", "Speed Demon"].map(
          (badge) => (
            <span
              key={badge}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-700 font-medium"
            >
              {badge}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function AIDemo() {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-700/50 space-y-2.5">
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Code2 className="w-3 h-3 text-slate-400" />
        </div>
        <div className="bg-slate-700/50 rounded-lg rounded-tl-none px-3 py-2 text-[11px] text-slate-300 leading-relaxed">
          I'm stuck on this binary search edge case...
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg rounded-tl-none px-3 py-2 text-[11px] text-sky-200 leading-relaxed">
          What happens when the target is smaller than all elements? Check your
          loop condition and how you update{" "}
          <code className="bg-sky-500/20 px-1 rounded text-sky-300">left</code>{" "}
          /{" "}
          <code className="bg-sky-500/20 px-1 rounded text-sky-300">right</code>
          .
        </div>
      </div>
    </div>
  );
}

function LeaderboardDemo() {
  const users = [
    {
      rank: 1,
      name: "Sarah C.",
      xp: "12.4K",
      color: "from-amber-400 to-amber-500",
    },
    {
      rank: 2,
      name: "Alex K.",
      xp: "11.3K",
      color: "from-slate-300 to-slate-400",
    },
    {
      rank: 3,
      name: "Priya P.",
      xp: "10.9K",
      color: "from-orange-400 to-orange-500",
    },
  ];
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 space-y-2">
      {users.map((user) => (
        <div
          key={user.rank}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/60"
        >
          <div
            className={`w-5 h-5 rounded-md bg-gradient-to-br ${user.color} flex items-center justify-center text-[9px] font-bold text-white`}
          >
            {user.rank}
          </div>
          <span className="text-xs font-medium text-slate-700 flex-1">
            {user.name}
          </span>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-600">
              {user.xp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapDemo() {
  const topics = ["Arrays", "Trees", "Graphs", "DP", "System"];
  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-3.5 h-3.5 text-rose-500" />
        <span className="text-xs font-semibold text-rose-700">
          FAANG Prep Track
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 ml-auto">
          8 weeks
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {topics.map((topic, i) => (
          <div key={topic} className="flex items-center gap-1.5">
            <div
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                i < 2
                  ? "bg-emerald-100 text-emerald-700"
                  : i === 2
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {topic}
            </div>
            {i < 4 && (
              <TrendingUp
                className={`w-3 h-3 ${i < 2 ? "text-emerald-400" : i === 2 ? "text-sky-400" : "text-slate-300"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const demos: Record<string, () => JSX.Element> = {
  xp: XPDemo,
  ai: AIDemo,
  leaderboard: LeaderboardDemo,
  roadmap: RoadmapDemo,
};

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { ref: headerRef, isVisible: headerVisible } = useInView();
  const { ref: contentRef, isVisible: contentVisible } = useInView(0.05);
  const { ref: miniRef, isVisible: miniVisible } = useInView();

  const active = features[activeFeature];
  const DemoComponent = demos[active.demo];

  return (
    <section
      id="features"
      className="relative py-28 overflow-hidden bg-slate-50"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700 mb-6">
            Core Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-slate-900">
            Everything You Need to
            <br />
            <span className="gradient-text">Conquer DSA</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Four pillars that transform how you learn data structures and
            algorithms.
          </p>
        </div>

        {/* Interactive feature showcase */}
        <div
          ref={contentRef}
          className={`transition-all duration-700 ${
            contentVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Feature selector - left side */}
            <div className="lg:col-span-4 space-y-3">
              {features.map((feature, i) => (
                <button
                  key={feature.title}
                  onClick={() => setActiveFeature(i)}
                  className={`w-full text-left rounded-2xl p-5 transition-all duration-300 group ${
                    i === activeFeature
                      ? "bg-white shadow-lg shadow-slate-200/60 border border-slate-200/80"
                      : "bg-transparent hover:bg-white/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        i === activeFeature
                          ? `bg-gradient-to-br ${feature.color} scale-110`
                          : "bg-slate-100 scale-100"
                      }`}
                      style={
                        i === activeFeature
                          ? { boxShadow: `0 6px 20px ${feature.glowColor}` }
                          : {}
                      }
                    >
                      <feature.icon
                        className={`w-5 h-5 ${i === activeFeature ? "text-white" : "text-slate-400"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-bold transition-colors ${
                          i === activeFeature
                            ? "text-slate-900"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 transition-colors line-clamp-1 ${
                          i === activeFeature
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-all ${
                        i === activeFeature
                          ? "text-slate-400 translate-x-0 opacity-100"
                          : "text-slate-300 -translate-x-1 opacity-0"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Feature detail - right side */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm h-full">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center`}
                      style={{ boxShadow: `0 8px 30px ${active.glowColor}` }}
                    >
                      <active.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {active.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {active.description}
                      </p>
                    </div>
                  </div>

                  {/* Demo area */}
                  <div className="mb-6">
                    <DemoComponent />
                  </div>

                  {/* Detail pills */}
                  <div className="grid grid-cols-2 gap-3">
                    {active.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 bg-gradient-to-br ${active.color} text-white rounded-full p-0.5`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini feature bar */}
        <div
          ref={miniRef}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {miniFeatures.map((item, i) => (
            <div
              key={item.label}
              className={`bg-white rounded-xl px-5 py-4 flex items-center gap-3 border border-slate-200/60 hover:border-sky-200 hover:shadow-sm transition-all group ${
                miniVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <item.icon
                className={`w-5 h-5 ${item.color} transition-transform group-hover:scale-110`}
              />
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
