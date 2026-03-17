import accountApiRequest from "@/apiRequests/account";
import type { AccountMeResType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
import HeaderClient from "./header-client";

export default async function Header() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  let account: AccountMeResType["data"] | null = null;
  if (sessionToken) {
    const result = await accountApiRequest.me(sessionToken);
    account = result?.payload?.data ?? null;
  }

  return <HeaderClient account={account} />;
}
