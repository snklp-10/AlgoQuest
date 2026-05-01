"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Code2, Zap } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Visualizer", href: "#visualizer" },
  { label: "Roadmaps", href: "#roadmaps" },
  { label: "Leaderboard", href: "#gamification" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-sm shadow-blue-100/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800">
            algo<span className="text-blue-500">mind</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-300/50 transition-all duration-200 gap-2">
            <Link
              href="/signup"
              className="w-full flex items-center  justify-center gap-2"
            >
              <Zap size={13} /> Start Free
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-slate-600 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-blue-100/50 px-4 py-4 flex flex-col gap-1 animate-slide-up">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
            <Button variant="outline" className="flex-1 text-sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm gap-1.5">
              <Link href="/signup">
                <Zap size={13} /> Start Free
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
