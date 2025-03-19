"use client";

import { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

interface User {
  name: string;
  username: string;
  email: string;
  image: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateSession: () => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();

  const user = useMemo(() => {
    if (status !== "authenticated" || !session?.user) return null;

    return {
      name: session.user.name || "",
      username: session.user.username || "",
      email: session.user.email || "",
      image: session.user.image || "",
      isEmailVerified: session.user.isEmailVerified || false,
    };
  }, [session?.user, status]);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      updateSession,
    }),
    [user, status, updateSession]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {authContextValue.isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Image src="/Animation - 1742373757643.gif" alt="Chat" width={200} height={200}/>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}