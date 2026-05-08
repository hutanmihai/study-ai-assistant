"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashcardDisplay from "./FlashcardDisplay";
import QuizDisplay from "./QuizDisplay";
import WeakSpotReport from "./WeakSpotReport";
import { WeakSpotAnalysis, QuizResultQuestion } from "@/lib/types";

export interface Flashcard {
  front: string;
  back: string;
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizCompletionData {
  questions: QuizResultQuestion[];
  score: number;
  totalQuestions: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  flashcards?: Flashcard[];
  questions?: Question[];
  defaultTab?: "flashcards" | "quiz";
  weakspot?: WeakSpotAnalysis;
  onQuizComplete?: (data: QuizCompletionData) => void;
}

export default function StudyMaterialSheet({
  open,
  onClose,
  flashcards,
  questions,
  defaultTab = "flashcards",
  weakspot,
  onQuizComplete,
}: Props) {
  const hasBoth = !!(flashcards?.length && questions?.length);
  const hasFlashcards = !!flashcards?.length;
  const hasQuiz = !!questions?.length;

  const activeDefault = hasBoth
    ? defaultTab
    : hasFlashcards
    ? "flashcards"
    : "quiz";

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[580px] md:w-[700px] max-w-full bg-[#1a1830] border-l border-white/10 p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-5 pb-0 shrink-0">
          <SheetTitle
            className="text-white text-lg"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            {weakspot
              ? "Weak Spot Analysis"
              : hasBoth
              ? "Study Materials"
              : hasFlashcards
              ? "Flashcards"
              : "Quiz"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6 pt-4">
          {weakspot ? (
            <div className="flex-1 overflow-y-auto">
              <WeakSpotReport analysis={weakspot} />
            </div>
          ) : hasBoth ? (
            <Tabs
              defaultValue={activeDefault}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-4 shrink-0">
                <TabsTrigger
                  value="flashcards"
                  className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white text-[#a8a4c4] rounded-lg px-4 py-1.5 text-sm transition-all"
                >
                  🃏 Flashcards ({flashcards!.length})
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white text-[#a8a4c4] rounded-lg px-4 py-1.5 text-sm transition-all"
                >
                  📝 Quiz ({questions!.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="flashcards"
                className="flex-1 overflow-y-auto mt-0"
              >
                <FlashcardDisplay flashcards={flashcards!} />
              </TabsContent>
              <TabsContent
                value="quiz"
                className="flex-1 overflow-y-auto mt-0"
              >
                <QuizDisplay questions={questions!} onComplete={onQuizComplete} />
              </TabsContent>
            </Tabs>
          ) : hasFlashcards ? (
            <div className="flex-1 overflow-y-auto">
              <FlashcardDisplay flashcards={flashcards!} />
            </div>
          ) : hasQuiz ? (
            <div className="flex-1 overflow-y-auto">
              <QuizDisplay questions={questions!} onComplete={onQuizComplete} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#a8a4c4] text-sm">No study materials yet.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
