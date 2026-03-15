import envConfig from "@/config";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const AUTHENTICATION_ERROR_STATUS = 401;
const ENTITY_ERROR_STATUS = 422;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: Record<string, string> =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options?.headers as Record<string, string>),
    },
    body,
    method,
  });

  // Interceptor là nơi chúng ta xử lý request và response trước khi trả về cho phía component
  // Xử lý an toàn khi API không trả về body (vd: 204 No Content)
  let payload: Response;
  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    payload = await res.json();
  } else {
    payload = (await res.text()) as unknown as Response;
  }

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    // Xử lý lỗi nghiệp vụ (422 Unprocessable Entity)
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        },
      );
    }

    // Xử lý lỗi xác thực (401 Unauthorized)
    if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: { "Content-Type": "application/json", ...baseHeaders },
          });

          // Xử lý logout
          try {
            await clientLogoutRequest;
          } catch (error) {
            console.error("Logout request failed", error);
          } finally {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("sessionTokenExpiresAt");
            clientLogoutRequest = null;
            window.location.href = "/login";
            return;
          }
        }
      } else {
        // An toàn hơn khi trích xuất token trên server
        const authHeader = (options?.headers as Record<string, string>)
          ?.Authorization;
        const sessionToken = authHeader?.split("Bearer ")?.[1];
        if (sessionToken) {
          redirect(`/logout?sessionToken=${sessionToken}`);
        } else {
          redirect("/login"); // Fallback nếu không có token
        }
      }
    }
    throw new HttpError(data);
  }
  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
