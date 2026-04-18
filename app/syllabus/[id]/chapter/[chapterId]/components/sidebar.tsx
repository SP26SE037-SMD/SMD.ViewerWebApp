"use client";

import { useEffect, useState } from "react";
import { BookOpenText } from "lucide-react";

import { cn } from "@/lib/utils";

import { ChapterBlock } from "../utils/types";

type HeadingLevel = "H1" | "H2";

type HeadingItem = {
  id: string;
  level: HeadingLevel;
  text: string;
};

type SidebarProps = {
  blocks: ChapterBlock[];
  className?: string;
  title?: string;
};

const getDomId = (blockId: string) => `chapter-block-${blockId}`;

const stripHtml = (raw: string) => {
  return raw
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const fallbackText = (level: HeadingLevel, indexLabel: string) => {
  if (level === "H1") return `Section ${indexLabel}`;
  return `Subsection ${indexLabel}`;
};

export default function Sidebar({
  blocks,
  className,
  title = "Contents",
}: SidebarProps) {
  const headings = blocks
    .filter((block) => block.type === "H1" || block.type === "H2")
    .reduce<{
      h1Counter: number;
      h2Counter: number;
      items: HeadingItem[];
    }>(
      (acc, block) => {
        const level = block.type as HeadingLevel;
        const h1Counter =
          level === "H1" ? acc.h1Counter + 1 : Math.max(acc.h1Counter, 1);
        const h2Counter = level === "H1" ? 0 : acc.h2Counter + 1;
        const indexLabel =
          level === "H1" ? String(h1Counter) : `${h1Counter}.${h2Counter}`;
        const clean = stripHtml(block.content);
        const text = clean.length > 0 ? clean : fallbackText(level, indexLabel);

        return {
          h1Counter,
          h2Counter,
          items: [
            ...acc.items,
            {
              id: block.id,
              level,
              text,
              indexLabel,
            },
          ],
        };
      },
      {
        h1Counter: 0,
        h2Counter: 0,
        items: [],
      },
    ).items;

  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const resolvedActiveId =
    activeId && headings.some((item) => item.id === activeId)
      ? activeId
      : (headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) return;

        const target = visible[0].target as HTMLElement;
        const blockId = target.id.replace("chapter-block-", "");
        if (blockId) setActiveId(blockId);
      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.6, 1],
      },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(getDomId(heading.id));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (heading: HeadingItem) => {
    setActiveId(heading.id);
    const target = document.getElementById(getDomId(heading.id));
    if (!target) return;
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside
      className={cn(
        "w-full lg:w-80 shrink-0 lg:fixed lg:left-0 lg:top-[57px] lg:h-[calc(100vh-57px)] z-40",
        className,
      )}
    >
      <div className="h-full border-r border-[#dadce0] bg-[#f1f3f4] lg:rounded-none rounded-2xl overflow-hidden">
        <div className="px-5 py-6 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenText size={16} className="text-[#3D6B2C]" />
            <h2 className="text-[18px] font-semibold text-[#1A2E12]">
              {title}
            </h2>
          </div>
        </div>

        <nav className="h-[calc(100%-84px)] overflow-auto px-3 py-4">
          <ul className="space-y-1">
            {headings.map((heading) => {
              const isActive = heading.id === resolvedActiveId;
              const isH2 = heading.level === "H2";

              return (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(heading)}
                    className={cn(
                      "w-full text-left rounded-full px-4 py-2.5 transition-colors flex items-center gap-2",
                      "hover:bg-[#E8F5E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D6B2C]",
                      isH2 ? "pl-8 text-[14px]" : "text-[15px]",
                      isActive
                        ? "bg-[#D4ECC8] text-[#2E5020] font-semibold"
                        : "text-[#3c4043] font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block min-w-8 text-[13px]",
                        isActive ? "text-[#2E5020]" : "text-[#5A6B52]",
                      )}
                    ></span>
                    <span className="align-middle truncate">
                      {heading.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
