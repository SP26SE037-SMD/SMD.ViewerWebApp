"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AccountResType } from "@/schemaValidations/account.schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    return null;
  });
  const isAuthenticated = Boolean(user);
  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    [setUserState],
  );

  useEffect(() => {
    const _user = localStorage.getItem("user");
    setUserState(_user ? JSON.parse(_user) : null);
  }, [setUserState]);

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!.trim()}
    >
      <AppContext.Provider
        value={{
          user,
          setUser,
          isAuthenticated,
        }}
      >
        {children}
      </AppContext.Provider>
    </GoogleOAuthProvider>
  );
}
