"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardDisplayProps {
  flashcards: Flashcard[];
}

export default function FlashcardDisplay({ flashcards }: FlashcardDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(0, i - 1)), 150);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(
      () => setCurrentIndex((i) => Math.min(flashcards.length - 1, i + 1)),
      150
    );
  };

  const handleFlip = () => setIsFlipped((f) => !f);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-[#a8a4c4] text-sm">No flashcards generated.</div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="w-full max-w-lg">
      {/* Counter */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#a8a4c4] font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <div className="flex gap-1">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-[#7c3aed]" : "bg-white/20"
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Flip card */}
      <div
        className="flip-card w-full h-48 cursor-pointer"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleFlip()}
        aria-label={isFlipped ? "Card back — click to flip to front" : "Card front — click to flip"}
      >
        <div className={`flip-card-inner w-full h-full relative ${isFlipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 bg-[#1a1830] border border-[#7c3aed]/30 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#7c3aed] font-medium uppercase tracking-wider">
                Question
              </span>
              <RotateCw className="w-4 h-4 text-[#a8a4c4]" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white text-center font-medium leading-relaxed">
                {card.front}
              </p>
            </div>
            <p className="text-xs text-[#a8a4c4] text-center mt-2">
              Click to reveal answer
            </p>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute inset-0 bg-[#7c3aed]/10 border border-[#7c3aed]/40 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#f59e0b] font-medium uppercase tracking-wider">
                Answer
              </span>
              <RotateCw className="w-4 h-4 text-[#a8a4c4]" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white text-center leading-relaxed">{card.back}</p>
            </div>
            <p className="text-xs text-[#a8a4c4] text-center mt-2">
              Click to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-[#a8a4c4] hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlip}
          className="text-[#7c3aed] hover:text-[#a78bfa] hover:bg-[#7c3aed]/10"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Flip
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="text-[#a8a4c4] hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
