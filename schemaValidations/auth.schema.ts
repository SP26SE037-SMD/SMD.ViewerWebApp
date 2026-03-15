import { z } from "zod";

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
      avatar: z.string(),
    }),
  }),
});

export const LoginBody = z
  .object({
    email: z.email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export const LoginGoogleBody = z
  .object({
    idToken: z.string(),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;
export type LoginGoogleBodyType = z.TypeOf<typeof LoginGoogleBody>;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = LoginRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
