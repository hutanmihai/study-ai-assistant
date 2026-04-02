"use client";

import {
  BookOpen,
  Brain,
  CheckSquare,
  MessageSquare,
  Zap,
  Shield,
} from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    title: "PDF Intelligence",
    description:
      "Upload any course material and our AI reads, understands, and learns from it instantly",
    size: "large",
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description:
      "Auto-generated flashcards from your PDFs with spaced repetition support",
    size: "large",
  },
  {
    icon: CheckSquare,
    title: "Practice Quizzes",
    description:
      "Multiple choice questions that test exactly what your professor assigned",
    size: "small",
  },
  {
    icon: MessageSquare,
    title: "Instant Answers",
    description:
      "Ask any question about your material and get detailed, accurate explanations",
    size: "small",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get comprehensive study materials in seconds, not hours",
    size: "small",
  },
  {
    icon: Shield,
    title: "Always Accurate",
    description:
      "Answers grounded strictly in your uploaded course materials",
    size: "small",
  },
];

export default function Benefits() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start mb-16">
          <div className="lg:w-1/2">
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
            >
              Everything You Need to{" "}
              <span className="text-[#7c3aed]">Ace Your Exams</span>
            </h2>
          </div>
          <div className="lg:w-1/2 lg:pt-4">
            <p className="text-[#a8a4c4] text-lg leading-relaxed">
              StudyMind combines cutting-edge AI with intuitive study tools to
              transform how you learn from your course materials.
            </p>
          </div>
        </div>

        {/* Asymmetric grid: 2 large + 4 small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card 1 */}
          <div className="lg:col-span-1 lg:row-span-2 group bg-[#1a1830] border border-white/10 rounded-2xl p-8 hover:border-[#7c3aed]/40 hover:shadow-xl hover:shadow-[#7c3aed]/10 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#7c3aed]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7c3aed]/30 transition-colors">
              <BookOpen className="w-7 h-7 text-[#7c3aed]" />
            </div>
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
            >
              PDF Intelligence
            </h3>
            <p className="text-[#a8a4c4] leading-relaxed text-lg">
              Upload any course material and our AI reads, understands, and
              learns from it instantly. From dense textbooks to lecture slides —
              we handle it all.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex gap-2 flex-wrap">
                {["Textbooks", "Lecture slides", "Notes", "Papers"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-full text-xs text-[#c4b5fd]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Large card 2 */}
          <div className="lg:col-span-1 lg:row-span-2 group bg-gradient-to-br from-[#1a1830] to-[#0f0e17] border border-white/10 rounded-2xl p-8 hover:border-[#f59e0b]/40 hover:shadow-xl hover:shadow-[#f59e0b]/10 hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-[#f59e0b]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#f59e0b]/30 transition-colors">
              <Brain className="w-7 h-7 text-[#f59e0b]" />
            </div>
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
            >
              Smart Flashcards
            </h3>
            <p className="text-[#a8a4c4] leading-relaxed text-lg">
              Auto-generated flashcards from your PDFs. Flip to reveal answers,
              track your progress, and focus on what you need most.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="bg-[#0f0e17] rounded-xl p-4 border border-white/10">
                <div className="text-xs text-[#a8a4c4] mb-2">
                  Sample card preview
                </div>
                <div className="text-sm text-white font-medium">
                  What is photosynthesis?
                </div>
                <div className="text-xs text-[#7c3aed] mt-2">
                  Tap to reveal →
                </div>
              </div>
            </div>
          </div>

          {/* 4 small cards */}
          {benefits.slice(2).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group bg-[#1a1830] border border-white/10 rounded-2xl p-6 hover:border-[#7c3aed]/40 hover:shadow-xl hover:shadow-[#7c3aed]/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#7c3aed]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#7c3aed]/30 transition-colors">
                  <Icon className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
                >
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#a8a4c4] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
