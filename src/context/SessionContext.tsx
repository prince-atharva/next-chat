"use client";

import { createContext, useContext } from "react";
import { SessionProvider as Provider, useSession as nextAuthUseSession } from "next-auth/react";

const SessionContext = createContext<boolean>(false);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={true}>
      <Provider>{children}</Provider>
    </SessionContext.Provider>
  );
}

export function useSession() {
  const isInsideProvider = useContext(SessionContext);

  if (!isInsideProvider) {
    throw new Error("You must use `useSession` inside a <SessionProvider>.");
  }

  return nextAuthUseSession();
}