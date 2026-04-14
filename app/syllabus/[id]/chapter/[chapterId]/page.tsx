"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle, X, Copy } from "lucide-react";
import { toast } from "sonner";
import { useChapterViewerData } from "@/app/syllabus/[id]/chapter/[chapterId]/hooks/use-chapter-viewer-data";
import { mapMaterialBlocks } from "@/app/syllabus/[id]/chapter/[chapterId]/utils/block-mappers";
import { paginateBlocks } from "@/app/syllabus/[id]/chapter/[chapterId]/utils/pagination";
import { renderChapterBlock } from "@/app/syllabus/[id]/chapter/[chapterId]/components/chapter-block-renderer";

export default function ChapterViewerPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = decodeURIComponent(resolvedParams.id);
  const chapterId = decodeURIComponent(resolvedParams.chapterId);

  const { syllabus, chapterName, materialBlocks, loading } =
    useChapterViewerData(id, chapterId);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // Handle global text selection for the copying tooltip
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionBox(null);
        return;
      }
      const text = selection.toString().trim();
      if (!text) {
        setSelectionBox(null);
        return;
      }
      setTimeout(() => {
        const currSelection = window.getSelection();
        if (!currSelection || currSelection.isCollapsed) return;
        const range = currSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Don't show if the selection is outside the viewport
        if (rect.top === 0 && rect.left === 0) return;

        setSelectionBox({
          x: rect.left + rect.width / 2,
          y: Math.max(8, rect.top - 8), // Keep it purely fixed viewport coordinate!
          text,
        });
      }, 0);
    };

    const handleScroll = () => {
      if (selectionBox) setSelectionBox(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll, true);

    // Clear selection early if they start a new drag or scroll
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionBox(null);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [selectionBox]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-400" />
        <p className="text-sm text-gray-400">Loading document...</p>
      </div>
    );
  }

  if (!syllabus || !chapterName) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 font-medium text-center">
          Document content not found
        </p>
        <button
          onClick={() => router.back()}
          className="text-blue-500 text-sm font-semibold hover:underline mt-2"
        >
          Back to previous page
        </button>
      </div>
    );
  }

  const blocks = mapMaterialBlocks(materialBlocks);
  const pages = paginateBlocks(blocks);

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-[Lexend] text-gray-900">
      {/* ── Minimal Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_2px_10px_rgb(0,0,0,0.05)] print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 truncate">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900 shrink-0"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col truncate cursor-default">
              <div className="flex items-center gap-2 mb-0.5">
                <BookOpen size={14} className="text-blue-600" />
                <h1 className="text-sm font-bold text-gray-800 truncate">
                  {syllabus.syllabusCode} • {syllabus.syllabusName}
                </h1>
              </div>
              <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-2">
                Lecture material:{" "}
                <span className="text-gray-700">{chapterName}</span>
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg shrink-0">
            {pages.length} Pages
          </div>
        </div>
      </header>

      {/* ── Word-like Paginated Document Container ── */}
      <div className="pt-8 md:pt-12 px-2 sm:px-4 pb-20 flex flex-col items-center gap-8 md:gap-12">
        {pages.map((pageBlocks, pageIndex) => (
          <div
            key={pageIndex}
            className="w-full max-w-212.5 bg-white rounded-sm shadow-[0_4px_24px_rgb(0,0,0,0.06)] ring-1 ring-gray-200 isolate relative flex flex-col"
            style={{ minHeight: "1123px" }} // Standard A4 height at 96 PPI
          >
            {/* Document Content Area */}
            <article className="px-10 py-12 sm:px-16 sm:py-16 md:px-20 md:py-20 flex-1">
              {/* Title block only on the first page */}
              {pageIndex === 0 && (
                <div className="mb-10 border-b-2 border-gray-100 pb-8 text-center">
                  <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-3">
                    {syllabus.syllabusCode}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                    {chapterName}
                  </h1>
                </div>
              )}

              {/* Blocks renderer */}
              <div className="space-y-1">
                {pageBlocks.map((block, index, allBlocks) =>
                  renderChapterBlock(block, index, allBlocks, setEnlargedImage),
                )}
              </div>
            </article>

            {/* Page Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium text-gray-400 font-mono tracking-widest pointer-events-none">
              — {pageIndex + 1} —
            </div>
          </div>
        ))}
      </div>

      {/* ── Text Selection Quick Action Tooltip ── */}
      {selectionBox && (
        <div
          className="fixed z-60 flex items-center justify-center -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in duration-150 pointer-events-auto shadow-2xl"
          style={{ left: selectionBox.x, top: selectionBox.y }}
        >
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(selectionBox.text);
              toast.success("Text copied", { position: "bottom-center" });
              setSelectionBox(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors ring-1 ring-white/10"
          >
            <Copy size={14} />
            Copy
          </button>
          {/* Tooltip little triangle pointer */}
          <div className="absolute top-[98%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-gray-900/95 border-r-[6px] border-r-transparent"></div>
        </div>
      )}

      {/* ── Image Lightbox Modal ── */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(null);
              }}
              className="absolute top-0 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-101"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
