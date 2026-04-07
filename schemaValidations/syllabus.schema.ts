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
  minAvgGrade: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  approvedDate: z.string().nullable().optional(),
  status: SyllabusStatusEnum.optional(),
  subjectId: z.string(),
  subjectCode: z.string().optional(),
  subjectName: z.string().optional(),
  credit: z.number().nullable().optional(),
});

export const SyllabusRes = z.object({
  status: z.number(),
  message: z.string(),
  data: SyllabusContent,
});

export type SyllabusContentType = z.infer<typeof SyllabusContent>;
export type SyllabusResType = z.infer<typeof SyllabusRes>;
