import z from "zod";

export const AccountRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    accountId: z.uuid(),
    email: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
    role: z.object({
      roleName: z.string(),
    }),
  }),
});

export type AccountResType = z.infer<typeof AccountRes>;

export const PermissionRes = z.object({
  permissionId: z.uuid(),
  permissionName: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export const RoleDetailRes = z.object({
  roleId: z.uuid(),
  roleName: z.string(),
  description: z.string(),
  permissions: z.array(PermissionRes),
  createdAt: z.string(),
});

export const AccountMeRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    accountId: z.uuid(),
    email: z.string(),
    fullName: z.string(),
    phoneNumber: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    role: RoleDetailRes,
    isActive: z.boolean(),
    createdAt: z.string(),
    lastLogin: z.string(),
  }),
});

export type AccountMeResType = z.infer<typeof AccountMeRes>;

export const UpdateAccountBody = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UpdateAccountBodyType = z.infer<typeof UpdateAccountBody>;
