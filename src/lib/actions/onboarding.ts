"use server";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

interface SaveOnboardingProfileInput {
  id: string;
  username: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  goal: string;
  preferences: {
    target_companies: string[];
    preferred_languages: string[];
    weekly_hours: number;
  };
}

export async function saveOnboardingProfile(
  input: SaveOnboardingProfileInput,
): Promise<void> {
  const { id, username, skillLevel, goal, preferences } = input;

  await db.insert(profiles).values({
    id,
    username,
    skillLevel,
    goal,
    preferences,
    lastActiveAt: new Date(),
  });
}
