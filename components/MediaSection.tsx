"use client";

export default function MediaSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#7c3aed]/5 rounded-full blur-3xl" />
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

        {/* Mock app window — wider two-column layout */}
        <div className="max-w-6xl mx-auto">
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

            {/* App body: sidebar + chat + drawer */}
            <div className="flex h-[560px]">
              {/* Collapsed sidebar strip */}
              <div className="w-14 border-r border-white/10 bg-[#1a1830]/50 flex flex-col items-center py-3 gap-2 shrink-0">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a8a4c4]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a8a4c4] hover:text-[#c4b5fd]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>

              {/* Chat column */}
              <div className="flex-1 flex flex-col overflow-hidden border-r border-white/10 min-w-0">
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                  {/* User message with PDF */}
                  <div className="flex justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-xs text-white shrink-0 mt-1 font-bold">
                      U
                    </div>
                    <div className="space-y-2 max-w-[75%]">
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 w-fit">
                        <div className="w-7 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
                          <span className="text-red-400 text-xs font-bold">PDF</span>
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">biology_ch3.pdf</div>
                          <div className="text-xs text-[#a8a4c4]">2.4 MB · 47 pages</div>
                        </div>
                      </div>
                      <div className="bg-[#1a1830] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white w-fit">
                        Make flashcards and quiz me on this chapter
                      </div>
                    </div>
                  </div>

                  {/* AI text response */}
                  <div className="flex flex-row-reverse gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    <div className="max-w-[75%]">
                      <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white leading-relaxed">
                        Got it! Chapter 3 covers cell biology — mitosis, DNA replication, and protein synthesis. I&apos;ve generated flashcards and a quiz below. Click either to start studying.
                      </div>
                    </div>
                  </div>

                  {/* Flashcards ready — clickable card */}
                  <div className="flex flex-row-reverse gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    <div className="bg-[#7c3aed]/10 border-2 border-[#7c3aed]/50 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-3 cursor-pointer">
                      <svg className="w-5 h-5 text-[#7c3aed] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div>
                        <p className="text-white font-medium text-sm">Flashcards ready</p>
                        <p className="text-[#a8a4c4] text-xs">12 cards · Click to study</p>
                      </div>
                      <svg className="w-4 h-4 text-[#7c3aed] ml-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>

                  {/* Quiz ready — clickable card */}
                  <div className="flex flex-row-reverse gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                    <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-3 cursor-pointer">
                      <svg className="w-5 h-5 text-[#f59e0b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        <p className="text-white font-medium text-sm">Quiz ready</p>
                        <p className="text-[#a8a4c4] text-xs">5 questions · Click to take</p>
                      </div>
                      <svg className="w-4 h-4 text-[#f59e0b] ml-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="px-5 pb-5 shrink-0">
                  <div className="flex items-center gap-3 bg-[#0f0e17] rounded-2xl border border-white/10 px-4 py-3">
                    <svg className="w-5 h-5 text-[#a8a4c4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <div className="flex-1 text-sm text-[#a8a4c4]">
                      Ask about your PDF, request flashcards, or quiz me…
                    </div>
                    <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer panel (open state) */}
              <div className="w-[380px] shrink-0 flex flex-col bg-[#1a1830]">
                {/* Drawer header */}
                <div className="px-6 pt-5 pb-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  <h3 className="text-white font-semibold text-base" style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}>
                    Study Materials
                  </h3>
                  <div className="w-6 h-6 text-[#a8a4c4] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 shrink-0">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex w-fit gap-1 mb-4">
                    <div className="bg-[#7c3aed] text-white rounded-lg px-4 py-1.5 text-xs font-medium">
                      🃏 Flashcards (12)
                    </div>
                    <div className="text-[#a8a4c4] rounded-lg px-4 py-1.5 text-xs">
                      📝 Quiz (5)
                    </div>
                  </div>
                </div>

                {/* Flashcard content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
                  {/* Active flashcard */}
                  <div className="bg-[#0f0e17] border border-[#7c3aed]/30 rounded-2xl p-5 shadow-lg shadow-[#7c3aed]/10">
                    <div className="text-xs text-[#a8a4c4] mb-3 font-medium uppercase tracking-wider">
                      Card 1 of 12 · Front
                    </div>
                    <p className="text-white font-semibold mb-5 text-sm leading-relaxed">
                      What are the four phases of mitosis in order?
                    </p>
                    <button className="w-full text-center text-xs text-[#7c3aed] border border-[#7c3aed]/30 rounded-lg py-2 bg-[#7c3aed]/5">
                      Click to reveal answer →
                    </button>
                  </div>

                  {/* Next card preview */}
                  <div className="bg-[#0f0e17]/60 border border-white/10 rounded-2xl p-4">
                    <div className="text-xs text-[#a8a4c4] mb-2 font-medium uppercase tracking-wider">
                      Card 2 of 12
                    </div>
                    <p className="text-[#a8a4c4] text-sm">
                      What is the role of DNA polymerase during replication?
                    </p>
                  </div>

                  {/* Another card preview */}
                  <div className="bg-[#0f0e17]/40 border border-white/10 rounded-2xl p-4">
                    <div className="text-xs text-[#a8a4c4] mb-2 font-medium uppercase tracking-wider">
                      Card 3 of 12
                    </div>
                    <p className="text-[#a8a4c4] text-sm">
                      Where does protein synthesis take place in the cell?
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                      <div className="bg-[#7c3aed] h-1.5 rounded-full" style={{ width: "8.3%" }} />
                    </div>
                    <span className="text-xs text-[#a8a4c4]">1 / 12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
