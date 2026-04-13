import z from "zod";

export const NotificationTypeEnum = z.enum([
  "SYSTEM",
  "TASK_ASSIGNED",
  "REVIEW_REQUEST",
  "COMMENT",
  "APPROVAL",
  "REJECTION",
  "REMINDER",
  "DEADLINE",
  "SPRINT_UPDATE",
]);

export const NotificationItem = z.object({
  notificationId: z.string(),
  title: z.string(),
  message: z.string(),
  type: NotificationTypeEnum,
  isRead: z.boolean(),
  accountId: z.string(),
  taskId: z.string().nullable().optional(),
  reviewId: z.string().nullable().optional(),
  accountEmail: z.string(),
  createdAt: z.string(),
});

export const MyNotificationsRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(NotificationItem),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export const NotificationDetailRes = z.object({
  status: z.number(),
  message: z.string(),
  data: NotificationItem,
});

export type NotificationItemType = z.infer<typeof NotificationItem>;
export type MyNotificationsResType = z.infer<typeof MyNotificationsRes>;
export type NotificationDetailResType = z.infer<typeof NotificationDetailRes>;
