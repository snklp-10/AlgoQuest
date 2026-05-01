import { Code2 } from "lucide-react";
import { GithubAltIcon as Github } from "../icons/codicon-github-alt";
import { TwitterOutlineIcon as Twitter } from "../icons/basil-twitter-outline";
import { LinkedinOutlineIcon as Linkedin } from "../icons/basil-linkedin-outline";
import { YoutubeIcon as Youtube } from "../icons/ci-youtube";

const links = {
  Product: [
    "Features",
    "Visualizer",
    "AI Assistant",
    "Roadmaps",
    "Leaderboard",
    "Pricing",
  ],
  Resources: [
    "Documentation",
    "Blog",
    "Changelog",
    "Community",
    "DSA Handbook",
  ],
  Company: ["About", "Careers", "Press", "Contact", "Partners"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const socials = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Top wave */}
      <div className="h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Code2 size={17} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                algo<span className="text-blue-400">mind</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-slate-500 max-w-xs">
              The most visual and engaging way to master data structures and
              algorithms. Built for engineers who want to learn smarter.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition-colors duration-200"
                >
                  <s.icon
                    size={15}
                    className="text-slate-400 hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2025 AlgoMind. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Made with</span>
            <span className="text-blue-400 font-semibold">React + Vite</span>
            <span>·</span>
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
