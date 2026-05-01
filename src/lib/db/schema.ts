import {
  pgTable,
  uuid,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
  jsonb,
  unique,
  pgEnum,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// --- ENUMS ---
export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const progressEnum = pgEnum("progress_status", [
  "locked",
  "unlocked",
  "in_progress",
  "completed",
]);

// --- PROFILES ---
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),

  username: text("username").unique(),
  avatarUrl: text("avatar_url"),
  goal: text("goal"),
  skillLevel: skillLevelEnum("skill_level"),

  xp: integer("xp").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),

  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- CONCEPTS ---
export const concepts = pgTable("concepts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),

  difficulty: difficultyEnum("difficulty"),

  xpReward: integer("xp_reward").default(10).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- CONCEPT GRAPH (FIXED) ---
export const conceptPrerequisites = pgTable(
  "concept_prerequisites",
  {
    conceptId: uuid("concept_id").references(() => concepts.id, {
      onDelete: "cascade",
    }),
    prerequisiteId: uuid("prerequisite_id").references(() => concepts.id, {
      onDelete: "cascade",
    }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.conceptId, t.prerequisiteId] }),
  }),
);

// --- USER PROGRESS ---
export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    conceptId: uuid("concept_id")
      .references(() => concepts.id, { onDelete: "cascade" })
      .notNull(),

    status: progressEnum("status").default("locked").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => ({
    uniq: unique().on(t.userId, t.conceptId),
    idx: index("user_progress_user_idx").on(t.userId),
  }),
);

// --- QUIZ ATTEMPTS ---
export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    conceptId: uuid("concept_id")
      .references(() => concepts.id, { onDelete: "cascade" })
      .notNull(),

    score: integer("score"),
    maxScore: integer("max_score"),

    answers: jsonb("answers"),

    xpEarned: integer("xp_earned").default(0).notNull(),

    attemptedAt: timestamp("attempted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    idx: index("quiz_user_concept_idx").on(t.userId, t.conceptId),
  }),
);

// --- SPACED REP QUEUE ---
export const spacedRepQueue = pgTable(
  "spaced_rep_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    conceptId: uuid("concept_id")
      .references(() => concepts.id, { onDelete: "cascade" })
      .notNull(),

    easinessFactor: doublePrecision("easiness_factor").default(2.5).notNull(),
    intervalDays: integer("interval_days").default(1).notNull(),
    repetitions: integer("repetitions").default(0).notNull(),

    dueAt: timestamp("due_at", { withTimezone: true }).defaultNow().notNull(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  },
  (t) => ({
    uniq: unique().on(t.userId, t.conceptId),
    dueIdx: index("spaced_rep_due_idx").on(t.userId, t.dueAt),
  }),
);

// --- BADGES ---
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),

  conditionType: text("condition_type"),
  conditionValue: integer("condition_value"),
});

export const userBadges = pgTable(
  "user_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    badgeId: uuid("badge_id")
      .references(() => badges.id, { onDelete: "cascade" })
      .notNull(),

    earnedAt: timestamp("earned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uniq: unique().on(t.userId, t.badgeId),
  }),
);

// --- RELATIONS ---
export const profilesRelations = relations(profiles, ({ many }) => ({
  progress: many(userProgress),
  quizAttempts: many(quizAttempts),
  spacedRepQueue: many(spacedRepQueue),
  badges: many(userBadges),
}));

export const conceptsRelations = relations(concepts, ({ many }) => ({
  progress: many(userProgress),
  quizAttempts: many(quizAttempts),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(profiles, {
    fields: [userProgress.userId],
    references: [profiles.id],
  }),
  concept: one(concepts, {
    fields: [userProgress.conceptId],
    references: [concepts.id],
  }),
}));
