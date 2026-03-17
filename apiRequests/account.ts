import http from "@/lib/http";
import { AccountMeResType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountMeResType>(
      `/api/auth/me?jwt=${encodeURIComponent(sessionToken)}`,
    ),
  meClient: (sessionToken: string) =>
    http.get<AccountMeResType>(
      `/api/auth/me?jwt=${encodeURIComponent(sessionToken)}`,
    ),
};

export default accountApiRequest;
