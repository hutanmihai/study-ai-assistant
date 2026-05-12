"use client";

import { Check, Sparkles } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "/month",
    description: "Try StudyMind risk-free and see how it fits your studying.",
    features: ["5 chats per month", "Up to 2 PDFs", "Basic AI answers"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Student Plus",
    price: "4.99",
    period: "/month",
    description: "Everything a student needs for daily studying.",
    features: [
      "Extensive access",
      "Weak spots features enabled",
      "Full chat history",
      "Unlimited PDFs",
    ],
    cta: "Go Plus",
    highlighted: true,
  },
  {
    name: "Exam Pack",
    price: "9.99",
    period: "/month",
    description: "Built for crunch time — full power for one exam session.",
    features: [
      "Extensive access",
      "30 days / exam session length",
      "All Student Plus features",
      "Priority responses",
    ],
    cta: "Get Exam Pack",
    highlighted: false,
  },
  {
    name: "Institutional",
    price: "1,000–5,000",
    period: "/month",
    description: "For universities and learning organizations.",
    features: [
      "Price varies by expected users",
      "Admin & seat management",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
    custom: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            Simple, <span className="text-[#7c3aed]">Student-Friendly</span>{" "}
            Pricing
          </h2>
          <p className="text-[#a8a4c4] text-lg max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                tier.highlighted
                  ? "bg-gradient-to-br from-[#1a1830] to-[#0f0e17] border-2 border-[#7c3aed] shadow-xl shadow-[#7c3aed]/20"
                  : "bg-[#1a1830] border border-white/10 hover:border-[#7c3aed]/40 hover:shadow-xl hover:shadow-[#7c3aed]/10"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-[#7c3aed] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm text-[#a8a4c4] leading-relaxed min-h-[3rem]">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-[#a8a4c4]">€</span>
                  <span
                    className="text-4xl font-black text-white"
                    style={{
                      fontFamily: "var(--font-display, Fraunces, serif)",
                    }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm text-[#a8a4c4]">{tier.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#a8a4c4]"
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        tier.highlighted ? "text-[#7c3aed]" : "text-[#f59e0b]"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.custom ? (
                <a href="mailto:sales@studymind.app">
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full"
                  >
                    {tier.cta}
                  </Button>
                </a>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    className={`w-full rounded-full font-semibold transition-all duration-200 ${
                      tier.highlighted
                        ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                        : "bg-[#f59e0b] hover:bg-[#d97706] text-black"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </SignInButton>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}