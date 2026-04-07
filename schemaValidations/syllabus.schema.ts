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

export const SyllabusSession = z.object({
  sessionId: z.string(),
  syllabusId: z.string(),
  sessionNumber: z.number(),
  sessionTitle: z.string(),
  content: z.string().nullable().optional(),
  teachingMethods: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const SyllabusSessionRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(SyllabusSession),
});

export const CloSessionMapping = z.object({
  id: z.string(),
  cloId: z.string(),
  cloCode: z.string(),
  cloName: z.string(),
  sessionId: z.string(),
  sessionNumber: z.number(),
  sessionTitle: z.string(),
  sessionStatus: z.string().nullable().optional(),
  syllabusId: z.string(),
});

export const CloSessionMappingRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CloSessionMapping),
});

export const SyllabusAssessment = z.object({
  assessmentId: z.string(),
  categoryId: z.string().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  typeId: z.string().nullable().optional(),
  typeName: z.string().nullable().optional(),
  syllabusId: z.string(),
  part: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  completionCriteria: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  questionType: z.string().nullable().optional(),
  knowledgeSkill: z.string().nullable().optional(),
  gradingGuide: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
});

export const SyllabusAssessmentRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(SyllabusAssessment),
});

export type SyllabusContentType = z.infer<typeof SyllabusContent>;
export type SyllabusResType = z.infer<typeof SyllabusRes>;
export type SyllabusSessionType = z.infer<typeof SyllabusSession>;
export type SyllabusSessionResType = z.infer<typeof SyllabusSessionRes>;
export type CloSessionMappingType = z.infer<typeof CloSessionMapping>;
export type CloSessionMappingResType = z.infer<typeof CloSessionMappingRes>;
export type SyllabusAssessmentType = z.infer<typeof SyllabusAssessment>;
export type SyllabusAssessmentResType = z.infer<typeof SyllabusAssessmentRes>;
