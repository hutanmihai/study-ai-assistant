"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    major: "CS Junior",
    quote:
      "Got an A on my data structures exam after using StudyMind for 2 days. The flashcards are insanely good.",
    color: "#7c3aed",
    initials: "AC",
  },
  {
    name: "Maya Patel",
    major: "Pre-Med",
    quote:
      "Study for the MCAT used to take 8 hours. Now I prep in 2. Life changing.",
    color: "#2563eb",
    initials: "MP",
  },
  {
    name: "Jordan Kim",
    major: "Business Sophomore",
    quote:
      "The quiz feature caught every weak spot in my understanding. No more surprises on tests.",
    color: "#059669",
    initials: "JK",
  },
  {
    name: "Sam Rivera",
    major: "Engineering",
    quote:
      "My professor uploads dense PDFs. StudyMind turns them into actual understanding.",
    color: "#dc2626",
    initials: "SR",
  },
  {
    name: "Priya Singh",
    major: "Law Student",
    quote:
      "Went from barely passing to top of my class. The AI actually explains the WHY.",
    color: "#d97706",
    initials: "PS",
  },
  {
    name: "Chris Morgan",
    major: "History Major",
    quote:
      "Finally a study tool that works with my actual course materials.",
    color: "#0891b2",
    initials: "CM",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-[#f59e0b]" />
            Student Reviews
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            Students Love StudyMind
          </h2>
          <p className="text-[#a8a4c4] text-lg">
            Join 10,000+ students who already study smarter
          </p>
        </div>

        {/* Masonry staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`group bg-[#1a1830] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
                i % 3 === 1 ? "lg:mt-8" : i % 3 === 2 ? "lg:mt-4" : ""
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[#fffffe] text-base leading-relaxed mb-6 relative">
                <span
                  className="absolute -top-2 -left-1 text-4xl text-[#7c3aed]/30 font-serif leading-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <span className="relative">{t.quote}</span>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-[#a8a4c4] text-xs">{t.major}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
