"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle, X, Copy } from "lucide-react";
import { toast } from "sonner";
import syllabusApiRequest from "@/apiRequests/syllabus";
import {
  MaterialBlockType,
  SyllabusContentType,
  SyllabusMaterialType,
} from "@/schemaValidations/syllabus.schema";

export default function ChapterViewerPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = decodeURIComponent(resolvedParams.id);
  const chapterId = decodeURIComponent(resolvedParams.chapterId);

  const [syllabus, setSyllabus] = useState<SyllabusContentType | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [materialBlocks, setMaterialBlocks] = useState<MaterialBlockType[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const publishedSyllabusesRes =
          await syllabusApiRequest.getPublishedSyllabusesBySubjectId(id);
        const publishedData = publishedSyllabusesRes?.payload?.data;
        const selectedSyllabusId = Array.isArray(publishedData)
          ? publishedData[0]?.syllabusId
          : undefined;

        if (!selectedSyllabusId) {
          setSyllabus(null);
          setChapterName("");
          setMaterialBlocks([]);
          return;
        }

        const [syllabusRes, materialsRes] = await Promise.all([
          syllabusApiRequest.getSyllabusDetail(selectedSyllabusId),
          syllabusApiRequest.getMaterialsBySyllabusId(selectedSyllabusId),
        ]);

        const syllabusData = syllabusRes?.payload?.data ?? null;
        const materials = (materialsRes?.payload?.data ??
          []) as SyllabusMaterialType[];
        const currentMaterial = materials.find(
          (material) => material.materialId === chapterId,
        );

        setSyllabus(syllabusData);
        setChapterName(currentMaterial?.title ?? "");

        if (!currentMaterial) {
          setMaterialBlocks([]);
          return;
        }

        const blocks: MaterialBlockType[] = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const blockRes =
            await syllabusApiRequest.getMaterialBlocksByMaterialId(
              currentMaterial.materialId,
              page,
              50,
            );
          const blockData = blockRes?.payload?.data;
          if (blockData?.content?.length) {
            blocks.push(...blockData.content);
          }
          totalPages = blockData?.totalPages ?? 0;
          if (totalPages === 0) {
            break;
          }
          page += 1;
        }

        blocks.sort((a, b) => a.idx - b.idx);
        setMaterialBlocks(blocks);
      } catch (error) {
        console.error("Failed to fetch syllabus details", error);
        setSyllabus(null);
        setChapterName("");
        setMaterialBlocks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, chapterId]);

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

  // Helper to render blocks
  const blocks = materialBlocks.map((block) => ({
    id: block.blockId,
    type: block.blockType,
    content: block.contentText,
    startIndex: undefined as number | undefined,
    scaledHeight: undefined as number | undefined,
    h2Number: undefined as number | undefined,
  }));

  const renderBlock = (block: (typeof blocks)[number]) => {
    switch (block.type) {
      case "H1":
        return (
          <h1
            key={block.id}
            className="text-3xl font-bold text-gray-900 mt-8 mb-4"
          >
            {block.content}
          </h1>
        );
      case "H2":
        return (
          <h2
            key={block.id}
            className="text-xl font-bold mt-8 mb-4 text-blue-900 border-b pb-2 border-gray-100 flex items-center gap-2"
          >
            {block.h2Number && (
              <span className="text-blue-500/80 mr-1">{block.h2Number}.</span>
            )}
            {block.content}
          </h2>
        );
      case "PARAGRAPH":
        return (
          <p
            key={block.id}
            className="text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap"
          >
            {block.content}
          </p>
        );
      case "ORDERED_LIST": {
        let items = [];
        try {
          items = JSON.parse(block.content);
        } catch {
          items = [block.content];
        }
        return (
          <ol
            key={block.id}
            start={block.startIndex || 1}
            className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 leading-relaxed"
          >
            {items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }
      case "BULLET_LIST": {
        let items = [];
        try {
          items = JSON.parse(block.content);
        } catch {
          items = [block.content];
        }
        return (
          <ul
            key={block.id}
            className="list-disc pl-6 mb-4 space-y-2 text-gray-700 leading-relaxed"
          >
            {items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }
      case "CODE_BLOCK":
        return (
          <div
            key={block.id}
            className="mb-6 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-sm"
          >
            <div className="flex px-4 py-2.5 bg-[#2d2d2d] border-b border-gray-700 items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                Code
              </span>
            </div>
            <pre className="p-5 text-[13px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {block.content}
            </pre>
          </div>
        );
      case "QUOTE":
        return (
          <blockquote
            key={block.id}
            className="pl-4 border-l-4 border-gray-300 mb-6 text-gray-500 italic py-1 text-lg"
          >
            `&quot;`{block.content}`&quot;`
          </blockquote>
        );
      case "TABLE": {
        let rows = [];
        try {
          rows = JSON.parse(block.content);
        } catch {
          return (
            <p key={block.id} className="text-red-500">
              Invalid Table Data
            </p>
          );
        }
        if (!rows || rows.length === 0) return null;
        const [headerRow, ...bodyRows] = rows;
        return (
          <div
            key={block.id}
            className="overflow-x-auto mb-6 rounded-lg border border-gray-300"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  {headerRow.map((cell: string, i: number) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-sm font-bold text-gray-800 border-r border-gray-300 last:border-0"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bodyRows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell: string, j: number) => (
                      <td
                        key={j}
                        className="px-5 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      case "DIVIDER":
        return <hr key={block.id} className="my-10 border-gray-300" />;
      case "IMAGE":
        return (
          <figure key={block.id} className="my-8 flex flex-col justify-center">
            <img
              src={block.content}
              alt="Material Illustration"
              className="w-full object-contain mx-auto rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.08)] border border-gray-200 bg-gray-50 cursor-zoom-in hover:opacity-95 transition-opacity"
              style={{
                maxHeight: block.scaledHeight
                  ? `${block.scaledHeight}px`
                  : "470px",
              }}
              onClick={() => setEnlargedImage(block.content)}
            />
          </figure>
        );
      default:
        return null;
    }
  };

  // ── Advanced Pagination & Block Slicing Heuristics ──
  const EFFECTIVE_PAGE_HEIGHT = 800; // Inner content height of A4 paper.
  const pages: (typeof blocks)[] = [];
  let currentPage: typeof blocks = [];
  let currentHeight = 0;
  const initialOffset = 180; // Offset for the top title block on the very first page

  const processBlock = (
    block: (typeof blocks)[number],
    availableHeight: number,
  ) => {
    let estimatedHeight = 50;

    // Estimate absolute pixel height needed for this block
    switch (block.type) {
      case "H1":
        estimatedHeight = 80;
        break;
      case "H2":
        estimatedHeight = 60;
        break;
      case "PARAGRAPH":
      case "QUOTE":
        estimatedHeight = 40 + Math.ceil((block.content.length || 1) / 80) * 28;
        break;
      case "ORDERED_LIST":
      case "BULLET_LIST": {
        let items = [];
        try {
          items = JSON.parse(block.content);
        } catch {
          items = [block.content];
        }
        estimatedHeight = 40 + items.length * 32;
        break;
      }
      case "CODE_BLOCK":
        estimatedHeight = 60 + (block.content.match(/\n/g) || []).length * 22;
        break;
      case "TABLE": {
        let rows = [];
        try {
          rows = JSON.parse(block.content);
        } catch {}
        estimatedHeight = 60 + rows.length * 48;
        break;
      }
      case "IMAGE": {
        const remaining = availableHeight - currentHeight;
        // If there's decent space left (>= 250px) but not the full 480px an image wants, we scale it down to fit!
        if (remaining >= 250 && remaining < 480) {
          estimatedHeight = remaining - 20; // Leave 20px padding
          block.scaledHeight = estimatedHeight - 40; // Subtract space for figure/caption margins
        } else {
          estimatedHeight = 480;
        }
        break;
      }
      case "DIVIDER":
        estimatedHeight = 80;
        break;
    }

    if (currentHeight + estimatedHeight <= availableHeight) {
      // It fits seamlessly, add to current page.
      currentPage.push(block);
      currentHeight += estimatedHeight;
    } else {
      // It exceeds the page. Can we slice the block across the page boundary?
      const remainingHeight = availableHeight - currentHeight;
      const isSplittable = [
        "PARAGRAPH",
        "QUOTE",
        "ORDERED_LIST",
        "BULLET_LIST",
        "TABLE",
      ].includes(block.type);

      // Only slice if we have at least 100px left to make it worth breaking
      if (isSplittable && remainingHeight > 100) {
        const ratio = remainingHeight / estimatedHeight;
        let part1Content, part2Content;
        let p2StartIndex = block.startIndex || 1;

        if (block.type === "PARAGRAPH" || block.type === "QUOTE") {
          let splitIndex = Math.floor(block.content.length * ratio);
          // Adjust splitIndex to nearest space to avoid breaking words
          const spaceIdx = block.content.lastIndexOf(" ", splitIndex);
          if (spaceIdx > 0) splitIndex = spaceIdx;

          part1Content = block.content.slice(0, splitIndex).trim();
          part2Content = block.content.slice(splitIndex).trim();
        } else {
          // JSON ARRAYS (Lists, Tables)
          let arr = [];
          try {
            arr = JSON.parse(block.content);
          } catch {
            arr = [block.content];
          }
          let splitIdx = Math.max(1, Math.floor(arr.length * ratio));

          if (block.type === "TABLE" && splitIdx === 1) {
            splitIdx = 2; // Keep Header row attached to at least 1 body row
            if (arr.length <= 2) {
              // Too small to slice (only header + 1 row), move entirely to next page.
              pages.push(currentPage);
              currentPage = [block];
              currentHeight = estimatedHeight;
              return;
            }
          }

          const part1Arr = arr.slice(0, splitIdx);
          const part2Arr = arr.slice(splitIdx);

          if (block.type === "TABLE") {
            part2Arr.unshift(arr[0]); // Persist table headers onto the next page's slice
          } else if (block.type === "ORDERED_LIST") {
            p2StartIndex += part1Arr.length; // Ensure numbering continues correctly
          }

          part1Content = JSON.stringify(part1Arr);
          part2Content = JSON.stringify(part2Arr);
        }

        // Push slice 1 to current page
        currentPage.push({
          ...block,
          content: part1Content,
          id: block.id + "-p1",
        });
        pages.push(currentPage);

        // Reset for next page tracking
        currentPage = [];
        currentHeight = 0;

        // Recursively try to fit slice 2 into the new page
        processBlock(
          {
            ...block,
            content: part2Content,
            id: block.id + "-p2",
            startIndex: p2StartIndex,
          },
          EFFECTIVE_PAGE_HEIGHT,
        );
      } else {
        // Unsplittable (like Images/Code) or not enough space left. Move whole block to next page.
        pages.push(currentPage);
        currentPage = [block];
        currentHeight = estimatedHeight;
      }
    }
  };

  // Pre-process chapter blocks to add sequential numbering
  let currentH2Sequence = 0;
  blocks.forEach((block) => {
    if (
      block.type === "H2" &&
      !block.id.includes("-p1") &&
      !block.id.includes("-p2")
    ) {
      currentH2Sequence++;
      block.h2Number = currentH2Sequence;
    }
  });

  blocks.forEach((block) => {
    const availableHeight =
      pages.length === 0
        ? EFFECTIVE_PAGE_HEIGHT - initialOffset
        : EFFECTIVE_PAGE_HEIGHT;
    processBlock(block, availableHeight);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

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
              <div className="space-y-1">{pageBlocks.map(renderBlock)}</div>
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
