"use client";
import { useEffect, useState, useRef } from "react";

// Represents state of the hashmap at each code step
const steps = [
  {
    line: 0,
    map: [],
    current: null,
    found: null,
    label: "Start: empty map",
    phase: "init",
  },
  {
    line: 1,
    map: [],
    current: null,
    found: null,
    label: "Create HashMap",
    phase: "init",
  },
  {
    line: 2,
    map: [],
    current: { i: 0, val: 2, complement: 7 },
    found: null,
    label: "i=0 → complement = 9-2 = 7",
    phase: "check",
  },
  {
    line: 3,
    map: [],
    current: { i: 0, val: 2, complement: 7 },
    found: null,
    label: "7 not in map",
    phase: "miss",
  },
  {
    line: 4,
    map: [{ key: 2, val: 0 }],
    current: { i: 0, val: 2, complement: 7 },
    found: null,
    label: "Store map[2] = 0",
    phase: "store",
  },
  {
    line: 2,
    map: [{ key: 2, val: 0 }],
    current: { i: 1, val: 7, complement: 2 },
    found: null,
    label: "i=1 → complement = 9-7 = 2",
    phase: "check",
  },
  {
    line: 3,
    map: [{ key: 2, val: 0 }],
    current: { i: 1, val: 7, complement: 2 },
    found: { key: 2, val: 0 },
    label: "✓ 2 found in map!",
    phase: "hit",
  },
  {
    line: 4,
    map: [{ key: 2, val: 0 }],
    current: { i: 1, val: 7, complement: 2 },
    found: { key: 2, val: 0 },
    label: "Return [0, 1] 🎉",
    phase: "done",
  },
];

const nums = [2, 7, 11, 15];
const target = 9;

interface MapEntry {
  key: number;
  val: number;
}
interface Step {
  line: number;
  map: MapEntry[];
  current: { i: number; val: number; complement: number } | null;
  found: MapEntry | null;
  label: string;
  phase: string;
}

interface HashMapWhiteboardProps {
  activeLine: number;
}

