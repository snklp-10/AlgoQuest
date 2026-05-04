import { getRoadmap } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// -----------------------------
// Types
// -----------------------------
type Difficulty = "beginner" | "intermediate" | "advanced";

type RoadmapConcept = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  status: "locked" | "unlocked" | "in_progress" | "completed";
  isUnlocked: boolean;
  dueAt?: string | Date | null;
};

type EnrichedConcept = RoadmapConcept & {
  isCompleted: boolean;
  isDue: boolean;
  isGoalRelevant: boolean;
  score: number;
};

// -----------------------------
// Goal mapping
// -----------------------------
function mapGoal(goal: string) {
  if (goal === "interview" || goal === "skills") return "performance";
  if (goal === "preparation" || goal === "career_switch") return "structured";
  // FIX: "learning" and any unknown value now fall to "structured" instead of
  // "exploratory". "exploratory" had an empty GOAL_CONFIG so no concept was
  // ever flagged as goal-relevant, making the scoring useless.
  return "structured";
}

// -----------------------------
// Config
// -----------------------------
// FIX: Categories are taken from the actual concepts table.
// The original used slugs ("trees", "graphs") in some places and
// category strings ("arrays", "stacks") in others — they aren't the same.
// Every value here must match the `category` column, not the slug.
const GOAL_CONFIG: Record<string, string[]> = {
  // interview / skills → prioritise the heavy hitters
  performance: ["trees", "graphs", "sorting", "dp", "searching"],
  // preparation / career_switch / learning → build fundamentals first
  structured: ["arrays", "stacks", "queues", "linked_list", "fundamentals"],
  // exploratory → no priority filter, surface everything equally
  exploratory: [],
};

// Properly typed difficulty order
const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

// -----------------------------
// Sorting helper
// -----------------------------
function sortByScoreThenDifficulty(a: EnrichedConcept, b: EnrichedConcept) {
  if (b.score !== a.score) return b.score - a.score;
  return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
}

// -----------------------------
// Main function
// -----------------------------
export async function getPersonalizedRoadmap(userId: string) {
  const roadmap = (await getRoadmap(userId)) as RoadmapConcept[];

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));

  const goalType = mapGoal(profile?.goal || "learning");
  const priorityCategories = GOAL_CONFIG[goalType] || [];

  const now = new Date();

  const enriched: EnrichedConcept[] = roadmap.map((c) => {
    const isCompleted = c.status === "completed";
    const isUnlocked = c.isUnlocked;

    // FIX: dueAt is now populated by getRoadmap (joined from spacedRepQueue).
    // Previously dueAt was always undefined because it was never returned
    // from getRoadmap, so isDue was always false and the "due" section
    // was always empty.
    const isDue =
      c.dueAt != null && new Date(c.dueAt).getTime() <= now.getTime();

    const category = c.category ?? "";
    const isGoalRelevant = priorityCategories.includes(category);

    let score = 0;
    if (isGoalRelevant) score += 3;
    if (isDue) score += 5;
    if (!isCompleted) score += 2;

    return {
      ...c,
      category,
      isCompleted,
      isUnlocked,
      isDue,
      isGoalRelevant,
      score,
    };
  });

  // -----------------------------
  // Sections
  // -----------------------------

  const recommended = enriched
    .filter((c) => c.isUnlocked && !c.isCompleted)
    .sort(sortByScoreThenDifficulty);

  const due = enriched
    .filter((c) => c.isDue)
    .sort((a, b) => {
      const aTime = new Date(a.dueAt ?? 0).getTime();
      const bTime = new Date(b.dueAt ?? 0).getTime();
      return aTime - bTime;
    });

  const locked = enriched
    .filter((c) => !c.isUnlocked && c.isGoalRelevant)
    .sort(sortByScoreThenDifficulty);

  const completed = enriched.filter((c) => c.isCompleted);

  return {
    recommended,
    due,
    locked,
    completed,
  };
}
