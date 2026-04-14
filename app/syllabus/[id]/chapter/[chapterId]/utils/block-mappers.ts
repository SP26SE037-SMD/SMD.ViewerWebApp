import { MaterialBlockType } from "@/schemaValidations/syllabus.schema";

import { ChapterBlock } from "./types";

export const mapMaterialBlocks = (
  materialBlocks: MaterialBlockType[],
): ChapterBlock[] => {
  return materialBlocks.map((block) => ({
    id: block.blockId,
    type: block.blockType,
    content: block.contentText,
    style: block.blockStyle,
    startIndex: undefined,
    scaledHeight: undefined,
    h2Number: undefined,
  }));
};
