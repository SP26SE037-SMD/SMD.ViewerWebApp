import z from "zod";

export const SyllabusStatusEnum = z.enum(["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"]);

export const SyllabusContent = z.object({
  syllabusId: z.string(),
  syllabusCode: z.string(),
  syllabusName: z.string(),
  credits: z.number().optional(),
  department: z.string().optional(),
  status: SyllabusStatusEnum.optional(),
  description: z.string().optional(),
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
