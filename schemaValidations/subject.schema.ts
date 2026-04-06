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

export type SubjectBodyType = z.infer<typeof SubjectBody>;
export type SubjectContentType = z.infer<typeof SubjectContent>;
export type SubjectResType = z.infer<typeof SubjectRes>;
export type SubjectDetailType = z.infer<typeof SubjectContent>;
export type SubjectDetailResType = z.infer<typeof SubjectDetailRes>;
