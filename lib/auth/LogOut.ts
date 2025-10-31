"use server";
import { redirect } from "next/navigation";

import { createServerClientSSR } from "@/utils/supabase/server";

export async function SignOut() {
  const supabase = await createServerClientSSR();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }

  redirect("/logout");
}
