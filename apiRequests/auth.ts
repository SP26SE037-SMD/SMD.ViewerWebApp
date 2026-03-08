import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  loginGoogle: (body: { idToken: string }) =>
    http.post("/api/auth/login-google", body, { baseUrl: "" }),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (force?: boolean | undefined) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      { force },
      {
        baseUrl: "",
      }
    ),
};
export default authApiRequest;
