import { db } from "./index";
import {
  profiles,
  userProgress,
  concepts,
  spacedRepQueue,
  conceptPrerequisites,
} from "./schema";
import {
  eq,
  count,
  and,
  lte,
  asc,
  desc,
  sql,
  isNotNull,
  isNull,
  or,
} from "drizzle-orm";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(last: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(last, yesterday);
}

/**
 * Reusable SQL fragment: true when ALL prerequisites for a concept are
 * completed by the given user (vacuously true when there are no prereqs).
 *
 * Centralised so getRoadmap and getUnlockableConcepts stay in sync.
 */
function allPrerequisitesMet(userId: string) {
  return sql`
    NOT EXISTS (
      SELECT 1
      FROM concept_prerequisites cp
      LEFT JOIN user_progress up
        ON up.concept_id = cp.prerequisite_id
        AND up.user_id = ${userId}
        AND up.status = 'completed'
      WHERE cp.concept_id = ${concepts.id}
        AND up.id IS NULL
    )
  `;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function checkUsernameAvailable(
  username: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  return !existing;
}

export async function upsertProfile({
  id,
  username,
  skillLevel,
  goal,
  preferences,
}: {
  id: string;
  username: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  goal: string;
  preferences: {
    target_companies: string[];
    preferred_languages: string[];
    weekly_hours: number;
  };
}) {
  const [profile] = await db
    .insert(profiles)
    .values({
      id,
      username,
      skillLevel,
      goal,
      preferences,
      xp: 0,
      streak: 0,
      onboardingCompleted: true,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        username,
        skillLevel,
        goal,
        preferences,
        onboardingCompleted: true,
      },
    })
    .returning();

  return profile;
}

export async function getDashboard(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));

  const [dueCount] = await db
    .select({ count: count() })
    .from(spacedRepQueue)
    .where(
      and(
        eq(spacedRepQueue.userId, userId),
        lte(spacedRepQueue.dueAt, new Date()),
      ),
    );

  const [completedCount] = await db
    .select({ count: count() })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.status, "completed"),
      ),
    );

  return {
    profile,
    dueReviews: dueCount.count,
    completedConcepts: completedCount.count,
  };
}

export async function getDueReviews(userId: string, limit = 10) {
  return db
    .select()
    .from(spacedRepQueue)
    .where(
      and(
        eq(spacedRepQueue.userId, userId),
        lte(spacedRepQueue.dueAt, new Date()),
      ),
    )
    .orderBy(asc(spacedRepQueue.dueAt))
    .limit(limit);
}

/**
 * Returns concepts where:
 *   1. All prerequisites are completed by the user (or there are none), AND
 *   2. The user has NOT yet started the concept (no progress row, or status = 'locked')
 */
export async function getUnlockableConcepts(userId: string) {
  return db
    .select({
      id: concepts.id,
      title: concepts.title,
      slug: concepts.slug,
      // null here means no progress row yet — treat as 'locked' in the UI
      status: userProgress.status,
    })
    .from(concepts)
    .leftJoin(
      userProgress,
      and(
        eq(userProgress.conceptId, concepts.id),
        eq(userProgress.userId, userId),
      ),
    )
    .where(
      and(
        allPrerequisitesMet(userId),
        // Exclude concepts the user has already started or finished
        or(isNull(userProgress.status), eq(userProgress.status, "locked")),
      ),
    );
}

/**
 * Top-N users by XP.
 * Filters out profiles with no username so half-onboarded accounts
 * don't appear on the leaderboard.
 */
export async function getLeaderboard(limit = 20) {
  return db
    .select({
      id: profiles.id,
      username: profiles.username,
      xp: profiles.xp,
    })
    .from(profiles)
    .where(isNotNull(profiles.username))
    .orderBy(desc(profiles.xp))
    .limit(limit);
}

/**
 * Updates the user's streak inside an existing transaction.
 *
 * Always call with a tx — never with the bare db object — so the streak
 * update is atomic with whatever triggered it.
 */
export async function updateStreak(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
) {
  const [profile] = await tx
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));

  if (!profile) return;

  const now = new Date();
  const last = profile.lastActiveAt;

  let newStreak = profile.streak ?? 0;

  if (!last) {
    newStreak = 1;
  } else if (isSameDay(last, now)) {
    newStreak = profile.streak; // already counted today
  } else if (isYesterday(last, now)) {
    newStreak = profile.streak + 1;
  } else {
    newStreak = 1; // streak broken
  }

  await tx
    .update(profiles)
    .set({ streak: newStreak, lastActiveAt: now })
    .where(eq(profiles.id, userId));

  return newStreak;
}

/**
 * quality scale:
 *   5 = perfect
 *   4 = correct with hesitation
 *   3 = correct but hard
 *   2 = incorrect but familiar
 *   1 = wrong
 *   0 = blackout
 *
 * Progress rules:
 *   quality < 3                    → no progress update (failed recall)
 *   quality >= 3, repetitions < 3  → in_progress
 *   quality >= 3, repetitions >= 3 → completed
 *
 * All writes are wrapped in a single transaction.
 */
