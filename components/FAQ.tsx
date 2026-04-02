"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What file types can I upload?",
    a: "Currently we support PDF files. Upload your textbook chapters, lecture slides, or notes in PDF format.",
  },
  {
    q: "How accurate are the AI responses?",
    a: "Our AI is grounded strictly in your uploaded materials, so answers are directly sourced from your course content.",
  },
  {
    q: "Can I use StudyMind for any subject?",
    a: "Yes! StudyMind works for any subject — STEM, humanities, law, medicine, business, and more.",
  },
  {
    q: "How do flashcards work?",
    a: "The AI reads your PDF, identifies key concepts, and creates flip-card style flashcards you can review interactively.",
  },
  {
    q: "What are the practice quizzes like?",
    a: "Multiple-choice questions based on your material with instant feedback and explanations.",
  },
  {
    q: "Is my data private?",
    a: "Your uploaded PDFs are processed securely and never shared with third parties.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes, you can get started for free. Upload PDFs and get AI-powered study materials immediately.",
  },
  {
    q: "How many PDFs can I upload?",
    a: "You can upload and chat with one PDF per conversation. Start a new chat for a different document.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-[#a8a4c4] text-lg">
            Everything you need to know about StudyMind
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
          <Accordion className="space-y-2">
            {faqs.slice(0, 4).map((faq, i) => (
              <AccordionItem
                key={i}
                value={`col1-item-${i}`}
                className="bg-[#1a1830] border border-white/10 rounded-xl px-6 data-[open]:border-[#7c3aed]/30 transition-colors duration-200"
              >
                <AccordionTrigger className="text-white font-semibold hover:text-[#c4b5fd] hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#a8a4c4] leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion className="space-y-2">
            {faqs.slice(4).map((faq, i) => (
              <AccordionItem
                key={i}
                value={`col2-item-${i}`}
                className="bg-[#1a1830] border border-white/10 rounded-xl px-6 data-[open]:border-[#7c3aed]/30 transition-colors duration-200"
              >
                <AccordionTrigger className="text-white font-semibold hover:text-[#c4b5fd] hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#a8a4c4] leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
