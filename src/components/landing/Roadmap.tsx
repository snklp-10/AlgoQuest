"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock, ChevronDown, Zap, Map } from "lucide-react";

const PATHS = [
  { label: "FAANG Track", weeks: "12 weeks", color: "bg-blue-500" },
  { label: "Startup Ready", weeks: "8 weeks", color: "bg-emerald-500" },
  { label: "Competitive Prog", weeks: "16 weeks", color: "bg-violet-500" },
];

type StepStatus = "done" | "active" | "locked";

const ROADMAP_STEPS: {
  topic: string;
  problems: number;
  status: StepStatus;
  progress?: number;
  tag: string;
}[] = [
  {
    topic: "Arrays & Hashing",
    problems: 12,
    status: "done",
    progress: 100,
    tag: "Foundations",
  },
  {
    topic: "Two Pointers",
    problems: 8,
    status: "done",
    progress: 100,
    tag: "Foundations",
  },
  {
    topic: "Sliding Window",
    problems: 6,
    status: "active",
    progress: 67,
    tag: "Foundations",
  },
  { topic: "Stack & Queue", problems: 10, status: "locked", tag: "Linear" },
  { topic: "Binary Search", problems: 9, status: "locked", tag: "Search" },
  { topic: "Linked Lists", problems: 11, status: "locked", tag: "Linear" },
  { topic: "Trees & BST", problems: 14, status: "locked", tag: "Non-Linear" },
  {
    topic: "Graphs & BFS/DFS",
    problems: 13,
    status: "locked",
    tag: "Non-Linear",
  },
  {
    topic: "Dynamic Programming",
    problems: 20,
    status: "locked",
    tag: "Advanced",
  },
  { topic: "Backtracking", problems: 8, status: "locked", tag: "Advanced" },
];

function StepCard({
  step,
  index,
  visible,
}: {
  step: (typeof ROADMAP_STEPS)[0];
  index: number;
  visible: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const subItems: Record<string, string[]> = {
    "Sliding Window": [
      "Maximum subarray",
      "Longest substring without repeating",
      "Minimum window substring",
    ],
    "Arrays & Hashing": [
      "Two Sum",
      "Group Anagrams",
      "Top K Frequent Elements",
    ],
  };

  const isCurrent = step.status === "active";
  const isDone = step.status === "done";
  const isLocked = step.status === "locked";

  return (
    <div
      className={`transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div
        className={`rounded-xl border transition-all duration-200 ${
          isCurrent
            ? "border-blue-300 bg-blue-50 shadow-md shadow-blue-100"
            : isDone
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-slate-200 bg-white opacity-60"
        }`}
      >
        <div
          className={`flex items-center gap-3 p-4 ${!isLocked ? "cursor-pointer" : "cursor-default"}`}
          onClick={() =>
            !isLocked && subItems[step.topic] && setExpanded(!expanded)
          }
        >
          {/* Status icon */}
          <div className="shrink-0">
            {isDone ? (
              <CheckCircle size={20} className="text-emerald-500" />
            ) : isCurrent ? (
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
            ) : (
              <Lock size={18} className="text-slate-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-semibold text-sm ${isCurrent ? "text-blue-700" : isDone ? "text-emerald-700" : "text-slate-500"}`}
              >
                {step.topic}
              </span>
              <Badge
                className={`text-[10px] px-1.5 ${
                  step.tag === "Foundations"
                    ? "bg-sky-50 text-sky-600 border-sky-200"
                    : step.tag === "Advanced"
                      ? "bg-violet-50 text-violet-600 border-violet-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                {step.tag}
              </Badge>
            </div>
            {isCurrent && step.progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>
                    {Math.round((step.progress / 100) * step.problems)}/
                    {step.problems} problems
                  </span>
                  <span>{step.progress}%</span>
                </div>
                <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="progress-bar h-full"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">
              {step.problems} problems
            </span>
            {subItems[step.topic] && !isLocked && (
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        {/* Expanded sub-items */}
        {expanded && subItems[step.topic] && (
          <div className="border-t border-blue-200 px-4 py-3 space-y-1.5 bg-blue-50/50">
            {subItems[step.topic].map((item, j) => (
              <div
                key={j}
                className="flex items-center gap-2 text-xs text-slate-600"
              >
                <Circle size={10} className="text-blue-400" />
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activePath, setActivePath] = useState(0);

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
    <section id="roadmaps" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-100 h-100 bg-blue-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
            <Map size={12} className="mr-1" />
            Personalized Roadmaps
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Your Path to{" "}
            <span className="gradient-text">Interview Success</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Adaptive roadmaps that evolve with your progress. Know exactly what
            to study next, and never waste time on what you already know.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
          {/* Left: Path selector + info */}
          <div className="space-y-5">
            <div
              className={`space-y-3 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <h3 className="font-semibold text-slate-800 text-sm">
                Choose Your Track
              </h3>
              {PATHS.map((path, i) => (
                <button
                  key={path.label}
                  onClick={() => setActivePath(i)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                    activePath === i
                      ? "border-blue-300 bg-blue-50 shadow-md shadow-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                  }`}
                >
                  <div className={`w-3 h-10 rounded-full ${path.color}`} />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">
                      {path.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {path.weeks} · Curated by experts
                    </div>
                  </div>
                  {activePath === i && (
                    <Badge className="ml-auto bg-blue-100 text-blue-600 border-blue-200 text-[10px]">
                      Active
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* AI personalization */}
            <div
              className={`glass rounded-2xl border border-blue-100 p-5 shadow-lg transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-blue-500" />
                <h4 className="font-semibold text-slate-800 text-sm">
                  AI Personalization
                </h4>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Tell us your background and goals. Our AI builds a custom
                roadmap that skips what you know and focuses on your gaps.
              </p>
              <div className="space-y-2">
                {[
                  { label: "Current Level", value: "Intermediate" },
                  { label: "Target Company", value: "FAANG" },
                  { label: "Time Available", value: "2 hrs/day" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
              >
                <Zap size={13} />
                Regenerate Roadmap
              </Button>
            </div>
          </div>

          {/* Right: Roadmap steps */}
          <div className="space-y-2">
            {ROADMAP_STEPS.map((step, i) => (
              <StepCard
                key={step.topic}
                step={step}
                index={i}
                visible={visible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
