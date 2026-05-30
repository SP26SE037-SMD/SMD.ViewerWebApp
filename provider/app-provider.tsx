"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";


export type User = {
  accountId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string | { roleName: string };
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!.trim()}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
