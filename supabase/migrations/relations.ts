import { relations } from "drizzle-orm/relations";
import { concepts, quizAttempts, profiles, badges, userBadges, userProgress, spacedRepQueue, conceptPrerequisites } from "./schema";

export const quizAttemptsRelations = relations(quizAttempts, ({one}) => ({
	concept: one(concepts, {
		fields: [quizAttempts.conceptId],
		references: [concepts.id]
	}),
	profile: one(profiles, {
		fields: [quizAttempts.userId],
		references: [profiles.id]
	}),
}));

export const conceptsRelations = relations(concepts, ({many}) => ({
	quizAttempts: many(quizAttempts),
	userProgresses: many(userProgress),
	spacedRepQueues: many(spacedRepQueue),
	conceptPrerequisites_conceptId: many(conceptPrerequisites, {
		relationName: "conceptPrerequisites_conceptId_concepts_id"
	}),
	conceptPrerequisites_prerequisiteId: many(conceptPrerequisites, {
		relationName: "conceptPrerequisites_prerequisiteId_concepts_id"
	}),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	quizAttempts: many(quizAttempts),
	userBadges: many(userBadges),
	userProgresses: many(userProgress),
	spacedRepQueues: many(spacedRepQueue),
}));

export const userBadgesRelations = relations(userBadges, ({one}) => ({
	badge: one(badges, {
		fields: [userBadges.badgeId],
		references: [badges.id]
	}),
	profile: one(profiles, {
		fields: [userBadges.userId],
		references: [profiles.id]
	}),
}));

export const badgesRelations = relations(badges, ({many}) => ({
	userBadges: many(userBadges),
}));

export const userProgressRelations = relations(userProgress, ({one}) => ({
	concept: one(concepts, {
		fields: [userProgress.conceptId],
		references: [concepts.id]
	}),
	profile: one(profiles, {
		fields: [userProgress.userId],
		references: [profiles.id]
	}),
}));

export const spacedRepQueueRelations = relations(spacedRepQueue, ({one}) => ({
	concept: one(concepts, {
		fields: [spacedRepQueue.conceptId],
		references: [concepts.id]
	}),
	profile: one(profiles, {
		fields: [spacedRepQueue.userId],
		references: [profiles.id]
	}),
}));

export const conceptPrerequisitesRelations = relations(conceptPrerequisites, ({one}) => ({
	concept_conceptId: one(concepts, {
		fields: [conceptPrerequisites.conceptId],
		references: [concepts.id],
		relationName: "conceptPrerequisites_conceptId_concepts_id"
	}),
	concept_prerequisiteId: one(concepts, {
		fields: [conceptPrerequisites.prerequisiteId],
		references: [concepts.id],
		relationName: "conceptPrerequisites_prerequisiteId_concepts_id"
	}),
}));