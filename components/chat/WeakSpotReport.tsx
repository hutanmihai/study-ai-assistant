"use client";

import { WeakSpotAnalysis } from "@/lib/types";
import QuizDisplay from "./QuizDisplay";

interface Props {
  analysis: WeakSpotAnalysis;
}

export default function WeakSpotReport({ analysis }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a1830] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-[#7c3aed] font-semibold uppercase tracking-wider mb-2">
          Summary
        </p>
        <p className="text-sm text-[#c4b5fd] leading-relaxed">{analysis.summary}</p>
      </div>

      <div>
        <p className="text-xs text-[#a8a4c4] font-semibold uppercase tracking-wider mb-3">
          Weak Areas
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.weakTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {analysis.miniQuiz.length > 0 && (
        <div>
          <p className="text-xs text-[#a8a4c4] font-semibold uppercase tracking-wider mb-4">
            Targeted Practice ({analysis.miniQuiz.length} questions)
          </p>
          <QuizDisplay questions={analysis.miniQuiz} />
        </div>
      )}
    </div>
  );
}
