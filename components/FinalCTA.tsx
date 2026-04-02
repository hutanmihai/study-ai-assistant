"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/30 via-[#1a1830] to-[#0f0e17]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#7c3aed]/20 rounded-full blur-3xl" />
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(124, 58, 237, 0.6) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#a78bfa] text-sm font-medium mb-8 animate-fade-in"
        >
          <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse" />
          Free to get started
        </div>

        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
        >
          Ready to Ace Your{" "}
          <span className="text-[#f59e0b]">Next Exam?</span>
        </h2>

        <p className="text-xl text-[#a8a4c4] mb-12 max-w-2xl mx-auto">
          Join 10,000+ students who study smarter with AI. Upload your first PDF
          and get instant flashcards, quizzes, and answers.
        </p>

        <SignInButton mode="modal">
          <Button
            size="lg"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xl px-12 py-8 rounded-full shadow-2xl shadow-[#f59e0b]/30 hover:shadow-[#f59e0b]/50 hover:scale-105 transition-all duration-300 mb-6"
          >
            Start Studying Free →
          </Button>
        </SignInButton>

        <div className="text-sm text-[#a8a4c4]">
          No credit card required &bull; Free to start &bull; AI-powered
        </div>
      </div>
    </section>
  );
}
