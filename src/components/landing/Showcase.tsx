"use client";
import { useInView } from "../../hooks/useInView";
import { useCountUp } from "../../hooks/useCountUp";
import { useEffect, useState } from "react";

const results = [
  {
    stat: 94,
    suffix: "%",
    isDecimal: false,
    label: "Interview Pass Rate",
    sub: "Users who complete our full track",
    color: "#f59e0b",
    trackColor: "rgba(245,158,11,0.1)",
    progressDeg: 338,
    index: 0,
  },
  {
    stat: 32,
    suffix: "x",
    isDecimal: true,
    label: "Faster Learning",
    sub: "vs. traditional study methods",
    color: "#0ea5e9",
    trackColor: "rgba(14,165,233,0.1)",
    progressDeg: 360,
    index: 1,
  },
  {
    stat: 45,
    suffix: " min",
    isDecimal: false,
    label: "Daily Average",
    sub: "Engaging sessions, every day",
    color: "#10b981",
    trackColor: "rgba(16,185,129,0.1)",
    progressDeg: 162,
    index: 2,
  },
  {
    stat: 2,
    suffix: "M+",
    isDecimal: false,
    label: "Problems Solved",
    sub: "Across our global community",
    color: "#f43f5e",
    trackColor: "rgba(244,63,94,0.1)",
    progressDeg: 360,
    index: 3,
  },
];

function ArcProgress({
  deg,
  color,
  size = 72,
  stroke = 4,
  animate,
}: {
  deg: number;
  color: string;
  size?: number;
  stroke?: number;
  animate: boolean;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setOffset(circ - (deg / 360) * circ), 150);
    return () => clearTimeout(t);
  }, [animate, circ, deg]);

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </svg>
  );
}

function StatCard({
  result,
  isVisible,
}: {
  result: (typeof results)[0];
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const count = useCountUp(result.stat, 1600, isVisible);
  const display = result.isDecimal
    ? (count / 10).toFixed(1)
    : count.toLocaleString();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-default select-none"
      style={{
        background: hovered ? result.trackColor : "rgba(255,255,255,0.7)",
        border: `1px solid ${hovered ? result.color + "50" : "rgba(226,232,240,0.9)"}`,
        backdropFilter: "blur(12px)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered
          ? "translateY(-6px) scale(1.015)"
          : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 24px 60px ${result.color}18, 0 1px 0 ${result.color}20`
          : "0 1px 4px rgba(0,0,0,0.04)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${result.index * 90}ms`,
      }}
    >
      {/* Hover glow blob */}
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: result.color,
          opacity: hovered ? 0.07 : 0,
          filter: "blur(28px)",
          transition: "opacity 0.4s ease",
        }}
      />

      <div className="relative z-10 p-7 flex flex-col gap-5">
        {/* Arc + number row */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <ArcProgress
              deg={result.progressDeg}
              color={result.color}
              animate={isVisible}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: result.color,
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 0.4s ease 1.5s",
                }}
              />
            </div>
          </div>

          <div
            className="font-black leading-none tabular-nums"
            style={{ fontSize: "2.6rem", color: result.color }}
          >
            {display}
            <span style={{ fontSize: "55%", opacity: 0.7 }}>
              {result.suffix}
            </span>
          </div>
        </div>

        {/* Label */}
        <div>
          <div
            className="font-bold text-sm mb-1 transition-colors duration-300"
            style={{ color: hovered ? result.color : "#0f172a" }}
          >
            {result.label}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{result.sub}</p>
        </div>
      </div>

      {/* Bottom slide-in bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, ${result.color}, ${result.color}60)`,
          width: hovered ? "100%" : "0%",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

export default function Showcase() {
  const { ref, isVisible } = useInView();
  const { ref: headRef, isVisible: headVisible } = useInView();

  const avatars = ["SC", "AK", "PP", "JW", "YT"];

  return (
    <section
      id="showcase"
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 60%)" }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(2,132,199,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Ambient light blobs */}
      <div
        className="absolute top-0 -left-48 w-[500px] h-[500px] rounded-full pointer-events-none animate-float"
        style={{ background: "rgba(14,165,233,0.05)", filter: "blur(100px)" }}
      />
      <div
        className="absolute bottom-0 -right-48 w-[500px] h-[500px] rounded-full pointer-events-none animate-float-delayed"
        style={{ background: "rgba(16,185,129,0.05)", filter: "blur(100px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div
          ref={headRef}
          className="text-center max-w-3xl mx-auto mb-20"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sm font-medium text-sky-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Proven Results
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.08] mb-5">
            The numbers
            <br />
            <span className="gradient-text">speak for themselves.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Gamified learning isn't just more enjoyable — it's measurably more
            effective.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5"
        >
          {results.map((r) => (
            <StatCard key={r.label} result={r} isVisible={isVisible} />
          ))}
        </div>

        {/* ── Comparison bar ── */}
        <div
          className="grid sm:grid-cols-2 gap-4 mb-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 500ms",
          }}
        >
          {/* Traditional */}
          <div
            className="rounded-2xl p-6 border border-slate-200/80 bg-white/60"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Traditional Study
              </span>
              <span className="text-xs font-bold text-slate-400">baseline</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-300"
                style={{
                  width: isVisible ? "30%" : "0%",
                  transition: "width 1.2s cubic-bezier(0.16,1,0.3,1) 700ms",
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Slow retention, low engagement
            </p>
          </div>

          {/* Our method */}
          <div
            className="rounded-2xl p-6 border bg-white/60"
            style={{
              backdropFilter: "blur(12px)",
              borderColor: "rgba(2,132,199,0.25)",
              boxShadow: "0 0 0 1px rgba(2,132,199,0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-widest">
                DSA Quest
              </span>
              <span className="text-xs font-bold text-emerald-600">
                3.2x faster →
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(2,132,199,0.1)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: isVisible ? "94%" : "0%",
                  background: "linear-gradient(90deg, #0284c7, #059669)",
                  transition: "width 1.4s cubic-bezier(0.16,1,0.3,1) 800ms",
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              AI-powered, gamified, adaptive
            </p>
          </div>
        </div>

        {/* ── Social proof + CTA strip ── */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 700ms",
          }}
        >
          {/* grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-7">
            {/* Avatar stack */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {avatars.map((init, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-slate-900"
                    style={{
                      background: `hsl(${i * 51 + 185}, 60%, 42%)`,
                      zIndex: 5 - i,
                    }}
                  >
                    {init}
                  </div>
                ))}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900"
                  style={{ background: "#162032", color: "#7dd3fc", zIndex: 0 }}
                >
                  150K
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  150,000+ learners
                </div>
                <div className="text-slate-400 text-xs mt-0.5">
                  already on their journey
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="#f59e0b"
                  >
                    <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.12L8 10.5l-3.71 2.04L5 8.42 2 5.5l4.15-.75z" />
                  </svg>
                ))}
              </div>
              <div className="text-slate-300 text-sm font-semibold">
                4.9 / 5.0
              </div>
              <div className="text-slate-500 text-xs">from 12,000+ reviews</div>
            </div>

            {/* CTA */}
            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #0284c7, #059669)",
                boxShadow: "0 0 30px rgba(2,132,199,0.3)",
              }}
            >
              Begin Your Quest →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
