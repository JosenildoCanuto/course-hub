"use server";

import { redirect } from "next/navigation";

import { createServerClientSSR } from "@/utils/supabase/server";

export async function SignUp(formData: FormData) {
  const name = `${formData.get("first-name")} ${formData.get("last-name")}`;
  const role = formData.get("role") as "admin" | "student";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerClientSSR();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) redirect(`/error?message=${encodeURIComponent(error.message)}`);

  return redirect("/"); // criar uma pagina falando pra confirmar o email
}
