"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizDisplayProps {
  questions: Question[];
}

export default function QuizDisplay({ questions }: QuizDisplayProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  if (!questions || questions.length === 0) {
    return <div className="text-[#a8a4c4] text-sm">No questions generated.</div>;
  }

  if (isComplete) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full max-w-lg bg-[#1a1830] border border-white/10 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-[#f59e0b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-[#f59e0b]" />
        </div>
        <h3
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
        >
          Quiz Complete!
        </h3>
        <p className="text-[#a8a4c4] mb-4">
          You scored{" "}
          <span className="text-white font-semibold">
            {score}/{questions.length}
          </span>{" "}
          ({pct}%)
        </p>
        <div
          className={`text-lg font-semibold mb-6 ${
            pct >= 80
              ? "text-[#34d399]"
              : pct >= 60
              ? "text-[#f59e0b]"
              : "text-red-400"
          }`}
        >
          {pct >= 80
            ? "Excellent work!"
            : pct >= 60
            ? "Good effort!"
            : "Keep studying!"}
        </div>
        <Button
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setScore(0);
            setIsComplete(false);
            setAnsweredCount(0);
          }}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl"
        >
          Retake Quiz
        </Button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
    }
    setAnsweredCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#a8a4c4]">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="text-xs text-[#a8a4c4]">
          Score:{" "}
          <span className="text-white font-semibold">
            {score}/{answeredCount}
          </span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-5">
        <div
          className="h-full bg-[#7c3aed] rounded-full transition-all duration-500"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="bg-[#1a1830] border border-white/10 rounded-2xl p-5">
        <p className="text-white font-semibold text-base mb-5 leading-relaxed">
          {q.question}
        </p>

        <div className="space-y-2 mb-4">
          {q.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === q.correctIndex;
            const isAnswered = selectedAnswer !== null;

            let className =
              "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer transition-all duration-200 ";

            if (!isAnswered) {
              className +=
                "border-white/10 text-[#a8a4c4] hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/5 hover:text-white";
            } else if (isCorrect) {
              className +=
                "border-[#059669]/50 bg-[#059669]/10 text-[#34d399]";
            } else if (isSelected && !isCorrect) {
              className += "border-red-500/50 bg-red-500/10 text-red-400";
            } else {
              className += "border-white/5 text-[#a8a4c4]/50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={className}
                disabled={isAnswered}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isAnswered && isCorrect
                      ? "border-[#059669] bg-[#059669] text-white"
                      : isAnswered && isSelected && !isCorrect
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-white/20 text-[#a8a4c4]"
                  }`}
                >
                  {isAnswered && isCorrect ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isAnswered && isSelected && !isCorrect ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl">
            <p className="text-xs text-[#7c3aed] font-semibold uppercase tracking-wider mb-2">
              Explanation
            </p>
            <p className="text-sm text-[#c4b5fd] leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next button */}
      {selectedAnswer !== null && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl"
          >
            {currentQuestion === questions.length - 1
              ? "See Results"
              : "Next Question →"}
          </Button>
        </div>
      )}
    </div>
  );
}
