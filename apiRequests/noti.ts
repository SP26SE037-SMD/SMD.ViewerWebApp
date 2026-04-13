import http from "@/lib/http";
import {
  NotificationDetailRes,
  NotificationDetailResType,
  MyNotificationsRes,
  MyNotificationsResType,
} from "@/schemaValidations/noti.schema";

const notiApiRequest = {
  getMyNotifications: async (page = 0, size = 5) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));

    const response = await http.get<unknown>(
      `/api/notifications/my-notifications?${params.toString()}`,
    );

    if (!response) {
      throw new Error("Failed to fetch notifications");
    }

    return {
      ...response,
      payload: MyNotificationsRes.parse(
        response.payload,
      ) as MyNotificationsResType,
    };
  },
  searchNotifications: async (search: string, page = 0, size = 5) => {
    const params = new URLSearchParams();
    params.set("search", search);
    params.set("page", String(page));
    params.set("size", String(size));

    const response = await http.get<unknown>(
      `/api/notifications/search?${params.toString()}`,
    );

    if (!response) {
      throw new Error("Failed to search notifications");
    }

    return {
      ...response,
      payload: MyNotificationsRes.parse(
        response.payload,
      ) as MyNotificationsResType,
    };
  },
  markAllAsRead: () => {
    return http.post<unknown>("/api/notifications/mark-all-as-read", null, {
      headers: {
        accept: "*/*",
      },
    });
  },
  markAsRead: (notificationId: string) => {
    return http.put<unknown>(
      `/api/notifications/${notificationId}/mark-as-read`,
      null,
      {
        headers: {
          accept: "*/*",
        },
      },
    );
  },
  getNotificationById: async (notificationId: string) => {
    const response = await http.get<unknown>(
      `/api/notifications/${notificationId}`,
    );

    if (!response) {
      throw new Error("Failed to fetch notification detail");
    }

    return {
      ...response,
      payload: NotificationDetailRes.parse(
        response.payload,
      ) as NotificationDetailResType,
    };
  },
};

export default notiApiRequest;
