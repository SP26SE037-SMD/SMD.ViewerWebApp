import http from "@/lib/http";
import { AccountMeResType, UpdateAccountBodyType } from "@/schemaValidations/account.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountMeResType>(
      `/api/auth/me?jwt=${encodeURIComponent(sessionToken)}`,
    ),
  meClient: (sessionToken: string) =>
    http.get<AccountMeResType>(
      `/api/auth/me?jwt=${encodeURIComponent(sessionToken)}`,
    ),
  updateAccount: (id: string, body: UpdateAccountBodyType, status: boolean = true) =>
    http.put<MessageResType>(
      `/api/accounts?id=${encodeURIComponent(id)}&status=${status}`, 
      body
    ),
};

export default accountApiRequest;
