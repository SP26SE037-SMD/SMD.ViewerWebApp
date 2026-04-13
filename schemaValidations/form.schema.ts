import z from "zod";

export const formContentRes = z.object({
  id: z.string(),
  curriculumId: z.string(),
  googleFormId: z.string(),
  formUrl: z.string(),
  formType: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const formFullRes = z.object({
  formId: z.string(),
  title: z.string(),
  description: z.string(),
  sections: [
    {
      sectionId: z.string(),
      title: z.string(),
      actionAfter: z.string(),
      targetSectionId: z.string(),
      questions: [
        {
          questionId: z.string(),
          type: z.string(),
          content: z.string(),
          isRequired: z.boolean(),
          options: [
            {
              optionId: z.string(),
              text: z.string(),
              goToSectionId: z.string(),
            },
          ],
        },
      ],
    },
  ],
});

export type FormContentResType = z.infer<typeof formContentRes>;
export type FormFullResType = z.infer<typeof formFullRes>;
