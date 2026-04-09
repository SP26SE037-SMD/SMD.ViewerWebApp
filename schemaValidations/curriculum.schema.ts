import z from "zod";

export const CurriculumStatusEnum = z.enum([
  "DRAFT",
  "STRUCTURE_REVIEWED",
  "STRUCTURE_APPROVED",
  "SYLLABUS_DEVELOP",
  "FINAL_REVIEW",
  "SIGNED",
  "PUBLISHED",
  "ARCHIVED",
]);

export const CurriculumSearchByEnum = z.enum(["name", "code"]);

export const CurriculumMajor = z.object({
  majorId: z.string(),
  majorCode: z.string(),
  majorName: z.string(),
});

export const CurriculumBody = z.object({
  search: z.string().optional(),
  searchBy: CurriculumSearchByEnum.optional(),
  status: CurriculumStatusEnum.optional(),
  page: z.coerce.number().default(0),
  size: z.coerce.number().default(10),
  sort: z.array(z.string()).optional(),
});

export const CurriculumContent = z.object({
  curriculumId: z.string(),
  curriculumCode: z.string(),
  curriculumName: z.string(),
  startYear: z.number().nullable().optional(),
  endYear: z.number().nullable().optional(),
  status: CurriculumStatusEnum.optional(),
  major: CurriculumMajor.optional(),
});

export const CurriculumRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(CurriculumContent),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export const CurriculumPlo = z.object({
  ploId: z.string(),
  ploCode: z.string(),
  description: z.string(),
  status: z.string(),
  createdAt: z.string().nullable().optional(),
});

export const CurriculumPloRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(CurriculumPlo),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export const CurriculumSubject = z.object({
  subjectId: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  credits: z.number(),
  semester: z.number(),
});

export const CurriculumSubjectRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(CurriculumSubject),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export type CurriculumBodyType = z.infer<typeof CurriculumBody>;

export type CurriculumContentType = z.infer<typeof CurriculumContent>;
export type CurriculumDetailType = CurriculumContentType;

export type CurriculumResType = z.infer<typeof CurriculumRes>;
export type CurriculumDetailResType = CurriculumResType;

export type CurriculumPloType = z.infer<typeof CurriculumPlo>;
export type CurriculumPloResType = z.infer<typeof CurriculumPloRes>;

export type CurriculumSubjectType = z.infer<typeof CurriculumSubject>;
export type CurriculumSubjectResType = z.infer<typeof CurriculumSubjectRes>;
