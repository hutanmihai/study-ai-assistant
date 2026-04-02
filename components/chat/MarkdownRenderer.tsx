"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type Components } from "react-markdown";

const components: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-white mt-5 mb-2 first:mt-0 font-display">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold text-white mt-4 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-[#c4b5fd] mt-3 mb-1 first:mt-0">
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="text-[#fffffe] text-sm leading-relaxed mb-3 last:mb-0">
      {children}
    </p>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="space-y-1 mb-3 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1 mb-3 pl-4 list-decimal last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-[#fffffe] leading-relaxed relative pl-1 before:content-['•'] before:absolute before:-left-3 before:text-[#7c3aed] [ol_&]:list-decimal [ol_&]:before:content-none">
      {children}
    </li>
  ),

  // Inline code
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className="block bg-[#0f0e17] border border-white/10 rounded-lg px-4 py-3 text-xs text-[#c4b5fd] font-mono leading-relaxed overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-[#7c3aed]/20 text-[#c4b5fd] rounded px-1.5 py-0.5 text-xs font-mono">
        {children}
      </code>
    );
  },

  // Code blocks
  pre: ({ children }) => (
    <pre className="mb-3 last:mb-0 overflow-x-auto rounded-lg border border-white/10 bg-[#0f0e17]">
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#7c3aed] pl-4 my-3 text-[#a8a4c4] italic text-sm">
      {children}
    </blockquote>
  ),

  // Strong / Em
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#c4b5fd]">{children}</em>
  ),

  // Horizontal rule
  hr: () => <hr className="border-white/10 my-4" />,

  // Tables (GFM)
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3 last:mb-0">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-white/20">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2 text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-sm text-[#fffffe] border-b border-white/5">
      {children}
    </td>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#7c3aed] hover:text-[#a78bfa] underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
};

interface Props {
  content: string;
  streaming?: boolean;
}

export default function MarkdownRenderer({ content, streaming }: Props) {
  return (
    <div className="min-w-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
      {streaming && (
        <span className="inline-block w-1.5 h-4 bg-[#7c3aed] ml-0.5 animate-pulse rounded-sm align-middle" />
      )}
    </div>
  );
}
