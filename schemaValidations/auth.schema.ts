import { z } from "zod";

export const LoginBody = z
  .object({
    email: z.email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export const LoginRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    account: z.object({
      accountId: z.number(),
      email: z.string(),
      fullName: z.string(),
      role: z.string(),
    }),
  }),
});

export const LoginGoogleBody = z
  .object({
    idToken: z.string(),
  })
  .strict();

export type LoginBodyType = z.infer<typeof LoginBody>;
export type LoginResType = z.infer<typeof LoginRes>;

export type LoginGoogleBodyType = z.infer<typeof LoginGoogleBody>;
export type LoginGoogleResType = z.infer<typeof LoginRes>;


