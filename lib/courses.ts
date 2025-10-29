import { createServerClientWithCookies } from "@/utils/supabase/server";

export async function getAdminCourses(adminId: string) {
  const supabase = await createServerClientWithCookies();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}