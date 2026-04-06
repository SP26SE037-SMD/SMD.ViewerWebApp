import z from "zod";

export const SyllabusStatusEnum = z.enum([
  "DRAFT",
  "INTERNAL_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const SyllabusContent = z.object({
  syllabusId: z.string(),
  syllabusCode: z.string(),
  syllabusName: z.string(),
  status: SyllabusStatusEnum.optional(),
  subjectId: z.string(),
});

export const SyllabusRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(SyllabusContent),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export type SyllabusContentType = z.infer<typeof SyllabusContent>;
export type SyllabusResType = z.infer<typeof SyllabusRes>;
