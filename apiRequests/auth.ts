import http from "@/lib/http";
import {
  LoginBodyType,
  LoginGoogleBodyType,
  LoginResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body),
  loginGoogle: (body: LoginGoogleBodyType) =>
    http.post<LoginResType>("/api/auth/login-google", body, { baseUrl: "" }),
  auth: (body: { sessionToken: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    ),
  logoutFromNextClientToNextServer: (force?: boolean | undefined) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      { force },
      {
        baseUrl: "",
      },
    ),
};
export default authApiRequest;
