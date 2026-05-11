import { pgTable, unique, uuid, text, integer, timestamp, jsonb, boolean, index, foreignKey, doublePrecision, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const difficulty = pgEnum("difficulty", ['beginner', 'intermediate', 'advanced'])
export const progressStatus = pgEnum("progress_status", ['locked', 'unlocked', 'in_progress', 'completed'])
export const skillLevel = pgEnum("skill_level", ['beginner', 'intermediate', 'advanced'])


export const badges = pgTable("badges", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	iconUrl: text("icon_url"),
	conditionType: text("condition_type"),
	conditionValue: integer("condition_value"),
}, (table) => [
	unique("badges_name_unique").on(table.name),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	username: text(),
	avatarUrl: text("avatar_url"),
	goal: text(),
	skillLevel: skillLevel("skill_level"),
	xp: integer().default(0).notNull(),
	streak: integer().default(0).notNull(),
	lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	preferences: jsonb(),
	onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
}, (table) => [
	unique("profiles_username_unique").on(table.username),
]);

export const concepts = pgTable("concepts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text(),
	category: text().notNull(),
	difficulty: difficulty(),
	xpReward: integer("xp_reward").default(10).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orderIndex: integer("order_index").default(0).notNull(),
}, (table) => [
	index("concept_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	unique("concepts_slug_unique").on(table.slug),
]);

export const quizAttempts = pgTable("quiz_attempts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	conceptId: uuid("concept_id").notNull(),
	score: integer(),
	maxScore: integer("max_score"),
	answers: jsonb(),
	xpEarned: integer("xp_earned").default(0).notNull(),
	attemptedAt: timestamp("attempted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("quiz_user_concept_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.conceptId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.conceptId],
			foreignColumns: [concepts.id],
			name: "quiz_attempts_concept_id_concepts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "quiz_attempts_user_id_profiles_id_fk"
		}).onDelete("cascade"),
]);

export const userBadges = pgTable("user_badges", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	badgeId: uuid("badge_id").notNull(),
	earnedAt: timestamp("earned_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.badgeId],
			foreignColumns: [badges.id],
			name: "user_badges_badge_id_badges_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_badges_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("user_badges_user_id_badge_id_unique").on(table.userId, table.badgeId),
]);

export const userProgress = pgTable("user_progress", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	conceptId: uuid("concept_id").notNull(),
	status: progressStatus().default('locked').notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("user_progress_user_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.conceptId],
			foreignColumns: [concepts.id],
			name: "user_progress_concept_id_concepts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_progress_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("user_progress_user_id_concept_id_unique").on(table.userId, table.conceptId),
]);

export const spacedRepQueue = pgTable("spaced_rep_queue", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	conceptId: uuid("concept_id").notNull(),
	easinessFactor: doublePrecision("easiness_factor").default(2.5).notNull(),
	intervalDays: integer("interval_days").default(1).notNull(),
	repetitions: integer().default(0).notNull(),
	dueAt: timestamp("due_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("spaced_rep_due_idx").using("btree", table.userId.asc().nullsLast().op("timestamptz_ops"), table.dueAt.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.conceptId],
			foreignColumns: [concepts.id],
			name: "spaced_rep_queue_concept_id_concepts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "spaced_rep_queue_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("spaced_rep_queue_user_id_concept_id_unique").on(table.userId, table.conceptId),
]);

export const conceptPrerequisites = pgTable("concept_prerequisites", {
	conceptId: uuid("concept_id").notNull(),
	prerequisiteId: uuid("prerequisite_id").notNull(),
}, (table) => [
	index("cp_concept_idx").using("btree", table.conceptId.asc().nullsLast().op("uuid_ops")),
	index("cp_prereq_idx").using("btree", table.prerequisiteId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.conceptId],
			foreignColumns: [concepts.id],
			name: "concept_prerequisites_concept_id_concepts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.prerequisiteId],
			foreignColumns: [concepts.id],
			name: "concept_prerequisites_prerequisite_id_concepts_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.conceptId, table.prerequisiteId], name: "concept_prerequisites_concept_id_prerequisite_id_pk"}),
]);
