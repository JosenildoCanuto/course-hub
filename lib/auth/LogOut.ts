"use server";
import { redirect } from "next/navigation";

import { createServerClientWithCookies } from "@/utils/supabase/server";

export async function SignOut() {
  const supabase = await createServerClientWithCookies();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}
