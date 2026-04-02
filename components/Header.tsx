"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f0e17]/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            StudyMind
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-[#a8a4c4] hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-[#a8a4c4] hover:text-white transition-colors duration-200"
          >
            How it Works
          </a>
          <a
            href="#testimonials"
            className="text-sm text-[#a8a4c4] hover:text-white transition-colors duration-200"
          >
            Testimonials
          </a>
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#a8a4c4] hover:text-white hover:bg-white/10"
                >
                  Log In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-5 rounded-full transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Button>
              </SignInButton>
            </>
          ) : (
            <>
              <Link href="/chat">
                <Button
                  size="sm"
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 rounded-full transition-all duration-200 hover:scale-105"
                >
                  Go to Chat
                </Button>
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
