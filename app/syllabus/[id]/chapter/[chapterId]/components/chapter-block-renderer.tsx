import { ChapterBlock } from "../utils/types";

const parseBlockStyle = (style?: string) => {
  if (!style) return {};
  try {
    return JSON.parse(style) as {
      color?: string;
      fontSize?: string;
      align?: "left" | "center" | "right";
    };
  } catch {
    return {};
  }
};

export const renderChapterBlock = (
  block: ChapterBlock,
  globalIndex: number,
  allBlocks: ChapterBlock[],
  onImageClick: (src: string) => void,
) => {
  const { color, fontSize, align } = parseBlockStyle(block.style);
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";
  const { type, content } = block;

  switch (type) {
    case "H1":
      return (
        <div
          key={block.id}
          className={`font-black py-1 mt-6 mb-4 leading-tight ${alignClass}`}
          style={{
            color: color || "#2d342b",
            fontSize: fontSize || "36px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case "H2":
      return (
        <div
          key={block.id}
          className={`font-bold py-1 mt-4 mb-2 leading-tight ${alignClass}`}
          style={{
            color: color || "#2d342b",
            fontSize: fontSize || "24px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case "PARAGRAPH":
      return (
        <div
          key={block.id}
          className={`font-medium py-1 leading-relaxed ${alignClass}`}
          style={{ color: color || "#5a6157", fontSize: fontSize || "16px" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case "BULLET_LIST":
      return (
        <div key={block.id} className="flex items-start gap-3 py-1">
          <div
            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#2d342b" }}
          ></div>
          <div
            className="flex-1 font-medium"
            style={{ color: color || "#5a6157", fontSize: fontSize || "16px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    case "ORDERED_LIST": {
      const orderNum = allBlocks.filter(
        (candidate, index) =>
          candidate.type === "ORDERED_LIST" && index <= globalIndex,
      ).length;
      return (
        <div key={block.id} className="flex items-start gap-3 py-1">
          <div className="mt-1 text-sm font-bold opacity-30 shrink-0 w-4">
            {orderNum}.
          </div>
          <div
            className="flex-1 font-medium"
            style={{ color: color || "#5a6157", fontSize: fontSize || "16px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    }
    case "QUOTE":
      return (
        <div
          key={block.id}
          className="pl-4 border-l-4 border-primary-500/20 py-2 my-4 bg-primary-50/10"
        >
          <div
            className={`font-medium italic ${alignClass}`}
            style={{ color: color || "#5a6157", fontSize: fontSize || "16px" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    case "CODE_BLOCK":
      return (
        <div
          key={block.id}
          className="p-5 bg-zinc-900 rounded-2xl font-mono text-[14px] my-4 shadow-inner"
        >
          <pre className="text-green-400 whitespace-pre-wrap">{content}</pre>
        </div>
      );
    case "TABLE":
      return (
        <div
          key={block.id}
          className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl font-mono text-[13px] my-4"
        >
          <pre className="text-zinc-700 whitespace-pre-wrap">{content}</pre>
        </div>
      );
    case "DIVIDER":
      return (
        <div key={block.id} className="py-8">
          <div className="h-px w-full bg-zinc-200"></div>
        </div>
      );
    case "IMAGE":
      return (
        <div
          key={block.id}
          className={`my-6 rounded-2xl overflow-hidden shadow-md max-w-full ${
            align === "center"
              ? "mx-auto"
              : align === "right"
                ? "ml-auto"
                : "mr-auto"
          }`}
          style={{ width: "fit-content" }}
        >
          <img
            src={content}
            alt="Material Content"
            className="max-w-full h-auto object-contain max-h-[800px]"
            onClick={() => onImageClick(content)}
          />
        </div>
      );
    default:
      return (
        <div
          key={block.id}
          className={alignClass}
          style={{ color, fontSize }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
  }
};
