export type TextAlign = "left" | "center" | "right";

export type BlockStyle = {
  color?: string;
  fontSize?: string;
  align?: TextAlign;
};

export type ChapterBlock = {
  id: string;
  type: string;
  content: string;
  style?: string;
  startIndex?: number;
  scaledHeight?: number;
  h2Number?: number;
};
