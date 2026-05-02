"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import {
  Code2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  remember: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const remember = watch("remember");

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
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
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              algo<span className="text-blue-500">mind</span>
            </span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {serverError}
            </div>
          )}

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!!oauthLoading}
              onClick={() => handleOAuthLogin("google")}
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
              onClick={() => handleOAuthLogin("github")}
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
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setValue("remember", v === true)}
              />
              <Label className="text-sm text-slate-600 cursor-pointer">
                Remember me for 30 days
              </Label>
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
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-sm text-slate-500 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — illustration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-500 via-blue-600 to-sky-600 items-center justify-center relative overflow-hidden p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative text-white max-w-md space-y-8">
          <div
            className="rounded-2xl p-6 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-blue-200" />
              <span className="text-sm font-semibold text-blue-100">
                Live Visualization
              </span>
            </div>
            <svg viewBox="0 0 100 60" className="w-full h-32">
              <line
                x1="50"
                y1="12"
                x2="28"
                y2="30"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              <line
                x1="50"
                y1="12"
                x2="72"
                y2="30"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              <line
                x1="28"
                y1="30"
                x2="18"
                y2="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              <line
                x1="28"
                y1="30"
                x2="38"
                y2="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              <line
                x1="72"
                y1="30"
                x2="62"
                y2="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              <line
                x1="72"
                y1="30"
                x2="82"
                y2="50"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.6"
              />
              {[
                { x: 50, y: 10, v: 50 },
                { x: 28, y: 28, v: 30 },
                { x: 72, y: 28, v: 70 },
                { x: 18, y: 48, v: 20 },
                { x: 38, y: 48, v: 40 },
                { x: 62, y: 48, v: 60 },
                { x: 82, y: 48, v: 80 },
              ].map((n, i) => (
                <g key={i} transform={`translate(${n.x},${n.y})`}>
                  <circle
                    r="5"
                    fill="rgba(255,255,255,0.15)"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="0.4"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="3"
                    fontWeight="600"
                    fill="white"
                  >
                    {n.v}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <blockquote className="space-y-4">
            <p className="text-xl font-semibold leading-relaxed text-white/95">
              &ldquo;AlgoMind&apos;s visualizations made algorithms click for
              me. I went from struggling with BFS to acing my Google interview
              in 8 weeks.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                AP
              </div>
              <div>
                <div className="font-semibold text-sm text-white">
                  Aisha Patel
                </div>
                <div className="text-xs text-blue-200">SWE @ Google</div>
              </div>
            </div>
          </blockquote>

          <div className="flex items-center gap-6 text-sm text-blue-200">
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs">Learners</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-xs">Satisfaction</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-2xl font-bold text-white">12K+</div>
              <div className="text-xs">Hired</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
