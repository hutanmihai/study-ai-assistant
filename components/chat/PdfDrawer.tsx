"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileText, Loader2, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  chatId: string | null;
  pdfName: string | null;
}

export default function PdfDrawer({ open, onClose, chatId, pdfName }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !chatId) return;

    let objectUrl: string | null = null;
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    fetch(`/api/chats/${chatId}/pdf`)
      .then((res) => {
        if (!res.ok) throw new Error("PDF not found");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      })
      .catch(() => setError("Could not load PDF."))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, chatId]);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[560px] md:w-[680px] max-w-full bg-[#1a1830] border-l border-white/10 p-0 flex flex-col"
      >
        <SheetHeader className="px-5 py-4 border-b border-white/10 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-white text-sm font-medium">
            <div className="w-7 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
              <span className="text-red-400 text-xs font-bold">PDF</span>
            </div>
            <span className="truncate">{pdfName ?? "Document"}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
              <p className="text-sm text-[#a8a4c4]">Loading PDF…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
              <p className="text-xs text-[#a8a4c4]">
                The PDF may have been uploaded in a previous session. Re-upload it to view it here.
              </p>
            </div>
          )}

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title={pdfName ?? "Document"}
            />
          )}

          {!loading && !error && !pdfUrl && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <FileText className="w-10 h-10 text-[#a8a4c4]/30" />
              <p className="text-sm text-[#a8a4c4]">No PDF attached to this chat.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
