"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { saveOnboardingProfile } from "@/lib/actions/onboarding";
import {
  Code2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  Building2,
  Code,
  Clock,
  Sparkles,
  AlertCircle,
  AtSign,
  Loader2,
  XCircle,
} from "lucide-react";

const TOTAL_STEPS = 5;

const goalOptions = [
  {
    value: "interview",
    label: "Crack coding interviews",
    icon: Target,
    desc: "Prepare for technical rounds at top companies",
  },
  {
    value: "preparation",
    label: "Systematic DSA prep",
    icon: CheckCircle,
    desc: "Build a solid foundation step by step",
  },
  {
    value: "learning",
    label: "Learn for fun",
    icon: Sparkles,
    desc: "Explore algorithms out of curiosity",
  },
  {
    value: "career_switch",
    label: "Switch to tech",
    icon: Code,
    desc: "Transition into a software engineering role",
  },
  {
    value: "skills",
    label: "Level up skills",
    icon: Building2,
    desc: "Sharpen problem-solving for current role",
  },
];

const companyOptions = [
  "Google",
  "Meta",
  "Amazon",
  "Apple",
  "Microsoft",
  "Netflix",
  "Stripe",
  "Uber",
  "Airbnb",
  "LinkedIn",
  "ByteDance",
  "Snapchat",
  "Pinterest",
  "Goldman Sachs",
  "Jane Street",
];

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "typescript", label: "TypeScript" },
  { value: "csharp", label: "C#" },
];

const hoursOptions = [
  { value: 3, label: "1-3 hrs", desc: "Casual pace" },
  { value: 7, label: "4-7 hrs", desc: "Steady pace" },
  { value: 14, label: "8-14 hrs", desc: "Focused" },
  { value: 21, label: "15-21 hrs", desc: "Intensive" },
  { value: 30, label: "22-30 hrs", desc: "Bootcamp mode" },
];

const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  experience_level: z.enum(
    ["beginner", "intermediate", "advanced"],
    "Select your level",
  ),
  primary_goal: z.string().min(1, "Choose a goal"),
  target_companies: z.array(z.string()).min(1, "Pick at least one company"),
  preferred_languages: z.array(z.string()).min(1, "Pick at least one language"),
  weekly_hours: z.number().min(1, "Select your weekly commitment"),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;