export default function HashMapWhiteboard({
  activeLine,
}: HashMapWhiteboardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [animatingKey, setAnimatingKey] = useState<number | null>(null);
  const prevStep = useRef(0);

  useEffect(() => {
    // Map activeLine (0-8) to our steps
    const idx = Math.min(activeLine, steps.length - 1);
    if (idx !== prevStep.current) {
      // If a new entry is being stored, animate it
      const prev = steps[prevStep.current];
      const next = steps[idx];
      if (next.map.length > prev.map.length) {
        const newEntry = next.map[next.map.length - 1];
        setAnimatingKey(newEntry.key);
        setTimeout(() => setAnimatingKey(null), 600);
      }
      prevStep.current = idx;
      setStepIndex(idx);
    }
  }, [activeLine]);

  const step: Step = steps[stepIndex];

  return (
    <div
      className="whiteboard-card relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #fefefe 0%, #f5f3ef 100%)",
        border: "1px solid #e8e2d9",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Whiteboard top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "linear-gradient(90deg, #f0ede8, #ede9e3)",
          borderBottom: "1px solid #ddd8cf",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: "#d4c5a9" }}
          />
          <span
            className="text-xs font-semibold"
            style={{ color: "#7c6f5e", letterSpacing: "0.05em" }}
          >
            HASH MAP TRACE
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{ background: "#e8e2d9", color: "#8b7d6b" }}
          >
            twoSum
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{
              background:
                step.phase === "hit" || step.phase === "done"
                  ? "#d4edda"
                  : "#f0ede8",
              color:
                step.phase === "hit" || step.phase === "done"
                  ? "#2d6a4f"
                  : "#8b7d6b",
            }}
          >
            target = {target}
          </span>
        </div>
      </div>

      {/* Whiteboard body */}
      <div className="p-5 space-y-4" style={{ minHeight: "220px" }}>
        {/* Input array */}
        <div>
          <div
            className="text-[10px] font-semibold mb-2"
            style={{ color: "#a09080", letterSpacing: "0.08em" }}
          >
            INPUT ARRAY
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs mr-1" style={{ color: "#b0a090" }}>
              nums =
            </span>
            <div className="flex">
              {nums.map((n, i) => {
                const isActive = step.current?.i === i;
                const isComplement =
                  step.current?.complement === n &&
                  step.map.some((e) => e.key === n);
                return (
                  <div
                    key={i}
                    className="relative transition-all duration-300"
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${isComplement ? "#059669" : isActive ? "#0284c7" : "#d4cdc4"}`,
                      background: isComplement
                        ? "rgba(5,150,105,0.1)"
                        : isActive
                          ? "rgba(2,132,199,0.08)"
                          : "#fff",
                      borderRadius:
                        i === 0
                          ? "6px 0 0 6px"
                          : i === nums.length - 1
                            ? "0 6px 6px 0"
                            : "0",
                      marginLeft: i > 0 ? -2 : 0,
                      zIndex: isActive || isComplement ? 2 : 1,
                      transform: isActive ? "translateY(-2px)" : "none",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(2,132,199,0.2)"
                        : "none",
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: isComplement
                          ? "#059669"
                          : isActive
                            ? "#0284c7"
                            : "#5c5248",
                      }}
                    >
                      {n}
                    </span>
                    {/* Index label */}
                    <span
                      className="absolute -bottom-5 text-[9px]"
                      style={{ color: "#c0b8b0" }}
                    >
                      {i}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HashMap visualization */}
        <div className="mt-6">
          <div
            className="text-[10px] font-semibold mb-2"
            style={{ color: "#a09080", letterSpacing: "0.08em" }}
          >
            HASH MAP{" "}
            <span style={{ color: "#c0b8b0", fontWeight: 400 }}>
              key → value
            </span>
          </div>

          {/* Hash buckets */}
          <div className="flex gap-2 flex-wrap">
            {step.map.length === 0 ? (
              <div
                className="flex items-center gap-2 h-9 px-3 rounded-lg text-xs italic"
                style={{
                  border: "2px dashed #d4cdc4",
                  color: "#c0b8b0",
                  background: "#faf8f5",
                }}
              >
                empty
              </div>
            ) : (
              step.map.map((entry) => {
                const isNew = animatingKey === entry.key;
                const isFound = step.found?.key === entry.key;
                return (
                  <div
                    key={entry.key}
                    className="flex items-center transition-all duration-500"
                    style={{
                      border: `2px solid ${isFound ? "#059669" : isNew ? "#0284c7" : "#d4cdc4"}`,
                      background: isFound
                        ? "rgba(5,150,105,0.08)"
                        : isNew
                          ? "rgba(2,132,199,0.06)"
                          : "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      transform: isNew ? "scale(1.05)" : "scale(1)",
                      boxShadow: isFound
                        ? "0 0 0 3px rgba(5,150,105,0.15)"
                        : isNew
                          ? "0 0 0 3px rgba(2,132,199,0.1)"
                          : "none",
                    }}
                  >
                    {/* Key cell */}
                    <div
                      className="px-3 py-2 text-sm font-bold"
                      style={{
                        borderRight: `2px solid ${isFound ? "#059669" : isNew ? "#0284c7" : "#d4cdc4"}`,
                        color: isFound
                          ? "#059669"
                          : isNew
                            ? "#0284c7"
                            : "#4a4038",
                        background: isFound
                          ? "rgba(5,150,105,0.05)"
                          : "transparent",
                        minWidth: 32,
                        textAlign: "center",
                      }}
                    >
                      {entry.key}
                    </div>
                    <div
                      className="px-3 py-2 text-xs"
                      style={{ color: "#8b7d6b" }}
                    >
                      idx{" "}
                      <span className="font-bold" style={{ color: "#4a4038" }}>
                        {entry.val}
                      </span>
                    </div>
                    {isFound && (
                      <div
                        className="pr-2 text-xs"
                        style={{ color: "#059669" }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Arrow / pointer showing current op */}
        {step.current && (
          <div className="flex items-start gap-2 pt-1">
            <div className="mt-0.5 text-xs" style={{ color: "#b0a090" }}>
              →
            </div>
            <div
              className="text-xs leading-relaxed"
              style={{ color: "#6b5f54" }}
            >
              {step.phase === "check" && (
                <>
                  Looking for{" "}
                  <span className="font-bold" style={{ color: "#0284c7" }}>
                    complement {step.current.complement}
                  </span>{" "}
                  in map…
                </>
              )}
              {step.phase === "miss" && (
                <>
                  Not found → store{" "}
                  <span className="font-bold" style={{ color: "#5c5248" }}>
                    map[{step.current.val}] = {step.current.i}
                  </span>
                </>
              )}
              {step.phase === "store" && (
                <>
                  Stored{" "}
                  <span className="font-bold" style={{ color: "#0284c7" }}>
                    map[{step.current.val}] = {step.current.i}
                  </span>
                  , next iteration
                </>
              )}
              {step.phase === "hit" && (
                <>
                  <span className="font-bold" style={{ color: "#059669" }}>
                    Found!
                  </span>{" "}
                  map[{step.current.complement}] = {step.found?.val} → return [
                  {step.found?.val}, {step.current.i}]
                </>
              )}
              {step.phase === "done" && (
                <span className="font-bold" style={{ color: "#059669" }}>
                  ✓ O(n) solution complete
                </span>
              )}
            </div>
          </div>
        )}
        {step.phase === "init" && (
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#b0a090" }}
          >
            <span>→</span>
            <span>Initializing…</span>
          </div>
        )}
      </div>

      {/* Status footer */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{
          borderTop: "1px solid #e8e2d9",
          background: "linear-gradient(90deg, #f5f3ef, #f0ede8)",
        }}
      >
        <span
          className="text-[10px]"
          style={{
            color: "#b0a090",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {step.label}
        </span>
        <div className="flex gap-3 text-[10px]" style={{ color: "#c0b8b0" }}>
          <span>Time O(n)</span>
          <span>Space O(n)</span>
        </div>
      </div>

      {/* Subtle paper texture lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, rgba(180,170,155,0.07) 27px, rgba(180,170,155,0.07) 28px)",
          borderRadius: 16,
        }}
      />
    </div>
  );
}
