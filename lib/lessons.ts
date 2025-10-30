import { createServerClientWithCookies } from "@/utils/supabase/server";

export async function getLessonsCourses(adminId: string) {
  const supabase = await createServerClientWithCookies();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("admin_id", adminId);

  if (coursesError) throw new Error(coursesError.message);
  if (!courses?.length) return [];

  const courseIds = courses.map((c) => c.id);

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .in("course_id", courseIds)
    .order("lesson_order", { ascending: true });

  if (lessonsError) {
    throw new Error(lessonsError.message);
  }

  return courses.map((course) => ({
    ...course,
    lessons: lessons.filter((lesson) => lesson.course_id === course.id),
  }));
}