type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function StepIndicator({ step, current }: { step: number; current: number }) {
  const isActive = step === current;
  const isDone = step < current;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
          isDone
            ? "bg-blue-500 text-white"
            : isActive
              ? "bg-blue-500 text-white ring-4 ring-blue-100"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {isDone ? <CheckCircle size={16} /> : step}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameMessage, setUsernameMessage] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      setFullName(user.user_metadata?.full_name ?? "");
    };
    fetchUser();
  }, [router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: "",
      experience_level: undefined,
      primary_goal: "",
      target_companies: [],
      preferred_languages: [],
      weekly_hours: 0,
    },
  });

  const watched = watch();

  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameStatus("invalid");
      setUsernameMessage("Only letters, numbers, and underscores allowed");
      return;
    }
    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");
    try {
      const res = await fetch(
        `/api/username?username=${encodeURIComponent(value)}`,
      );
      const data = await res.json();
      if (data.error) {
        setUsernameStatus("invalid");
        setUsernameMessage(data.error);
      } else if (data.available) {
        setUsernameStatus("available");
        setUsernameMessage("@" + value + " is available");
      } else {
        setUsernameStatus("taken");
        setUsernameMessage("@" + value + " is already taken");
      }
    } catch {
      setUsernameStatus("idle");
      setUsernameMessage("");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsername(watched.username);
    }, 500);
    return () => clearTimeout(timer);
  }, [watched.username, checkUsername]);

  const stepFields: (keyof OnboardingForm)[][] = [
    ["username", "experience_level"],
    ["primary_goal"],
    ["target_companies"],
    ["preferred_languages"],
    ["weekly_hours"],
  ];

  const canAdvance = async (currentStep: number): Promise<boolean> => {
    if (currentStep === 1 && usernameStatus !== "available") return false;
    return trigger(stepFields[currentStep - 1] as any);
  };

  const next = async () => {
    const valid = await canAdvance(step);
    if (valid && step < TOTAL_STEPS) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: OnboardingForm) => {
    if (usernameStatus !== "available") {
      setServerError("Please choose an available username.");
      return;
    }
    setLoading(true);
    setServerError(null);
    try {
      await saveOnboardingProfile({
        username: data.username,
        skillLevel: data.experience_level,
        goal: data.primary_goal,
        preferences: {
          target_companies: data.target_companies,
          preferred_languages: data.preferred_languages,
          weekly_hours: data.weekly_hours,
        },
      });

      router.push("/(dashbaord)/roadmap");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const toggleArrayValue = (
    field: "target_companies" | "preferred_languages",
    value: string,
  ) => {
    const current = watched[field] as string[];
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex flex-col">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              algo<span className="text-blue-500">mind</span>
            </span>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-6 pt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600">
            Step {step} of {TOTAL_STEPS}
          </p>
          <p className="text-sm text-slate-400">
            {Math.round(progress)}% complete
          </p>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <StepIndicator key={i} step={i + 1} current={step} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center pt-8 pb-16 px-6">
        <div className="w-full max-w-2xl">
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-6">
              <AlertCircle size={14} className="shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Username & Experience */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName ? `Hey, ${fullName.split(" ")[0]}` : "Welcome"} 👋
                  </h2>
                  <p className="text-slate-500 mt-1">
                    Pick a username for your profile.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-slate-700"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <AtSign
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      id="username"
                      placeholder="your_username"
                      autoComplete="off"
                      {...register("username")}
                      className={`h-12 pl-9 pr-10 text-base transition-all ${
                        errors.username ||
                        usernameStatus === "taken" ||
                        usernameStatus === "invalid"
                          ? "border-red-300 focus:border-red-400"
                          : usernameStatus === "available"
                            ? "border-green-400 focus:border-green-500"
                            : "border-slate-200 focus:border-blue-400"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && (
                        <Loader2
                          size={16}
                          className="animate-spin text-slate-400"
                        />
                      )}
                      {usernameStatus === "available" && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {(usernameStatus === "taken" ||
                        usernameStatus === "invalid") && (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                  </div>
                  {usernameMessage && (
                    <p
                      className={`text-xs mt-1 ${usernameStatus === "available" ? "text-green-600" : "text-red-500"}`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    3-20 characters. Letters, numbers, underscores only.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">
                    How experienced are you with DSA?
                  </Label>
                  <div className="grid gap-3">
                    {[
                      {
                        value: "beginner",
                        label: "Beginner",
                        desc: "New to data structures and algorithms",
                      },
                      {
                        value: "intermediate",
                        label: "Intermediate",
                        desc: "Know the basics, need more practice",
                      },
                      {
                        value: "advanced",
                        label: "Advanced",
                        desc: "Comfortable solving medium/hard problems",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${watched.experience_level === opt.value ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("experience_level")}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${watched.experience_level === opt.value ? "border-blue-500" : "border-slate-300"}`}
                        >
                          {watched.experience_level === opt.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {opt.label}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.experience_level && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.experience_level.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Primary Goal */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    What&apos;s your main goal?
                  </h2>
                  <p className="text-slate-500 mt-1">
                    We&apos;ll customize your roadmap based on this.
                  </p>
                </div>
                <div className="grid gap-3">
                  {goalOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = watched.primary_goal === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selected ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("primary_goal")}
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 text-sm">
                            {opt.label}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                        {selected && (
                          <CheckCircle
                            size={18}
                            className="text-blue-500 shrink-0"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.primary_goal && (
                  <p className="text-xs text-red-500">
                    {errors.primary_goal.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Target Companies */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Which companies are you targeting?
                  </h2>
                  <p className="text-slate-500 mt-1">Select all that apply.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companyOptions.map((company) => {
                    const selected = watched.target_companies.includes(company);
                    return (
                      <button
                        key={company}
                        type="button"
                        onClick={() =>
                          toggleArrayValue("target_companies", company)
                        }
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${selected ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"}`}
                      >
                        {company}
                      </button>
                    );
                  })}
                </div>
                {errors.target_companies && (
                  <p className="text-xs text-red-500">
                    {errors.target_companies.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 4: Preferred Languages */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    What languages do you use?
                  </h2>
                  <p className="text-slate-500 mt-1">
                    We&apos;ll show solutions in your preferred language.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {languageOptions.map((lang) => {
                    const selected = watched.preferred_languages.includes(
                      lang.value,
                    );
                    return (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() =>
                          toggleArrayValue("preferred_languages", lang.value)
                        }
                        className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 text-center ${selected ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"}`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
                {errors.preferred_languages && (
                  <p className="text-xs text-red-500">
                    {errors.preferred_languages.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 5: Weekly Hours */}
            {step === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    How much time can you commit?
                  </h2>
                  <p className="text-slate-500 mt-1">
                    We&apos;ll pace your roadmap to match your schedule.
                  </p>
                </div>
                <div className="grid gap-3">
                  {hoursOptions.map((opt) => {
                    const selected = watched.weekly_hours === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selected ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                      >
                        <input
                          type="radio"
                          checked={watched.weekly_hours === opt.value}
                          onChange={() =>
                            setValue("weekly_hours", opt.value, {
                              shouldValidate: true,
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
                        >
                          <Clock size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 text-sm">
                            {opt.label}/week
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                        {selected && (
                          <CheckCircle
                            size={18}
                            className="text-blue-500 shrink-0"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.weekly_hours && (
                  <p className="text-xs text-red-500">
                    {errors.weekly_hours.message}
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prev}
                  className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={next}
                  disabled={step === 1 && usernameStatus !== "available"}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 gap-2 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Build My Roadmap
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
