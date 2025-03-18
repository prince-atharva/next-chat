"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";

interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      setUser({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        image: session?.user?.image || "",
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  }), [user, status]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {authContextValue.isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg font-medium">Loading...</p>
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