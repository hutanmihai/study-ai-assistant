import Link from "next/link";
import { Sparkles, AtSign, Code2, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#0a0914] border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
              >
                StudyMind AI
              </span>
            </Link>
            <p className="text-[#a8a4c4] text-sm leading-relaxed max-w-xs mb-6">
              AI-powered study assistant for students. Upload PDFs, get instant
              flashcards, quizzes, and answers.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#7c3aed]/30 flex items-center justify-center text-[#a8a4c4] hover:text-[#c4b5fd] transition-all duration-200"
              >
                <AtSign className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#7c3aed]/30 flex items-center justify-center text-[#a8a4c4] hover:text-[#c4b5fd] transition-all duration-200"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#7c3aed]/30 flex items-center justify-center text-[#a8a4c4] hover:text-[#c4b5fd] transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "How it Works", "Pricing"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#a8a4c4] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#a8a4c4] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#a8a4c4] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#a8a4c4] text-sm">
            &copy; 2026 StudyMind AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[#a8a4c4] text-sm">
            <span>Made for students everywhere</span>
            <span className="text-[#7c3aed]">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
