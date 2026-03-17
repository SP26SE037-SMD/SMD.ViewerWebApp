import z from "zod";

export const CurriculumStatusEnum = z.enum(["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"]);

export const CurriculumBody = z
    .object({
        search: z.string().optional(),
        status: CurriculumStatusEnum.optional(),
        page: z.coerce.number().default(0),
        size: z.coerce.number().default(10),
        sort: z.array(z.string()).optional(),
    })

export const CurriculumContent = z.object({
    curriculumId: z.uuid(),
    curriculumCode: z.string(),
    curriculumName: z.string(),
    startYear: z.number(),
    status: CurriculumStatusEnum,
});

export const CurriculumRes = z
    .object({
        status: z.number(),
        message: z.string(),
        data: z.object({
            content: z.array(CurriculumContent),
            page: z.number(),
            size: z.number(),
            totalElements: z.number(),
            totalPages: z.number(),
        }),
    })

export type CurriculumBodyType = z.infer<typeof CurriculumBody>;

export type CurriculumResType = z.infer<typeof CurriculumRes>;
