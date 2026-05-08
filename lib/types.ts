export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string | object;
  type: "text" | "flashcards" | "quiz";
  pdfName?: string;
  createdAt: string;
}

export interface ChatSummary {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  activePdfName?: string;
}

export interface QuizResultQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userAnswer: number | null;
  isCorrect: boolean;
}

export interface QuizResult {
  chatId: string;
  quizMessageId: string;
  pdfName?: string;
  questions: QuizResultQuestion[];
  score: number;
  totalQuestions: number;
}

export interface WeakSpotAnalysis {
  weakTopics: string[];
  summary: string;
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}
