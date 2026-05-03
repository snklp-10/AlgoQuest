"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Zap,
  AlertCircle,
} from "lucide-react";

const benefits = [
  "Interactive algorithm visualizations",
  "AI-powered code assistance",
  "Personalized learning roadmaps",
  "Gamified challenges & leaderboards",
  "200+ curated DSA problems",
  "Mock interview simulations",
];

const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  experience: z.string().min(1, "Please select your experience level"),
  agreed: z.boolean().refine((v) => v === true, "You must agree to the terms"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      experience: "",
      agreed: false,
    },
  });

  const password = watch("password");

  const passwordStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-500",
  ][passwordStrength];

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          experience_level: data.experience,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    // Supabase may require email confirmation — redirect to a confirmation notice
    // or straight to dashboard if email confirmation is disabled.
    router.push("/onboarding");
    router.refresh();
  };

  const handleOAuthSignup = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — illustration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-500 via-blue-600 to-sky-600 items-center justify-center relative overflow-hidden p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />

        <div className="relative text-white max-w-md space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                algo<span className="text-blue-200">mind</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Start your journey to{" "}
              <span className="text-blue-200">interview success</span>
            </h2>
            <p className="text-blue-100 mt-3 text-sm leading-relaxed">
              Join 50,000+ engineers who&apos;ve mastered DSA with visual
              learning, AI assistance, and gamified practice.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div
                key={b}
                className="flex items-center gap-3 text-sm text-blue-100 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
              >
                <CheckCircle size={16} className="text-emerald-300 shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <div className="flex -space-x-2">
              {[
                "bg-emerald-400",
                "bg-amber-400",
                "bg-rose-400",
                "bg-sky-400",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {["AP", "MT", "YT", "DK"][i]}
                </div>
              ))}
            </div>
            <div className="text-xs text-blue-200">
              <span className="font-semibold text-white">2,400+</span> engineers
              signed up this month
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative">
        <div className="w-full max-w-md space-y-7">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              algo<span className="text-blue-500">mind</span>
            </span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Start learning for free. No credit card required.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {serverError}
            </div>
          )}

          {/* Social signup */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!!oauthLoading}
              onClick={() => handleOAuthSignup("google")}
              className="h-11 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-sm font-medium"
            >
              {oauthLoading === "google" ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!!oauthLoading}
              onClick={() => handleOAuthSignup("github")}
              className="h-11 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-sm font-medium"
            >
              {oauthLoading === "github" ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400">
              or sign up with email
            </span>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={`h-11 transition-all ${
                  errors.name
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.name && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`h-11 transition-all ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.email && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  className={`h-11 transition-all pr-10 ${
                    errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength === 2
                          ? "text-amber-500"
                          : passwordStrength === 3
                            ? "text-blue-500"
                            : "text-emerald-600"
                    }`}
                  >
                    {strengthLabel}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Experience Level
              </Label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`h-16 py-3 w-full transition-all rounded-md border-slate-200 bg-background${
                        errors.experience
                          ? "border-red-300 focus:ring-red-100"
                          : "border-slate-200 focus:ring-blue-100"
                      }`}
                    >
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-md">
                      <SelectItem value="beginner">
                        Beginner — New to DSA
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate — Some practice
                      </SelectItem>
                      <SelectItem value="advanced">
                        Advanced — Preparing for interviews
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.experience && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2">
                <Controller
                  name="agreed"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                  )}
                />
                <Label className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.agreed && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 ml-6">
                  <AlertCircle size={12} />
                  {errors.agreed.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 transition-all duration-200 gap-2 text-sm font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={15} />
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-sm text-slate-500 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
