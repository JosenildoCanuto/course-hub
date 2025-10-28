"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient();

type AppUser = {
  id: string;
  name?: string;
  email?: string;
  role?: "admin" | "student" | null;
  needsPasswordChange?: boolean;
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchProfile(userId: string | null) {
    if (!userId) {
      setUser(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, needs_password_change")
      .eq("id", userId)
      .single();
    if (!error && data) {
      setUser({
        id: data.id,
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        role: data.role,
        needsPasswordChange: data.needs_password_change ?? false,
      });
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user && mounted) {
        await fetchProfile(data.session.user.id);
      }
      setLoading(false);
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.id) {
          fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
    // fetchProfile será chamado automaticamente pelo listener
    // pode redirecionar após o login no componente que chama login()
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.push("/login");
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getSession();
    await fetchProfile(data?.session?.user?.id ?? null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
