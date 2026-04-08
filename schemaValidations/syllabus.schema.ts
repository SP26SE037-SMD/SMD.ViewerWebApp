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

export const SyllabusMaterial = z.object({
  materialId: z.string(),
  title: z.string(),
  materialType: z.string(),
  uploadedAt: z.string(),
  id: z.number(),
  version: z.number(),
  status: z.string().nullable().optional(),
  syllabusId: z.string(),
});

export const SyllabusMaterialRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(SyllabusMaterial),
});

export const MaterialBlock = z.object({
  blockId: z.string(),
  idx: z.number(),
  blockStyle: z.string(),
  blockType: z.string(),
  contentText: z.string(),
});

export const MaterialBlockRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(MaterialBlock),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export type SyllabusContentType = z.infer<typeof SyllabusContent>;
export type SyllabusResType = z.infer<typeof SyllabusRes>;
export type SyllabusSessionType = z.infer<typeof SyllabusSession>;
export type SyllabusSessionResType = z.infer<typeof SyllabusSessionRes>;
export type CloSessionMappingType = z.infer<typeof CloSessionMapping>;
export type CloSessionMappingResType = z.infer<typeof CloSessionMappingRes>;
export type SyllabusAssessmentType = z.infer<typeof SyllabusAssessment>;
export type SyllabusAssessmentResType = z.infer<typeof SyllabusAssessmentRes>;
export type SyllabusMaterialType = z.infer<typeof SyllabusMaterial>;
export type SyllabusMaterialResType = z.infer<typeof SyllabusMaterialRes>;
export type MaterialBlockType = z.infer<typeof MaterialBlock>;
export type MaterialBlockResType = z.infer<typeof MaterialBlockRes>;
