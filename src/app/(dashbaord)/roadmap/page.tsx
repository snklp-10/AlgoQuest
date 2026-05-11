import { createClient } from "@/lib/supabase/server";
import { getPersonalizedRoadmap } from "@/lib/services/roadmap";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, Clock, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// -----------------------------
// Types
// -----------------------------
type ProgressStatus = "locked" | "unlocked" | "in_progress" | "completed";
type Difficulty = "beginner" | "intermediate" | "advanced";

type EnrichedConcept = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  orderIndex: number;
  status: ProgressStatus;
  isDue: boolean;
};

// -----------------------------
// Styling maps
// -----------------------------
const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

const STATUS_PROGRESS: Record<ProgressStatus, number> = {
  locked: 0,
  unlocked: 10,
  in_progress: 50,
  completed: 100,
};

const PROGRESS_COLOR: Record<ProgressStatus, string> = {
  locked: "",
  unlocked: "[&>div]:bg-slate-300",
  in_progress: "[&>div]:bg-amber-400",
  completed: "[&>div]:bg-emerald-500",
};

// -----------------------------
// Icon
// -----------------------------
function StatusIcon({ status }: { status: ProgressStatus }) {
  if (status === "completed")
    return <CheckCircle size={16} className="text-emerald-500" />;
  if (status === "in_progress")
    return <Flame size={16} className="text-amber-500" />;
  if (status === "locked")
    return <Lock size={16} className="text-muted-foreground" />;

  return <div className="w-4 h-4 rounded-full border-2 border-primary" />;
}

// -----------------------------
// Concept Card
// -----------------------------
function ConceptCard({ concept }: { concept: EnrichedConcept }) {
  const isLocked = concept.status === "locked";
  const hasProgress =
    concept.status === "in_progress" || concept.status === "completed";

  return (
    <Card
      className={cn(
        "relative rounded-2xl border transition-all duration-200",
        isLocked
          ? "opacity-60 grayscale pointer-events-none"
          : "hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 cursor-pointer",
        concept.isDue && !isLocked && "border-orange-200 bg-orange-50/40",
      )}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock size={14} />
            Locked
          </div>
        </div>
      )}

      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold leading-tight">
            <StatusIcon status={concept.status} />
            {concept.title}
          </CardTitle>

          <p className="text-[11px] text-muted-foreground capitalize">
            {concept.category.replace(/_/g, " ")}
          </p>
        </div>

        <CardAction>
          <Badge
            variant="outline"
            className={cn(DIFFICULTY_COLOR[concept.difficulty])}
          >
            {concept.difficulty}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {concept.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {concept.description}
          </p>
        )}

        {/* Due badge */}
        {concept.isDue && !isLocked && (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 w-fit bg-orange-100 text-orange-700 border-orange-200"
          >
            <Clock size={10} /> Due for review
          </Badge>
        )}

        {/* Progress */}
        {hasProgress && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>
                {concept.status === "completed" ? "Completed" : "In progress"}
              </span>
              <span>{STATUS_PROGRESS[concept.status]}%</span>
            </div>

            <Progress
              value={STATUS_PROGRESS[concept.status]}
              className={cn("h-1.5", PROGRESS_COLOR[concept.status])}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// -----------------------------
// Page
// -----------------------------
export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  if (!profile?.onboardingCompleted) redirect("/onboarding");

  const roadmap = await getPersonalizedRoadmap(
    user.id,
    profile.goal ?? "learning",
    profile.skillLevel ?? "beginner",
  );

  // 🔥 Due first
  const dueConcepts = roadmap.due;

  // 📚 Rest (continuous flow)
  const remainingConcepts: EnrichedConcept[] = [
    ...roadmap.recommended,
    ...roadmap.locked,
    ...roadmap.completed,
  ].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div className="absolute inset-0 hero-grid" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Your <span className="gradient-text">Roadmap</span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Focus on what’s due. Progress naturally through your path.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium">
            <Sparkles size={14} />
            Personalized learning path
          </div>
        </div>

        {/* 🔥 Due Section */}
        {dueConcepts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Due for review
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dueConcepts.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          </div>
        )}

        {/* 📚 Continuous list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {remainingConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </div>
    </div>
  );
}
