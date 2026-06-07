import { ChapterBlock } from "./types";

const EFFECTIVE_PAGE_HEIGHT = 920;
const INITIAL_OFFSET = 100;

export const paginateBlocks = (inputBlocks: ChapterBlock[]): ChapterBlock[][] => {
  const blocks = inputBlocks.map((block) => ({ ...block }));
  const pages: ChapterBlock[][] = [];
  let currentPage: ChapterBlock[] = [];
  let currentHeight = 0;

  const processBlock = (block: ChapterBlock, availableHeight: number) => {
    let estimatedHeight = 40;

    switch (block.type) {
      case "H1":
        estimatedHeight = 80;
        break;
      case "H2":
        estimatedHeight = 60;
        break;
      case "PARAGRAPH":
      case "QUOTE":
        estimatedHeight = 16 + Math.ceil((block.content.length || 1) / 100) * 24;
        break;
      case "ORDERED_LIST":
      case "BULLET_LIST": {
        let items = [];
        try {
          items = JSON.parse(block.content);
        } catch {
          items = [block.content];
        }
        estimatedHeight = 12 + items.length * 24;
        break;
      }
      case "CODE_BLOCK":
        estimatedHeight = 40 + (block.content.match(/\n/g) || []).length * 20;
        break;
      case "TABLE": {
        let rows = [];
        try {
          rows = JSON.parse(block.content);
        } catch {}
        estimatedHeight = 40 + rows.length * 40;
        break;
      }
      case "IMAGE": {
        const remaining = availableHeight - currentHeight;
        if (remaining >= 250 && remaining < 480) {
          estimatedHeight = remaining - 20;
          block.scaledHeight = estimatedHeight - 40;
        } else {
          estimatedHeight = 480;
        }
        break;
      }
      case "DIVIDER":
        estimatedHeight = 64;
        break;
    }

    if (currentHeight + estimatedHeight <= availableHeight) {
      currentPage.push(block);
      currentHeight += estimatedHeight;
      return;
    }

    const remainingHeight = availableHeight - currentHeight;
    const isSplittable = [
      "PARAGRAPH",
      "QUOTE",
      "ORDERED_LIST",
      "BULLET_LIST",
      "TABLE",
    ].includes(block.type);

    if (isSplittable && remainingHeight > 100) {
      const ratio = remainingHeight / estimatedHeight;
      let part1Content = "";
      let part2Content = "";
      let p2StartIndex = block.startIndex || 1;

      if (block.type === "PARAGRAPH" || block.type === "QUOTE") {
        let splitIndex = Math.floor(block.content.length * ratio);
        const spaceIdx = block.content.lastIndexOf(" ", splitIndex);
        if (spaceIdx > 0) splitIndex = spaceIdx;

        part1Content = block.content.slice(0, splitIndex).trim();
        part2Content = block.content.slice(splitIndex).trim();
      } else {
        let arr = [];
        try {
          arr = JSON.parse(block.content);
        } catch {
          arr = [block.content];
        }
        let splitIdx = Math.max(1, Math.floor(arr.length * ratio));

        if (block.type === "TABLE" && splitIdx === 1) {
          splitIdx = 2;
          if (arr.length <= 2) {
            pages.push(currentPage);
            currentPage = [block];
            currentHeight = estimatedHeight;
            return;
          }
        }

        const part1Arr = arr.slice(0, splitIdx);
        const part2Arr = arr.slice(splitIdx);

        if (block.type === "TABLE") {
          part2Arr.unshift(arr[0]);
        } else if (block.type === "ORDERED_LIST") {
          p2StartIndex += part1Arr.length;
        }

        part1Content = JSON.stringify(part1Arr);
        part2Content = JSON.stringify(part2Arr);
      }

      currentPage.push({
        ...block,
        content: part1Content,
        id: block.id + "-p1",
      });
      pages.push(currentPage);

      currentPage = [];
      currentHeight = 0;

      processBlock(
        {
          ...block,
          content: part2Content,
          id: block.id + "-p2",
          startIndex: p2StartIndex,
        },
        EFFECTIVE_PAGE_HEIGHT,
      );
      return;
    }

    pages.push(currentPage);
    currentPage = [block];
    currentHeight = estimatedHeight;
  };

  let currentH2Sequence = 0;
  blocks.forEach((block) => {
    if (
      block.type === "H2" &&
      !block.id.includes("-p1") &&
      !block.id.includes("-p2")
    ) {
      currentH2Sequence += 1;
      block.h2Number = currentH2Sequence;
    }
  });

  blocks.forEach((block) => {
    const availableHeight =
      pages.length === 0 ? EFFECTIVE_PAGE_HEIGHT - INITIAL_OFFSET : EFFECTIVE_PAGE_HEIGHT;
    processBlock(block, availableHeight);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};
