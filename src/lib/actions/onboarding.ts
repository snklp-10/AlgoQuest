"use server";

import { upsertProfile } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

interface SaveOnboardingProfileInput {
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { username, skillLevel, goal, preferences } = input;

  await upsertProfile({
    id: user.id,
    username,
    skillLevel,
    goal,
    preferences,
  });
}
