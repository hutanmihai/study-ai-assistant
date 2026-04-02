import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyMind AI - AI-Powered Study Assistant",
  description:
    "Upload your course PDFs and get instant help with AI-powered flashcards, quizzes, and answers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fraunces.variable} ${dmSans.variable} dark h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#0f0e17] text-[#fffffe]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
