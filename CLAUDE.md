@AGENTS.md

# CLAUDE.md – StudyMind AI

## What we're building

An AI-powered study assistant for students. Students upload PDF course materials and interact with specialized AI
agents.

## Tech stack

- **Next.js** (App Router)
- **Clerk** for authentication
- **shadcn/ui** for all UI components
- **Google Gemini** via `@google/genai` — the only LLM provider

## User flow

- Unauthenticated user → sees Landing Page with a navbar containing a Login button (Clerk)
- Already logged in → skip landing page, go directly to `/chat`
- After login → redirect to `/chat`

## Pages to build

### Landing Page (`/`)

The visual design is governed by `skill.md` — follow it strictly for the landing page look. It must have a navbar with a
Login button using Clerk.

### Chat Page (`/chat`) — protected route

A chat interface where the user can:

- Type a text prompt
- Optionally attach a **single PDF** (PDF only, no other file types)
- Send the message and receive a response from one of the three agents below

### Additional Pages IF Necessary

## The three agents

**1. GeneralistAgent** — answers questions based on the content of the uploaded PDF.

**2. FlashcardAgent** — generates flashcards from the PDF. Uses **structured output** so the frontend can render them as
interactive flip cards.

**3. QuizAgent** — generates multiple-choice quiz questions from the PDF. Uses **structured output** so the frontend can
render them as an interactive MCQ component.

The agent is chosen automatically based on the user's prompt (e.g. if they ask for flashcards or a quiz, route
accordingly; otherwise use the generalist).
