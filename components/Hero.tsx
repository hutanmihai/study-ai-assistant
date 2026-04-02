"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const words = ["Study", "Smarter,", "Not", "Harder."];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#a78bfa] text-sm font-medium mb-8 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse" />
            AI-Powered Study Assistant
          </div>

          <h1
            className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="inline-block mr-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {word === "Smarter," ? (
                  <span className="text-[#f59e0b]">{word}</span>
                ) : word === "Harder." ? (
                  <span className="relative">
                    {word}
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#7c3aed] rounded-full" />
                  </span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>

          <p
            className="text-lg text-[#a8a4c4] leading-relaxed max-w-lg mb-10 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            Upload your course materials. Get instant flashcards, quizzes, and
            expert answers — powered by AI.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-[#f59e0b]/25 hover:shadow-[#f59e0b]/40 hover:scale-105 transition-all duration-300"
              >
                Start Studying Free →
              </Button>
            </SignInButton>
            <a href="#how-it-works">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:text-[#f59e0b] hover:bg-white/5 text-lg px-8 py-6 rounded-full border border-white/20 hover:border-[#f59e0b]/30 transition-all duration-300"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-6 animate-fade-in"
            style={{ animationDelay: "700ms" }}
          >
            {/* Avatars */}
            <div className="flex -space-x-3">
              {["AC", "MP", "JK", "SR"].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#0f0e17] flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: [
                      "#7c3aed",
                      "#2563eb",
                      "#059669",
                      "#dc2626",
                    ][i],
                  }}
                >
                  {initials}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-[#0f0e17] bg-[#1a1830] flex items-center justify-center text-xs text-[#a8a4c4]">
                +1k
              </div>
            </div>

            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]"
                  />
                ))}
              </div>
              <p className="text-sm text-[#a8a4c4]">
                <span className="text-white font-semibold">10,000+</span>{" "}
                students studying smarter
              </p>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div
          className="hidden lg:block relative animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="relative">
            {/* Main card */}
            <div className="bg-[#1a1830] rounded-2xl border border-white/10 p-6 shadow-2xl shadow-[#7c3aed]/10 animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <span className="text-white font-semibold">StudyMind</span>
                <span className="ml-auto text-xs text-[#a8a4c4] bg-[#7c3aed]/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-xs text-white shrink-0 mt-1 font-bold">
                    U
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-[#fffffe]">
                    Generate flashcards from Chapter 3
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-xs">
                    <p className="mb-2 font-medium">Generated 12 flashcards!</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Mitosis", "ATP", "DNA", "RNA"].map((term) => (
                        <div
                          key={term}
                          className="bg-[#7c3aed]/30 rounded-lg px-2 py-1 text-xs text-center text-[#c4b5fd]"
                        >
                          {term}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <div
              className="absolute -top-6 -right-6 bg-[#1a1830] border border-white/10 rounded-xl px-4 py-3 shadow-xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-2xl font-black text-[#f59e0b]">94%</div>
              <div className="text-xs text-[#a8a4c4]">Pass rate</div>
            </div>

            <div
              className="absolute -bottom-6 -left-6 bg-[#1a1830] border border-white/10 rounded-xl px-4 py-3 shadow-xl animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-2xl font-black text-[#7c3aed]">2.4s</div>
              <div className="text-xs text-[#a8a4c4]">Avg response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
