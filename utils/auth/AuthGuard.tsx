"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ROUTES } from "@/config/routes";
import { Loading } from "@/components/Loading";

interface AuthGuardProps {
  children: ReactNode;
  requireRole?: "admin" | "student";
}

export function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "student" | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace(ROUTES.LOGIN);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile) {
          router.replace(ROUTES.LOGIN);
          return;
        }

        setUserRole(profile.role);

        if (requireRole === "admin" && profile.role !== "admin") {
          router.replace(ROUTES.STUDENT.STUDENT);
          return;
        }

        if (requireRole === "student" && profile.role !== "student") {
          router.replace(ROUTES.ADMIN.ADM);
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.replace(ROUTES.LOGIN);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, pathname, requireRole, supabase]);

  if (loading) <Loading />

  return <>{children}</>;
}
