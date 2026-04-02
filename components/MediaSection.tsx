"use client";

export default function MediaSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7c3aed]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            See It In Action
          </h2>
          <p className="text-[#a8a4c4] text-lg max-w-xl mx-auto">
            Upload a PDF and watch StudyMind transform it into powerful study
            tools in seconds.
          </p>
        </div>

        {/* Mock chat window */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a1830] rounded-2xl border border-white/10 shadow-2xl shadow-[#7c3aed]/10 overflow-hidden">
            {/* Window chrome */}
            <div className="bg-[#0f0e17] px-6 py-4 flex items-center gap-3 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center text-xs text-[#a8a4c4]">
                StudyMind AI — Chat
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Message 1: PDF upload */}
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs text-white shrink-0">
                    U
                  </div>
                  <div className="space-y-2 max-w-sm">
                    {/* PDF attachment preview */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-10 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center">
                        <span className="text-red-400 text-xs font-bold">
                          PDF
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">
                          biology_ch3.pdf
                        </div>
                        <div className="text-xs text-[#a8a4c4]">
                          2.4 MB · 47 pages
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-white">
                      Explain the key concepts from this chapter
                    </div>
                  </div>
                </div>

                {/* AI response - text */}
                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                    AI
                  </div>
                  <div className="bg-[#7c3aed]/15 border border-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-sm">
                    <p className="mb-3">
                      Based on your PDF, here are the key concepts from Chapter
                      3:
                    </p>
                    <ul className="space-y-1.5 text-[#c4b5fd]">
                      <li className="flex gap-2">
                        <span className="text-[#7c3aed] mt-0.5">▸</span>
                        Cell division and mitosis phases
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#7c3aed] mt-0.5">▸</span>
                        DNA replication mechanisms
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#7c3aed] mt-0.5">▸</span>
                        Protein synthesis pathways
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-[#a8a4c4]">Flashcard mode</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Message 2: Flashcards */}
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs text-white shrink-0">
                    U
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-white max-w-xs">
                    Make me flashcards from this PDF
                  </div>
                </div>

                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                    AI
                  </div>
                  <div className="max-w-sm space-y-2">
                    <p className="text-sm text-[#a8a4c4]">
                      Generated 8 flashcards — Card 1 of 8
                    </p>
                    <div className="bg-[#1a1830] border border-[#7c3aed]/30 rounded-2xl p-5 shadow-lg shadow-[#7c3aed]/10">
                      <div className="text-xs text-[#a8a4c4] mb-3 font-medium uppercase tracking-wider">
                        Front
                      </div>
                      <p className="text-white font-semibold mb-4">
                        What is the process of cell division called?
                      </p>
                      <button className="w-full text-center text-xs text-[#7c3aed] border border-[#7c3aed]/30 rounded-lg py-2 hover:bg-[#7c3aed]/10 transition-colors">
                        Click to flip →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-[#a8a4c4]">Quiz mode</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Message 3: Quiz */}
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs text-white shrink-0">
                    U
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-white max-w-xs">
                    Quiz me on this material
                  </div>
                </div>

                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                    AI
                  </div>
                  <div className="max-w-sm space-y-2">
                    <p className="text-sm text-[#a8a4c4]">
                      Question 1 of 5 — Score: 0/0
                    </p>
                    <div className="bg-[#1a1830] border border-white/10 rounded-2xl p-5">
                      <p className="text-white text-sm font-medium mb-4">
                        During which phase of mitosis do chromosomes align at
                        the cell&apos;s equator?
                      </p>
                      <div className="space-y-2">
                        {[
                          "Prophase",
                          "Metaphase",
                          "Anaphase",
                          "Telophase",
                        ].map((opt, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                              opt === "Metaphase"
                                ? "border-[#059669]/50 bg-[#059669]/10 text-[#34d399]"
                                : "border-white/10 text-[#a8a4c4] hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                                opt === "Metaphase"
                                  ? "border-[#059669] bg-[#059669] text-white"
                                  : "border-white/20"
                              }`}
                            >
                              {opt === "Metaphase" && "✓"}
                            </div>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 bg-[#0f0e17] rounded-2xl border border-white/10 px-4 py-3">
                <button className="text-[#a8a4c4] hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <div className="flex-1 text-sm text-[#a8a4c4]">
                  Ask about your PDF...
                </div>
                <button className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center hover:bg-[#6d28d9] transition-colors">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
