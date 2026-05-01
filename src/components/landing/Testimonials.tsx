"use client";
import { useState } from "react";
import { useInView } from "../../hooks/useInView";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    avatarColor: "from-sky-600 to-cyan-600",
    rating: 5,
    text: "AlgoQuest turned my DSA prep from a grind into something I actually looked forward to every day. The streak system kept me consistent, and the AI hints saved me hours of frustration. I cleared Google's interview on my first attempt.",
  },
  {
    name: "Marcus Johnson",
    role: "Senior Dev at Meta",
    avatar: "MJ",
    avatarColor: "from-emerald-600 to-teal-600",
    rating: 5,
    text: "The personalized roadmap was a game-changer. Instead of randomly solving problems, I had a clear path that targeted my weak areas. The leaderboard competition with my study group kept everyone motivated.",
  },
  {
    name: "Priya Patel",
    role: "SDE II at Amazon",
    avatar: "PP",
    avatarColor: "from-amber-500 to-orange-500",
    rating: 5,
    text: "I went from struggling with medium problems to confidently tackling hards in just 3 months. The AI assistant explains patterns in a way that actually clicks. Best investment for interview prep.",
  },
  {
    name: "David Kim",
    role: "Backend Engineer at Stripe",
    avatar: "DK",
    avatarColor: "from-rose-500 to-pink-500",
    rating: 5,
    text: "What sets AlgoQuest apart is how it makes you want to practice. The XP system, achievements, and clan competitions create this positive feedback loop. I solved 400+ problems without ever feeling burned out.",
  },
  {
    name: "Elena Rodriguez",
    role: "ML Engineer at Apple",
    avatar: "ER",
    avatarColor: "from-teal-500 to-cyan-500",
    rating: 5,
    text: "As someone transitioning from research to engineering, the structured roadmap was invaluable. It identified exactly which DSA topics I needed and built my confidence systematically. Landed at Apple within 6 months.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useInView();

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      id="testimonials"
      className="relative py-28 overflow-hidden bg-slate-50"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-sky-400/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-sm font-medium text-amber-700 mb-6">
            Community Voices
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-slate-900">
            Loved by
            <br />
            <span className="gradient-text">Top Engineers</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Hear from developers who transformed their DSA skills with
            AlgoQuest.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="testimonial-card bg-white rounded-2xl p-8 sm:p-10 relative overflow-hidden border border-slate-200/80 shadow-sm">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-slate-100" />

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-xl bg-linear-to-br ${testimonials[active].avatarColor} flex items-center justify-center text-white font-bold text-lg`}
              >
                {testimonials[active].avatar}
              </div>
              <div>
                <div className="font-bold text-lg text-slate-900">
                  {testimonials[active].name}
                </div>
                <div className="text-sm text-slate-500">
                  {testimonials[active].role}
                </div>
              </div>
            </div>

            <div className="flex gap-1 mb-5">
              {Array.from({ length: testimonials[active].rating }).map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ),
              )}
            </div>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              "{testimonials[active].text}"
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === active
                        ? "bg-sky-600 w-8"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mini testimonial cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t, i) => (
            <div
              key={t.name}
              className={`bg-white rounded-xl p-5 border transition-all duration-700 cursor-pointer hover:border-sky-200 ${
                i === active
                  ? "border-sky-300 ring-1 ring-sky-100"
                  : "border-slate-200/80"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${(i + 1) * 200}ms` }}
              onClick={() => setActive(i)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-9 h-9 rounded-lg bg-linear-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
