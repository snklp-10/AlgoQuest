"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const CODE_SNIPPET = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;

const CONVERSATION = [
  {
    role: "user",
    content:
      "I'm confused about why we need a hash map here. Can't we just use two loops?",
  },
  {
    role: "ai",
    content:
      'Great question! You absolutely can use two nested loops — that would give you O(n²) time complexity. But the hash map approach is cleverer:\n\n**Two loops:** For each element, scan all remaining elements → O(n²)\n**Hash map:** For each element, check if its complement already exists → O(1) lookup → O(n) total\n\nThe key insight: instead of asking "does any other element equal target - nums[i]?", we flip it to "have I already seen target - nums[i]?" — and hash maps answer that in O(1).',
    highlights: ["O(n²)", "O(n)", "O(1) lookup"],
  },
  {
    role: "user",
    content: "Oh! So we transform a search problem into a lookup problem?",
  },
  {
    role: "ai",
    content:
      "Exactly! That's a fundamental pattern in DSA — *trade space for time*. You're using O(n) extra space (the hash map) to reduce time from O(n²) to O(n). This pattern appears in:\n• Frequency counting\n• Anagram detection\n• Subarray sum problems\n\nYou've just discovered one of the most powerful optimization techniques!",
  },
];

const HINTS = [
  {
    type: "insight",
    icon: Lightbulb,
    text: "Hash map lookups are O(1) amortized",
    color: "text-amber-500 bg-amber-50 border-amber-200",
  },
  {
    type: "warning",
    icon: AlertCircle,
    text: "Consider edge case: nums = [3, 3], target = 6",
    color: "text-orange-500 bg-orange-50 border-orange-200",
  },
  {
    type: "success",
    icon: CheckCircle,
    text: "Your solution handles negative numbers correctly",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
];

function ChatMessage({
  msg,
  index,
  visible,
}: {
  msg: (typeof CONVERSATION)[0];
  index: number;
  visible: boolean;
}) {
  const isAI = msg.role === "ai";

  return (
    <div
      className={`flex gap-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div
        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isAI ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600"}`}
      >
        {isAI ? <Bot size={14} /> : <User size={14} />}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] ${
          isAI
            ? "bg-white border border-blue-100 text-slate-700 shadow-sm"
            : "bg-blue-500 text-white ml-auto"
        }`}
        style={{
          borderTopLeftRadius: isAI ? "4px" : undefined,
          borderTopRightRadius: !isAI ? "4px" : undefined,
        }}
      >
        {msg.content.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <strong key={i} className="block mt-1">
                {line.slice(2, -2)}
              </strong>
            );
          }
          if (line.startsWith("•")) {
            return (
              <div key={i} className="ml-2 mt-0.5">
                {line}
              </div>
            );
          }
          if (line.includes("*") && !line.startsWith("**")) {
            const parts = line.split("*");
            return (
              <span key={i} className="block mt-1">
                {parts.map((p, j) =>
                  j % 2 === 1 ? (
                    <em
                      key={j}
                      className="text-blue-300 not-italic font-semibold"
                    >
                      {p}
                    </em>
                  ) : (
                    p
                  ),
                )}
              </span>
            );
          }
          return line ? (
            <span key={i} className="block mt-0.5">
              {line}
            </span>
          ) : (
            <br key={i} />
          );
        })}
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [inputVal, setInputVal] = useState("");

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-4">
            <Sparkles size={12} className="mr-1" />
            AI Code Assistant
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Your Personal <span className="gradient-text">AI Tutor</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Get intelligent hints, deep explanations, and instant feedback —
            right inside your editor. Never get stuck again.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Code editor panel */}
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="rounded-2xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-700">
              {/* Editor header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-slate-400 text-xs font-mono">
                  two_sum.py
                </span>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-blue-400">
                  <Sparkles size={11} />
                  AI Active
                </div>
              </div>

              {/* Code */}
              <div className="p-5 font-mono text-sm text-slate-300 leading-7">
                {CODE_SNIPPET.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 code-line stagger-${Math.min(i + 1, 8)} hover:bg-blue-500/5 rounded px-1 group`}
                  >
                    <span className="text-slate-600 select-none w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span
                      className={
                        line.includes("def ")
                          ? "text-blue-400"
                          : line.includes("for ") || line.includes("if ")
                            ? "text-blue-300"
                            : line.includes("return")
                              ? "text-amber-400"
                              : line.includes("#")
                                ? "text-slate-500"
                                : "text-slate-300"
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI hints panel */}
              <div className="border-t border-slate-700 p-4 space-y-2 bg-slate-800/50">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                  <Bot size={12} className="text-blue-400" />
                  AI Analysis
                </div>
                {HINTS.map((hint, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg border ${hint.color} transition-all duration-300 animate-slide-up`}
                    style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}
                  >
                    <hint.icon size={13} className="mt-0.5 shrink-0" />
                    {hint.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat panel */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="glass rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/20 overflow-hidden">
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    AlgoMind AI
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
                {CONVERSATION.map((msg, i) => (
                  <ChatMessage key={i} msg={msg} index={i} visible={visible} />
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask anything about this problem..."
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <Button
                    size="icon"
                    className="w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 shrink-0"
                  >
                    <Send size={13} className="text-white" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[
                    "Explain time complexity",
                    "Show a hint",
                    "Optimize this",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInputVal(q)}
                      className="text-[11px] px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
