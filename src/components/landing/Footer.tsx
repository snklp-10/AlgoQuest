import { Code2, Heart } from "lucide-react";
import { GithubAltIcon } from "../icons/codicon-github-alt";
import { TwitterOutlineIcon } from "../icons/basil-twitter-outline";
import { LinkedinOutlineIcon } from "../icons/basil-linkedin-outline";
import { YoutubeIcon } from "../icons/ci-youtube";

const footerLinks = {
  Product: ["Features", "Pricing", "Roadmap", "Changelog", "API"],
  Resources: ["Documentation", "Blog", "Tutorials", "Community", "FAQ"],
  Company: ["About", "Careers", "Press", "Partners", "Contact"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "GDPR"],
};

const socialLinks = [
  { icon: GithubAltIcon, href: "#", label: "Github" },
  { icon: TwitterOutlineIcon, href: "#", label: "Twitter" },
  { icon: LinkedinOutlineIcon, href: "#", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-sky-600 to-emerald-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Algo<span className="gradient-text">Quest</span>
              </span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              The gamified platform that makes mastering data structures and
              algorithms engaging, effective, and fun.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-sky-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} AlgoQuest. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for
            developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
