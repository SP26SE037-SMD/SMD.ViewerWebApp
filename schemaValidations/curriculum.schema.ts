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

export const CurriculumSubject = z.object({
  subjectId: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  semester: z.number(),
  credits: z.number(),
  preRequisite: z.string().nullable().optional(),
  groupId: z.string().nullable().optional(),
});

export const CurriculumGroupTypeEnum = z.enum(["COMBO", "ELECTIVE"]);

export const CurriculumGroup = z.object({
  groupId: z.string(),
  groupCode: z.string(),
  groupName: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  type: CurriculumGroupTypeEnum,
});

export const CurriculumSemesterMappingSubject = z.object({
  subjectId: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  credit: z.number(),
  groupId: z.string().nullable().optional(),
  prerequisiteSubjectCodes: z.array(z.string()),
});

export const CurriculumSemesterMapping = z.object({
  semesterNo: z.number(),
  subjects: z.array(CurriculumSemesterMappingSubject),
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

export const CurriculumDetail = CurriculumContent.extend({
  englishName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  decisionNo: z.string().nullable().optional(),
  totalSubjects: z.number().nullable().optional(),
  totalCredits: z.number().nullable().optional(),
  subjects: z.array(CurriculumSubject).optional(),
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

export const CurriculumDetailRes = z.object({
  status: z.number(),
  message: z.string(),
  data: CurriculumDetail,
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

export const CurriculumSemesterMappingsRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    curriculumId: z.string(),
    semesterMappings: z.array(CurriculumSemesterMapping),
  }),
});

export const CurriculumGroupRes = z.object({
  status: z.number(),
  message: z.string(),
  data: CurriculumGroup,
});

export type CurriculumBodyType = z.infer<typeof CurriculumBody>;

export type CurriculumContentType = z.infer<typeof CurriculumContent>;
export type CurriculumDetailType = z.infer<typeof CurriculumDetail>;
export type CurriculumSubjectType = z.infer<typeof CurriculumSubject>;
export type CurriculumGroupType = z.infer<typeof CurriculumGroup>;
export type CurriculumSemesterMappingSubjectType = z.infer<
  typeof CurriculumSemesterMappingSubject
>;
export type CurriculumSemesterMappingType = z.infer<
  typeof CurriculumSemesterMapping
>;

export type CurriculumResType = z.infer<typeof CurriculumRes>;
export type CurriculumDetailResType = z.infer<typeof CurriculumDetailRes>;

export type CurriculumPloType = z.infer<typeof CurriculumPlo>;
export type CurriculumPloResType = z.infer<typeof CurriculumPloRes>;
export type CurriculumSemesterMappingsResType = z.infer<
  typeof CurriculumSemesterMappingsRes
>;
export type CurriculumGroupResType = z.infer<typeof CurriculumGroupRes>;
