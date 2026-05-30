"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { setUser } from "./userSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isInitialized = useRef(false);
  
  if (!isInitialized.current) {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        store.dispatch(setUser(JSON.parse(storedUser)));
      }
    }
    isInitialized.current = true;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        store.dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
