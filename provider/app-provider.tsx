"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// User type supports both login (role: string) and me endpoint (role: { roleName: string })
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
