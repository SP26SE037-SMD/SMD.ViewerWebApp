"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { setUser } from "@/lib/features/userSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isInitialized = useRef(false);
  
  // Hydrate store from localStorage on mount
  if (!isInitialized.current) {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        store.dispatch(setUser(JSON.parse(storedUser)));
      }
    }
    isInitialized.current = true;
  }

  // Double check in useEffect to catch any mismatch
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        store.dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
