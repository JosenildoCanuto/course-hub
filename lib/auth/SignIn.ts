"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerClientSSR } from "@/utils/supabase/server";

import { ROUTES } from "@/config/routes";

const ROLE_HOME_PATH = {
  admin: ROUTES.ADMIN.ADM,
  student: ROUTES.STUDENT.STUDENT,
};

export async function SignIn(formData: FormData) {
  const supabase = await createServerClientSSR();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(
      `${ROUTES.ERROR}?message=${encodeURIComponent(
        "Sessão não encontrada após login."
      )}`
    );
  }

  const userRole = user.user_metadata.role as "admin" | "student";

  const homePath = ROLE_HOME_PATH[userRole] || ROUTES.STUDENT.STUDENT;

  revalidatePath(homePath, "layout");
  redirect(homePath);
}
