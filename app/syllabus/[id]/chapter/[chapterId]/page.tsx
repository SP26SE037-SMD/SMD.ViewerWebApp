"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";

type SyllabusDetail = {
  syllabusId: string;
  syllabusCode: string;
  syllabusName: string;
  chapterMaterials?: {
    chapterId: string;
    chapterName: string;
    blocks: {
      id: string;
      type: "H1" | "H2" | "PARAGRAPH" | "ORDERED_LIST" | "BULLET_LIST" | "CODE_BLOCK" | "QUOTE" | "TABLE" | "DIVIDER" | "IMAGE";
      content: string;
      startIndex?: number; // Used for split Ordered Lists
    }[];
  }[];
};

export default function ChapterViewerPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = decodeURIComponent(resolvedParams.id);
  const chapterId = decodeURIComponent(resolvedParams.chapterId);

  const [syllabus, setSyllabus] = useState<SyllabusDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/syllabuses/${id}`);
        if (res.ok) {
          const json = await res.json();
          setSyllabus(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch syllabus details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-400" />
        <p className="text-sm text-gray-400">Đang tải tài liệu...</p>
      </div>
    );
  }

  const chapter = syllabus?.chapterMaterials?.find(c => c.chapterId === chapterId);

  if (!syllabus || !chapter) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 font-medium text-center">Không tìm thấy nội dung tài liệu này</p>
        <button onClick={() => router.back()} className="text-blue-500 text-sm font-semibold hover:underline mt-2">
          Quay lại trang trước
        </button>
      </div>
    );
  }

  // Helper to render blocks
  const renderBlock = (block: any) => {
    switch (block.type) {
      case "H1":
        return <h1 key={block.id} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{block.content}</h1>;
      case "H2":
        return <h2 key={block.id} className="text-xl font-bold text-gray-800 mt-6 mb-3">{block.content}</h2>;
      case "PARAGRAPH":
        return <p key={block.id} className="text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{block.content}</p>;
      case "ORDERED_LIST": {
        let items = [];
        try { items = JSON.parse(block.content); } catch { items = [block.content]; }
        return (
          <ol key={block.id} start={block.startIndex || 1} className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 leading-relaxed">
            {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ol>
        );
      }
      case "BULLET_LIST": {
        let items = [];
        try { items = JSON.parse(block.content); } catch { items = [block.content]; }
        return (
          <ul key={block.id} className="list-disc pl-6 mb-4 space-y-2 text-gray-700 leading-relaxed">
            {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        );
      }
      case "CODE_BLOCK":
        return (
          <div key={block.id} className="mb-6 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-sm">
            <div className="flex px-4 py-2.5 bg-[#2d2d2d] border-b border-gray-700 items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Code</span>
            </div>
            <pre className="p-5 text-[13px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {block.content}
            </pre>
          </div>
        );
      case "QUOTE":
        return (
          <blockquote key={block.id} className="pl-4 border-l-4 border-gray-300 mb-6 text-gray-500 italic py-1 text-lg">
            "{block.content}"
          </blockquote>
        );
      case "TABLE": {
        let rows = [];
        try { rows = JSON.parse(block.content); } catch { return <p key={block.id} className="text-red-500">Invalid Table Data</p>; }
        if (!rows || rows.length === 0) return null;
        const [headerRow, ...bodyRows] = rows;
        return (
          <div key={block.id} className="overflow-x-auto mb-6 rounded-lg border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  {headerRow.map((cell: string, i: number) => (
                    <th key={i} className="px-5 py-3 text-sm font-bold text-gray-800 border-r border-gray-300 last:border-0">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bodyRows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="px-5 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-0">{cell}</td>
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
          <figure key={block.id} className="my-8">
            <img src={block.content} alt="Material Illustration" className="w-full rounded-xl shadow-sm border border-gray-200" />
            <figcaption className="text-center text-xs text-gray-400 mt-2 font-medium">Hình ảnh đính kèm</figcaption>
          </figure>
        );
      default:
        return null;
    }
  };

  // ── Advanced Pagination & Block Slicing Heuristics ──
  const EFFECTIVE_PAGE_HEIGHT = 800; // Inner content height of A4 paper.
  const pages: typeof chapter.blocks[] = [];
  let currentPage: typeof chapter.blocks = [];
  let currentHeight = 0;
  let initialOffset = 180; // Offset for the top title block on the very first page

  const processBlock = (block: any, availableHeight: number) => {
    let estimatedHeight = 50;
    
    // Estimate absolute pixel height needed for this block
    switch (block.type) {
      case "H1": estimatedHeight = 80; break;
      case "H2": estimatedHeight = 60; break;
      case "PARAGRAPH":
      case "QUOTE":
        estimatedHeight = 40 + Math.ceil((block.content.length || 1) / 80) * 28;
        break;
      case "ORDERED_LIST":
      case "BULLET_LIST": {
        let items = [];
        try { items = JSON.parse(block.content); } catch { items = [block.content]; }
        estimatedHeight = 40 + (items.length * 32);
        break;
      }
      case "CODE_BLOCK":
        estimatedHeight = 60 + ((block.content.match(/\n/g) || []).length * 22);
        break;
      case "TABLE": {
        let rows = [];
        try { rows = JSON.parse(block.content); } catch {}
        estimatedHeight = 60 + (rows.length * 48);
        break;
      }
      case "IMAGE":
        estimatedHeight = 450;
        break;
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
      const isSplittable = ["PARAGRAPH", "QUOTE", "ORDERED_LIST", "BULLET_LIST", "TABLE"].includes(block.type);

      // Only slice if we have at least 100px left to make it worth breaking
      if (isSplittable && remainingHeight > 100) {
        let ratio = remainingHeight / estimatedHeight;
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
          try { arr = JSON.parse(block.content); } catch { arr = [block.content]; }
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
        currentPage.push({ ...block, content: part1Content, id: block.id + "-p1" });
        pages.push(currentPage);
        
        // Reset for next page tracking
        currentPage = [];
        currentHeight = 0;
        
        // Recursively try to fit slice 2 into the new page
        processBlock({ ...block, content: part2Content, id: block.id + "-p2", startIndex: p2StartIndex }, EFFECTIVE_PAGE_HEIGHT);

      } else {
        // Unsplittable (like Images/Code) or not enough space left. Move whole block to next page.
        pages.push(currentPage);
        currentPage = [block];
        currentHeight = estimatedHeight;
      }
    }
  };

  chapter.blocks.forEach((block) => {
    const pageAvailableHeight = pages.length === 0 ? EFFECTIVE_PAGE_HEIGHT - initialOffset : EFFECTIVE_PAGE_HEIGHT;
    processBlock(block, pageAvailableHeight);
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
              title="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col truncate cursor-default">
              <div className="flex items-center gap-2 mb-0.5">
                 <BookOpen size={14} className="text-blue-600" />
                 <h1 className="text-sm font-bold text-gray-800 truncate">{syllabus.syllabusCode} • {syllabus.syllabusName}</h1>
              </div>
              <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-2">
                 Tài liệu bài giảng: <span className="text-gray-700">{chapter.chapterName}</span>
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
            className="w-full max-w-[850px] bg-white rounded-sm shadow-[0_4px_24px_rgb(0,0,0,0.06)] ring-1 ring-gray-200 isolate relative flex flex-col"
            style={{ minHeight: '1123px' }} // Standard A4 height at 96 PPI
          >
            {/* Document Content Area */}
            <article className="px-10 py-12 sm:px-16 sm:py-16 md:px-20 md:py-20 flex-1">
              
              {/* Title block only on the first page */}
              {pageIndex === 0 && (
                <div className="mb-10 border-b-2 border-gray-100 pb-8 text-center">
                  <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-3">{syllabus.syllabusCode}</p>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                    {chapter.chapterName}
                  </h1>
                </div>
              )}

              {/* Blocks renderer */}
              <div className="space-y-1">
                {pageBlocks.map(renderBlock)}
              </div>
            </article>

            {/* Page Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium text-gray-400 font-mono tracking-widest pointer-events-none">
              — {pageIndex + 1} —
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
