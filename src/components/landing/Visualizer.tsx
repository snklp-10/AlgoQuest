"use client";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, ChevronRight } from "lucide-react";

type AlgoKey = "bubble" | "binary" | "dijkstra";

const ALGO_TABS: { key: AlgoKey; label: string; complexity: string }[] = [
  { key: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { key: "binary", label: "Binary Search", complexity: "O(log n)" },
  { key: "dijkstra", label: "Dijkstra's", complexity: "O(V log V)" },
];

function generateArray(n = 16) {
  return Array.from(
    { length: n },
    (_, i) => Math.floor(Math.random() * 80) + 10 + i * 2,
  ).sort(() => Math.random() - 0.5);
}

function BubbleSortViz() {
  const [arr, setArr] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    setArr(generateArray(14));
  }, []);

  const reset = () => {
    stopRef.current = true;
    setArr(generateArray(14));
    setComparing([]);
    setSorted(new Set());
    setRunning(false);
    setTimeout(() => {
      stopRef.current = false;
    }, 100);
  };

  const run = async () => {
    if (arr.length === 0) return; // Wait for array to be generated
    stopRef.current = false;
    setRunning(true);
    setSorted(new Set());
    const a = [...arr];
    const n = a.length;
    const sortedSet = new Set<number>();
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;
        setComparing([j, j + 1]);
        await new Promise((r) => setTimeout(r, 80));
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          setArr([...a]);
        }
      }
      sortedSet.add(n - 1 - i);
      setSorted(new Set(sortedSet));
    }
    sortedSet.add(0);
    setSorted(new Set(sortedSet));
    setComparing([]);
    setRunning(false);
  };

  if (arr.length === 0) {
    return <div className="text-sm text-slate-400">Loading...</div>;
  }

  const max = Math.max(...arr);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-1 h-40 px-2">
        {arr.map((v, i) => {
          const isComparing = comparing.includes(i);
          const isSorted = sorted.has(i);
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-75"
              style={{
                height: `${(v / max) * 100}%`,
                background: isSorted
                  ? "hsl(142 71% 45%)"
                  : isComparing
                    ? "hsl(0 84% 60%)"
                    : "hsl(217 91% 60%)",
                opacity: isSorted ? 0.9 : isComparing ? 1 : 0.75,
                transform: isComparing ? "scaleY(1.04)" : "scaleY(1)",
              }}
            />
          );
        })}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={run}
          disabled={running}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 flex-1"
        >
          <Play size={13} /> {running ? "Sorting..." : "Sort"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={reset}
          className="border-slate-200"
        >
          <RotateCcw size={13} />
        </Button>
      </div>
      <div className="flex gap-3 text-xs">
        {[
          { color: "bg-blue-500", label: "Unsorted" },
          { color: "bg-red-500", label: "Comparing" },
          { color: "bg-emerald-500", label: "Sorted" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BinarySearchViz() {
  const n = 15;
  const arr = Array.from({ length: n }, (_, i) => (i + 1) * 5);

  const [low, setLow] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  const [target, setTarget] = useState<number | null>(null);

  // ✅ Generate target ONLY on client (fixes hydration)
  useEffect(() => {
    setTarget(arr[Math.floor(Math.random() * n)]);
  }, []);

  const reset = () => {
    stopRef.current = true;

    setLow(null);
    setHigh(null);
    setMid(null);
    setFound(null);
    setRunning(false);

    // ✅ regenerate target
    setTarget(arr[Math.floor(Math.random() * n)]);

    setTimeout(() => {
      stopRef.current = false;
    }, 100);
  };

  const run = async () => {
    if (target === null) return; // ✅ safety

    stopRef.current = false;
    setRunning(true);
    setFound(null);

    let l = 0,
      h = n - 1;

    setLow(l);
    setHigh(h);

    await new Promise((r) => setTimeout(r, 400));

    while (l <= h) {
      if (stopRef.current) return;

      const m = Math.floor((l + h) / 2);
      setMid(m);

      await new Promise((r) => setTimeout(r, 600));

      if (arr[m] === target) {
        setFound(m);
        break;
      } else if (arr[m] < target) {
        l = m + 1;
        setLow(l);
      } else {
        h = m - 1;
        setHigh(h);
      }

      await new Promise((r) => setTimeout(r, 400));
    }

    setRunning(false);
  };

  // ✅ Prevent hydration mismatch render
  if (target === null) {
    return <div className="text-sm text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-500 mb-1">
        Searching for: <span className="font-bold text-blue-600">{target}</span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {arr.map((v, i) => {
          const isLow = i === low;
          const isHigh = i === high;
          const isMid = i === mid;
          const isFound = i === found;

          const inRange =
            low !== null && high !== null && i >= low && i <= high;

          return (
            <div
              key={i}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isFound
                  ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200"
                  : isMid
                    ? "bg-blue-500 text-white scale-105"
                    : isLow || isHigh
                      ? "bg-sky-200 text-sky-800"
                      : inRange
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-slate-100 text-slate-400"
              }`}
            >
              {v}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          onClick={run}
          disabled={running}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 flex-1"
        >
          <Play size={13} /> {running ? "Searching..." : "Search"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={reset}
          className="border-slate-200"
        >
          <RotateCcw size={13} />
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap text-xs">
        {[
          { color: "bg-blue-500", label: "Mid" },
          { color: "bg-sky-200 border border-sky-300", label: "Low/High" },
          { color: "bg-blue-50 border border-blue-200", label: "Range" },
          { color: "bg-emerald-500", label: "Found" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DijkstraViz() {
  const nodes = [
    { id: 0, x: 50, y: 15, label: "A" },
    { id: 1, x: 20, y: 45, label: "B" },
    { id: 2, x: 80, y: 45, label: "C" },
    { id: 3, x: 35, y: 78, label: "D" },
    { id: 4, x: 65, y: 78, label: "E" },
  ];
  const edges = [
    { from: 0, to: 1, w: 4 },
    { from: 0, to: 2, w: 2 },
    { from: 1, to: 3, w: 5 },
    { from: 1, to: 2, w: 1 },
    { from: 2, to: 4, w: 3 },
    { from: 3, to: 4, w: 1 },
  ];

  const steps = [
    { visited: [0], distances: [0, 4, 2, 9, 5], current: 0 },
    { visited: [0, 2], distances: [0, 3, 2, 9, 5], current: 2 },
    { visited: [0, 2, 1], distances: [0, 3, 2, 8, 5], current: 1 },
    { visited: [0, 2, 1, 4], distances: [0, 3, 2, 8, 5], current: 4 },
    { visited: [0, 2, 1, 4, 3], distances: [0, 3, 2, 6, 5], current: 3 },
  ];

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setStep(0);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    setRunning(false);
  };

  const current = steps[step];
  const INF = 99;

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 100 95" className="w-full h-40">
        {edges.map((e, i) => {
          const a = nodes[e.from],
            b = nodes[e.to];
          const mx = (a.x + b.x) / 2,
            my = (a.y + b.y) / 2;
          const onPath =
            current.visited.includes(e.from) && current.visited.includes(e.to);
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={onPath ? "#3b82f6" : "#cbd5e1"}
                strokeWidth={onPath ? 1.2 : 0.8}
                className="transition-all duration-500"
              />
              <text
                x={mx}
                y={my - 1}
                textAnchor="middle"
                fontSize="4"
                fill="#94a3b8"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {e.w}
              </text>
            </g>
          );
        })}
        {nodes.map((n) => {
          const isVisited = current.visited.includes(n.id);
          const isCurrent = current.current === n.id;
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <circle
                r="6"
                fill={isCurrent ? "#2563eb" : isVisited ? "#3b82f6" : "#f1f5f9"}
                stroke={isVisited ? "#3b82f6" : "#94a3b8"}
                strokeWidth="0.6"
                className="transition-all duration-500"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="3.5"
                fontWeight="700"
                fill={isVisited ? "white" : "#475569"}
              >
                {n.label}
              </text>
              <text
                y={-8}
                textAnchor="middle"
                fontSize="3"
                fill="#64748b"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {current.distances[n.id] === INF
                  ? "∞"
                  : current.distances[n.id]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={run}
          disabled={running}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 flex-1"
        >
          <Play size={13} /> {running ? "Running..." : "Run Dijkstra"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStep(0)}
          className="border-slate-200"
        >
          <RotateCcw size={13} />
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        Step {step + 1}/{steps.length} — Visiting node{" "}
        <strong className="text-blue-600">
          {nodes[current.current].label}
        </strong>
      </p>
    </div>
  );
}

const VIZ_MAP: Record<AlgoKey, React.ReactNode> = {
  bubble: <BubbleSortViz />,
  binary: <BinarySearchViz />,
  dijkstra: <DijkstraViz />,
};

export default function Visualizer() {
  const [activeTab, setActiveTab] = useState<AlgoKey>("bubble");
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
      id="visualizer"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 hero-grid opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
            Algorithm Visualizer
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            See Algorithms <span className="gradient-text">Come Alive</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Don't just read about algorithms — watch them execute. Interactive,
            step-by-step visualizations for every major concept.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Algo selector + viz */}
          <div className="glass rounded-2xl p-6 border border-blue-100 shadow-xl shadow-blue-100/30">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              {ALGO_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Visualization */}
            <div className="min-h-55">{VIZ_MAP[activeTab]}</div>

            {/* Complexity badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-500">Time Complexity:</span>
              <code className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {ALGO_TABS.find((t) => t.key === activeTab)?.complexity}
              </code>
            </div>
          </div>

          {/* Right: Feature bullets */}
          <div className="space-y-5">
            {[
              {
                step: "01",
                title: "15+ Data Structures",
                desc: "Arrays, linked lists, trees, graphs, heaps, tries — every structure you need for interviews.",
              },
              {
                step: "02",
                title: "Step-by-step Control",
                desc: "Pause, step forward, step back, or adjust speed. Full control over the visualization.",
              },
              {
                step: "03",
                title: "Complexity Analysis",
                desc: "Real-time time and space complexity shown as the algorithm runs, with big-O annotations.",
              },
              {
                step: "04",
                title: "Code Sync",
                desc: "The highlighted line in the code editor matches the current step in the visualization.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 flex items-center gap-2">
                    {item.title}
                    <ChevronRight size={13} className="text-blue-400" />
                  </h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
