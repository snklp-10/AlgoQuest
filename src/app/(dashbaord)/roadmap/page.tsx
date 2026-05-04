import { createClient } from "@/lib/supabase/server";
import { getPersonalizedRoadmap } from "@/lib/services/roadmap";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function RoadmapPage() {
  // ✅ FIX: await the client
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔴 Auth guard
  if (!user) {
    redirect("/login");
  }

  // 🔴 Fetch profile
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  // 🔴 Onboarding guard
  if (!profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  // ✅ Get roadmap
  const roadmap = await getPersonalizedRoadmap(user.id);

  return <div className="p-6">page</div>;
}
