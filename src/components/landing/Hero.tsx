"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Trophy, Zap, Brain, ChevronRight } from "lucide-react";
import HashMapWhiteboard from "./Hashmapwhiteboard";

const codeLines = [
  {
    num: 1,
    tokens: [
      { t: "keyword", v: "function" },
      { t: "function", v: " twoSum" },
      { t: "default", v: "(nums, target) {" },
    ],
  },
  {
    num: 2,
    tokens: [
      { t: "default", v: "  " },
      { t: "keyword", v: "const" },
      { t: "default", v: " map = " },
      { t: "keyword", v: "new" },
      { t: "default", v: " Map();" },
    ],
  },
  {
    num: 3,
    tokens: [
      { t: "default", v: "  " },
      { t: "keyword", v: "for" },
      { t: "default", v: " (" },
      { t: "keyword", v: "let" },
      { t: "default", v: " i = 0; i < nums." },
      { t: "function", v: "length" },
      { t: "default", v: "; i++) {" },
    ],
  },
  {
    num: 4,
    tokens: [
      { t: "default", v: "    " },
      { t: "keyword", v: "const" },
      { t: "default", v: " complement = target - nums[i];" },
    ],
  },
  {
    num: 5,
    tokens: [
      { t: "default", v: "    " },
      { t: "keyword", v: "if" },
      { t: "default", v: " (map." },
      { t: "function", v: "has" },
      { t: "default", v: "(complement))" },
    ],
  },
  {
    num: 6,
    tokens: [
      { t: "default", v: "      " },
      { t: "keyword", v: "return" },
      { t: "default", v: " [map." },
      { t: "function", v: "get" },
      { t: "default", v: "(complement), i];" },
    ],
  },
  {
    num: 7,
    tokens: [
      { t: "default", v: "    map." },
      { t: "function", v: "set" },
      { t: "default", v: "(nums[i], i);" },
    ],
  },
  { num: 8, tokens: [{ t: "default", v: "  }" }] },
  { num: 9, tokens: [{ t: "default", v: "}" }] },
];

const stats = [
  {
    icon: Trophy,
    label: "Problems Solved",
    value: "2M+",
    color: "text-amber-500",
  },
  {
    icon: Zap,
    label: "Active Learners",
    value: "150K+",
    color: "text-sky-600",
  },
  {
    icon: Brain,
    label: "AI Assists Daily",
    value: "50K+",
    color: "text-emerald-600",
  },
];

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.5 ? "#0284c7" : "#059669",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 150) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}

export default function Hero() {
  const [activeLine, setActiveLine] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => {
        if (prev >= codeLines.length - 1) {
          setShowOutput(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-pattern noise-overlay bg-white">
      <Particles />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-400/15 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-[120px] animate-float-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div className="space-y-8">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sm font-medium text-sky-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Now with AI-Powered Hints
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900 animate-slide-up delay-100">
              Master DSA
              <br />
              <span className="gradient-text">Like a Game</span>
              <br />
              Not a Chore
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed animate-slide-up delay-200">
              Turn algorithmic challenges into epic quests. Get AI-powered
              guidance, compete on leaderboards, and follow personalized
              roadmaps that adapt to your pace.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <a
                href="#"
                className="btn-primary group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 text-base font-bold text-white"
              >
                Begin Your Quest
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#features"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white border border-slate-200 text-base font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 transition-all shadow-sm"
              >
                See How It Works
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="flex gap-8 pt-4 animate-slide-up delay-500">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive code terminal */}
          <div className="relative animate-slide-in-right delay-300">
            {/* Orbiting elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-75 h-75 animate-spin-slow opacity-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-sky-500" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* XP badge */}
            <div className="absolute -top-4 -right-4 z-20 animate-float">
              <div className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20">
                +250 XP
              </div>
            </div>

            {/* Streak badge */}
            <div className="absolute -top-2 -left-6 z-20 animate-float-delayed">
              <div className="px-4 py-2 rounded-xl bg-white border border-amber-200 text-amber-600 font-bold text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
                <Zap className="w-4 h-4" /> 7 Day Streak
              </div>
            </div>

            {/* Whiteboard visualization */}
            <div className="mb-4 animate-slide-up delay-500">
              <HashMapWhiteboard activeLine={activeLine} />
            </div>

            {/* Code terminal */}
            <div className="code-block shadow-2xl shadow-slate-300/30">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-slate-400 font-mono">
                  twoSum.js
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                    Easy
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-medium">
                    Hash Map
                  </span>
                </div>
              </div>

              <div className="p-5 font-mono text-sm leading-7">
                {codeLines.map((line, i) => (
                  <div
                    key={line.num}
                    className={`flex transition-all duration-300 ${
                      i <= activeLine ? "opacity-100" : "opacity-20"
                    } ${i === activeLine ? "bg-sky-500/10 -mx-2 px-2 rounded" : ""}`}
                  >
                    <span className="line-number w-8 text-right mr-4 select-none text-xs">
                      {line.num}
                    </span>
                    <span>
                      {line.tokens.map((token, j) => (
                        <span
                          key={j}
                          className={
                            token.t !== "default" ? token.t : "text-slate-300"
                          }
                        >
                          {token.v}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Output */}
              <div
                className={`border-t border-slate-700/50 px-5 py-3 transition-all duration-500 ${
                  showOutput ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Runtime: 0.2ms - Faster than 98.7%
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {">"} Output: [0, 1]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-50 to-transparent" />
    </section>
  );
}
