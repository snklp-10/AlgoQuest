"use client";
import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass py-3 shadow-lg shadow-slate-200/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-sky-600 to-emerald-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Algo<span className="gradient-text">Quest</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link text-sm font-medium text-slate-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign In
          </a>
          <a
            href="#"
            className="btn-primary px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 text-sm font-semibold text-white"
          >
            Start Free
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Sign In
              </a>
              <a
                href="#"
                className="btn-primary px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 text-sm font-semibold text-white text-center"
              >
                Start Free
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
