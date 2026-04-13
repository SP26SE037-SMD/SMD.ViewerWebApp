import z from "zod";

export const SubjectStatusEnum = z.enum([
  "DRAFT",
  "DEFINED",
  "WAITING_SYLLABUS",
  "PENDING_REVIEW",
  "COMPLETED",
  "ARCHIVED",
]);

export const SubjectSearchByEnum = z.enum(["name", "code"]);

export const SubjectSortDirectionEnum = z.enum(["asc", "desc"]);

export const SubjectSortByEnum = z.enum([
  "subjectName",
  "subjectCode",
  "approvedDate",
]);

export const SubjectBody = z.object({
  search: z.string().optional(),
  searchBy: SubjectSearchByEnum.optional(),
  status: SubjectStatusEnum.optional(),
  page: z.coerce.number().default(0),
  size: z.coerce.number().default(10),
  sortBy: SubjectSortByEnum.optional(),
  departmentId: z.string().optional(),
  direction: SubjectSortDirectionEnum.optional(),
});

export const SubjectDepartment = z.object({
  departmentId: z.string(),
  departmentCode: z.string(),
  departmentName: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
});

export const SubjectPreRequisite = z.object({
  prerequisiteId: z.string(),
  prerequisiteSubjectCode: z.string(),
  prerequisiteSubjectName: z.string(),
  isMandatory: z.boolean(),
  createdAt: z.string(),
});

export const SubjectPrerequisiteRequirement = z.object({
  id: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  prerequisiteSubjectCode: z.string(),
  prerequisiteSubjectName: z.string(),
  isMandatory: z.boolean(),
  createdAt: z.string(),
});

export const SubjectPrerequisiteRequirementsRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(SubjectPrerequisiteRequirement),
});

export const SubjectContent = z.object({
  subjectId: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  status: SubjectStatusEnum.optional(),
  credits: z.number().optional(),
  degreeLevel: z.string().nullable().optional(),
  timeAllocation: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  studentTasks: z.string().nullable().optional(),
  scoringScale: z.number().nullable().optional(),
  decisionNo: z.string().nullable().optional(),
  tool: z.string().nullable().optional(),
  minToPass: z.number().nullable().optional(),
  approvedDate: z.string().nullable().optional(),
  department: SubjectDepartment.nullable().optional(),
  preRequisite: SubjectPreRequisite.nullable().optional(),
});

export const SubjectRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(SubjectContent),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export const SubjectDetailRes = z.object({
  status: z.number(),
  message: z.string(),
  data: SubjectContent,
});

export const SubjectSource = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  type: z.string(),
  author: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  publishedYear: z.number().nullable().optional(),
  isbn: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
});

export const SubjectSourceRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(SubjectSource),
});

export const Clo = z.object({
  cloId: z.string(),
  cloName: z.string(),
  description: z.string().nullable().optional(),
  bloomLevel: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const CloRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(Clo),
});

export const CloPloMapping = z.object({
  id: z.string(),
  cloId: z.string(),
  cloName: z.string(),
  ploId: z.string(),
  ploName: z.string(),
  contributionLevel: z.string(),
  createdAt: z.string(),
});

export const CloPloMappingRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CloPloMapping),
});

export type SubjectBodyType = z.infer<typeof SubjectBody>;
export type SubjectContentType = z.infer<typeof SubjectContent>;
export type SubjectResType = z.infer<typeof SubjectRes>;
export type SubjectDetailType = SubjectContentType;
export type SubjectDetailResType = z.infer<typeof SubjectDetailRes>;
export type SubjectSourceType = z.infer<typeof SubjectSource>;
export type SubjectSourceResType = z.infer<typeof SubjectSourceRes>;
export type CloType = z.infer<typeof Clo>;
export type CloResType = z.infer<typeof CloRes>;
export type CloPloMappingType = z.infer<typeof CloPloMapping>;
export type CloPloMappingResType = z.infer<typeof CloPloMappingRes>;
export type SubjectPrerequisiteRequirementType = z.infer<
  typeof SubjectPrerequisiteRequirement
>;
export type SubjectPrerequisiteRequirementsResType = z.infer<
  typeof SubjectPrerequisiteRequirementsRes
>;
