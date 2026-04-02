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
