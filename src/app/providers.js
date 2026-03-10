"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { hydrateFromStorage } from "@/store/authSlice";

export default function Providers({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const persistedAuth =
        JSON.parse(localStorage.getItem("auth") || "null") ||
        JSON.parse(sessionStorage.getItem("auth") || "null");
      if (persistedAuth?.user && persistedAuth?.tokens) {
        store.dispatch(hydrateFromStorage(persistedAuth));
      }
    } catch {
      // Ignore invalid local auth payloads.
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
