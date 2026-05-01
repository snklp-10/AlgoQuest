"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Sparkles, TrendingUp, Users } from "lucide-react";

interface TreeNode {
  val: number;
  x: number;
  y: number;
  left?: number;
  right?: number;
  highlighted?: boolean;
  visited?: boolean;
}

const TREE_NODES: TreeNode[] = [
  { val: 50, x: 50, y: 10 },
  { val: 30, x: 28, y: 30 },
  { val: 70, x: 72, y: 30 },
  { val: 20, x: 17, y: 52 },
  { val: 40, x: 39, y: 52 },
  { val: 60, x: 61, y: 52 },
  { val: 80, x: 83, y: 52 },
  { val: 15, x: 10, y: 74 },
  { val: 25, x: 24, y: 74 },
  { val: 35, x: 33, y: 74 },
  { val: 45, x: 45, y: 74 },
];

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 7],
  [3, 8],
  [4, 9],
  [4, 10],
];

const BFS_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function TreeVisualizer() {
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runBFS = () => {
    if (running) return;
    setHighlighted(new Set());
    setCurrent(null);
    setRunning(true);
    const visited = new Set<number>();

    BFS_ORDER.forEach((nodeIdx, step) => {
      animRef.current = setTimeout(() => {
        setCurrent(nodeIdx);
        visited.add(nodeIdx);
        setHighlighted(new Set(visited));
        if (step === BFS_ORDER.length - 1) {
          setTimeout(() => {
            setCurrent(null);
            setRunning(false);
          }, 600);
        }
      }, step * 420);
    });
  };

  useEffect(() => {
    const t = setTimeout(runBFS, 1200);
    return () => {
      clearTimeout(t);
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  return (
    <div className="relative w-full aspect-4/3 max-w-md">
      <svg
        viewBox="0 0 100 88"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Edges */}
        {EDGES.map(([from, to], i) => {
          const a = TREE_NODES[from],
            b = TREE_NODES[to];
          const isActive = highlighted.has(from) && highlighted.has(to);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y + 2.5}
              x2={b.x}
              y2={b.y - 2.5}
              stroke={isActive ? "#3b82f6" : "#cbd5e1"}
              strokeWidth={isActive ? 0.8 : 0.5}
              strokeDasharray={isActive ? "0" : "2 1"}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Nodes */}
        {TREE_NODES.map((node, i) => {
          const isHighlighted = highlighted.has(i);
          const isCurrent = current === i;
          return (
            <g key={i} transform={`translate(${node.x}, ${node.y})`}>
              {isCurrent && (
                <circle
                  r="5.5"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="0.5"
                  opacity="0.5"
                  style={{ animation: "pulse-glow 1s ease-in-out infinite" }}
                />
              )}
              <circle
                r="3.8"
                fill={
                  isCurrent ? "#2563eb" : isHighlighted ? "#3b82f6" : "#f1f5f9"
                }
                stroke={isHighlighted ? "#3b82f6" : "#94a3b8"}
                strokeWidth="0.4"
                className="transition-all duration-300 node-circle"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="2.2"
                fontWeight="600"
                fill={isHighlighted ? "white" : "#475569"}
                className="transition-all duration-300 select-none"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Replay button */}
      <button
        onClick={runBFS}
        disabled={running}
        className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play size={11} />
        {running ? "Running BFS..." : "Replay BFS"}
      </button>

      {/* Legend */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          Visited
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 inline-block" />
          Unvisited
        </div>
      </div>
    </div>
  );
}

function CodeSnippet() {
  const lines = [
    { code: "def bfs(root):", color: "text-blue-400" },
    { code: "  queue = deque([root])", color: "text-slate-300" },
    { code: "  visited = []", color: "text-slate-300" },
    { code: "  while queue:", color: "text-blue-400" },
    { code: "    node = queue.popleft()", color: "text-emerald-400" },
    { code: "    visited.append(node.val)", color: "text-slate-300" },
    { code: "    if node.left:", color: "text-blue-400" },
    { code: "      queue.append(node.left)", color: "text-slate-400" },
    { code: "  return visited", color: "text-amber-400" },
  ];

  return (
    <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs shadow-2xl border border-slate-700 w-full">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-slate-500 text-[10px]">solution.py</span>
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 code-line stagger-${Math.min(i + 1, 8)}`}
        >
          <span className="text-slate-600 select-none w-4 text-right">
            {i + 1}
          </span>
          <span className={line.color}>{line.code}</span>
        </div>
      ))}
    </div>
  );
}

const stats = [
  { icon: Users, value: "50K+", label: "Learners" },
  { icon: TrendingUp, value: "200+", label: "Problems" },
  { icon: Sparkles, value: "98%", label: "Satisfaction" },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute top-0 right-0 w-150 h-150 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-sky-300/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div
            className={`space-y-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium">
              <Sparkles size={14} />
              AI-Powered DSA Learning
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Master Algorithms <span className="gradient-text">Visually</span>{" "}
              & Smartly
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Interactive visualizations, gamified challenges, AI code
              assistance, and personalized roadmaps — everything you need to
              crack top tech interviews.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <s.icon size={15} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-300/40 hover:shadow-blue-300/60 transition-all duration-200 gap-2 px-6"
              >
                Start Learning Free
                <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 gap-2 px-6"
              >
                <Play size={16} />
                Watch Demo
              </Button>
            </div>

            {/* <p className="text-xs text-slate-400">
              No credit card required · 7-day free trial · Cancel anytime
            </p> */}
          </div>

          {/* Right: Viz */}
          <div
            className={`relative transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="relative">
              {/* Main card */}
              <div className="glass rounded-2xl p-6 shadow-2xl shadow-blue-200/30 glow-blue border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      Binary Search Tree
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      BFS Traversal — Level Order
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">
                    Live Demo
                  </Badge>
                </div>
                <TreeVisualizer />
              </div>

              {/* Floating code card */}
              <div
                className="absolute -bottom-6 -left-6 w-64 animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="shadow-2xl shadow-slate-900/20 rounded-xl overflow-hidden">
                  <CodeSnippet />
                </div>
              </div>

              {/* Floating badge: XP earned */}
              <div
                className="absolute -top-4 -right-4 glass border border-blue-100 rounded-xl px-3 py-2 shadow-lg animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-white">
                    XP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      +150 XP
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Tree Traversal
                    </div>
                  </div>
                </div>
              </div>

              {/* AI hint badge */}
              <div
                className="absolute top-1/2 -left-8 glass border border-blue-100 rounded-xl px-3 py-2 shadow-lg animate-float"
                style={{ animationDelay: "1.8s" }}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Sparkles size={12} className="text-blue-500" />
                  <span className="text-slate-700 font-medium">
                    AI Hint available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
