import { getRoadmap } from "@/lib/db/queries";

// -----------------------------
// Types
// -----------------------------
type Difficulty = "beginner" | "intermediate" | "advanced";
type SkillLevel = "beginner" | "intermediate" | "advanced";
type ProgressStatus = "locked" | "unlocked" | "in_progress" | "completed";

type RoadmapConcept = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  difficulty: Difficulty;
  orderIndex: number;
  status: ProgressStatus;
  isUnlocked: boolean;
  dueAt?: string | Date | null;
};

type EnrichedConcept = RoadmapConcept & {
  isCompleted: boolean;
  isInProgress: boolean;
  isDue: boolean;
  isGoalRelevant: boolean;
  score: number;
};

// -----------------------------
// Config
// -----------------------------
const SKILL_STARTING_THRESHOLD: Record<SkillLevel, number> = {
  beginner: 2, // Arrays + Strings visible on day one
  intermediate: 4, // Arrays, Strings, Linked List, Recursion
  advanced: Infinity, // everything prereq-met is visible
};

const GOAL_CONFIG: Record<string, string[]> = {
  performance: ["trees", "graphs", "sorting", "dp", "searching"],
  structured: ["arrays", "stacks", "queues", "linked_list", "fundamentals"],
  exploratory: [],
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

// -----------------------------
// Helpers
// -----------------------------
function mapGoal(goal: string): keyof typeof GOAL_CONFIG {
  if (goal === "interview" || goal === "skills") return "performance";
  if (goal === "preparation" || goal === "career_switch" || goal === "learning")
    return "structured";
  console.warn(
    `[getPersonalizedRoadmap] Unknown goal "${goal}", defaulting to structured`,
  );
  return "structured";
}

function sortByScoreThenDifficulty(a: EnrichedConcept, b: EnrichedConcept) {
  if (b.score !== a.score) return b.score - a.score;
  return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
}

// -----------------------------
// Main function
// -----------------------------
export async function getPersonalizedRoadmap(
  userId: string,
  goal: string,
  skillLevel: SkillLevel,
) {
  const roadmap = (await getRoadmap(userId)) as RoadmapConcept[];

  const goalType = mapGoal(goal);
  const priorityCategories = GOAL_CONFIG[goalType] ?? [];
  const startingThreshold = SKILL_STARTING_THRESHOLD[skillLevel] ?? 2;
  const now = new Date();

  // Sort by orderIndex so the roadmap is always in learning sequence
  const sorted = [...roadmap].sort((a, b) => a.orderIndex - b.orderIndex);

  const enriched: EnrichedConcept[] = sorted.map((c) => {
    const isCompleted = c.status === "completed";
    const isInProgress = c.status === "in_progress";
    const isDue =
      c.dueAt != null && new Date(c.dueAt).getTime() <= now.getTime();
    const category = c.category ?? "";
    const isGoalRelevant = priorityCategories.includes(category);

    // A concept is visible if any of these are true:
    //   1. User has already started or completed it — always show, never re-lock
    //   2. Prerequisites are met AND orderIndex is within the skill starting window
    //   3. Prerequisites are met AND user has completed at least one of its direct prereqs
    //      (natural progression — completing Arrays unlocks Stacks regardless of threshold)
    const alreadyTouched = isCompleted || isInProgress;
    const withinStartingWindow =
      c.isUnlocked && c.orderIndex <= startingThreshold;
    const unlockedByProgress = c.isUnlocked && c.orderIndex > startingThreshold;

    const isVisible =
      alreadyTouched || withinStartingWindow || unlockedByProgress;

    const effectiveStatus: ProgressStatus = isVisible
      ? c.status === "locked"
        ? "unlocked"
        : c.status
      : "locked";

    // Scoring — only meaningful for visible, non-completed concepts
    let score = 0;
    if (isGoalRelevant) score += 3;
    if (isDue && !isCompleted) score += 5;
    if (isInProgress) score += 4; // already in flight — surface at the top
    if (c.isUnlocked && !isCompleted) score += 2;

    return {
      ...c,
      category,
      status: effectiveStatus,
      isUnlocked: isVisible,
      isCompleted,
      isInProgress,
      isDue,
      isGoalRelevant,
      score,
    };
  });

  // -----------------------------
  // Sections
  // -----------------------------

  // due: overdue reviews, excluding completed, sorted oldest-first
  const due = enriched
    .filter((c) => c.isDue && !c.isCompleted)
    .sort(
      (a, b) =>
        new Date(a.dueAt ?? 0).getTime() - new Date(b.dueAt ?? 0).getTime(),
    );

  const dueIds = new Set(due.map((c) => c.id));

  // recommended: visible, not completed, not already in due
  const recommended = enriched
    .filter((c) => c.isUnlocked && !c.isCompleted && !dueIds.has(c.id))
    .sort(sortByScoreThenDifficulty);

  // locked: not yet visible but goal-relevant — shows the user what's coming
  const locked = enriched
    .filter((c) => !c.isUnlocked && c.isGoalRelevant)
    .sort(sortByScoreThenDifficulty);

  // completed: in learning order
  const completed = enriched
    .filter((c) => c.isCompleted)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return { recommended, due, locked, completed };
}