const XP_PER_REVIEW = 5;
const REPETITIONS_TO_COMPLETE = 3;

export async function reviewConcept({
  userId,
  conceptId,
  quality,
}: {
  userId: string;
  conceptId: string;
  quality: number;
}) {
  return await db.transaction(async (tx) => {
    // 1. GET OR CREATE QUEUE ENTRY
    let [entry] = await tx
      .select()
      .from(spacedRepQueue)
      .where(
        and(
          eq(spacedRepQueue.userId, userId),
          eq(spacedRepQueue.conceptId, conceptId),
        ),
      );

    if (!entry) {
      const [created] = await tx
        .insert(spacedRepQueue)
        .values({
          userId,
          conceptId,
          easinessFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
        })
        .returning();
      entry = created;
    }

    let { easinessFactor, intervalDays, repetitions } = entry;

    // 2. SM-2
    if (quality < 3) {
      // FIX: on failed recall, reset interval/repetitions but do NOT touch EF.
      // The original code updated EF unconditionally, which progressively
      // tanks EF on every failure — not part of the SM-2 spec.
      repetitions = 0;
      intervalDays = 1;
    } else {
      if (repetitions === 0) {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easinessFactor);
      }
      repetitions += 1;

      // EF is only updated on successful recall (quality >= 3)
      easinessFactor =
        easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easinessFactor < 1.3) easinessFactor = 1.3;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);

    // 3. UPDATE SPACED REP QUEUE
    await tx
      .update(spacedRepQueue)
      .set({
        easinessFactor,
        intervalDays,
        repetitions,
        dueAt: nextReview,
        lastReviewedAt: new Date(),
      })
      .where(
        and(
          eq(spacedRepQueue.userId, userId),
          eq(spacedRepQueue.conceptId, conceptId),
        ),
      );

    // 4. UPDATE USER PROGRESS
    // Only on successful recall. Status graduates from in_progress → completed
    // once the user hits REPETITIONS_TO_COMPLETE successful reviews.
    if (quality >= 3) {
      const newStatus =
        repetitions >= REPETITIONS_TO_COMPLETE ? "completed" : "in_progress";

      await tx
        .insert(userProgress)
        .values({
          userId,
          conceptId,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
        })
        .onConflictDoUpdate({
          target: [userProgress.userId, userProgress.conceptId],
          set: {
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date() : null,
          },
        });

      // 5. AWARD XP
      await tx
        .update(profiles)
        .set({ xp: sql`${profiles.xp} + ${XP_PER_REVIEW}` })
        .where(eq(profiles.id, userId));
    }

    // 6. UPDATE STREAK
    await updateStreak(tx, userId);

    return { nextReview, intervalDays, easinessFactor, repetitions };
  });
}

/**
 * Returns all concepts the user can see on their roadmap, joined with
 * their spaced-rep due date so the roadmap service can surface overdue
 * reviews correctly.
 *
 * FIX: The original returned only concepts + progress. dueAt lived on
 * spacedRepQueue but was never joined, so the "due" section in the
 * roadmap was always empty. We now left-join spacedRepQueue and expose
 * dueAt alongside each concept.
 *
 * status defaults to "unlocked" (not "locked") when the concept has no
 * progress row but all its prerequisites are met — fixing the
 * isUnlocked:true / status:"locked" contradiction in the original.
 */
export async function getRoadmap(userId: string) {
  // 1. all concepts
  const allConcepts = await db.select().from(concepts);

  // 2. user progress
  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  const progressMap = new Map(progress.map((p) => [p.conceptId, p]));

  // 3. spaced-rep queue (for dueAt)
  const queue = await db
    .select()
    .from(spacedRepQueue)
    .where(eq(spacedRepQueue.userId, userId));

  const queueMap = new Map(queue.map((q) => [q.conceptId, q]));

  // 4. prerequisite graph
  const prereqs = await db.select().from(conceptPrerequisites);

  const prereqMap = new Map<string, string[]>();
  for (const row of prereqs) {
    if (!prereqMap.has(row.conceptId)) {
      prereqMap.set(row.conceptId, []);
    }
    prereqMap.get(row.conceptId)!.push(row.prerequisiteId);
  }

  // 5. compute unlock state
  return allConcepts.map((concept) => {
    const conceptProgress = progressMap.get(concept.id);
    const queueEntry = queueMap.get(concept.id);

    const prereqIds = prereqMap.get(concept.id) || [];

    const isUnlocked = prereqIds.every((pid) => {
      const p = progressMap.get(pid);
      return p?.status === "completed";
    });

    // FIX: don't default to "locked" when prerequisites are met but the
    // user simply hasn't started yet — use "unlocked" so isUnlocked and
    // status stay consistent.
    const status =
      conceptProgress?.status ?? (isUnlocked ? "unlocked" : "locked");

    return {
      ...concept,
      status,
      isUnlocked,
      // FIX: expose dueAt from the spaced-rep queue so the roadmap
      // service can populate the "due" section correctly.
      dueAt: queueEntry?.dueAt ?? null,
    };
  });
}
