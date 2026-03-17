import z from 'zod'

export const MessageRes = z
  .object({
    status: z.number(),
    message: z.string()
  })
  .strict()

export type MessageResType = z.infer<typeof MessageRes>
