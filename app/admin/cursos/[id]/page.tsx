import { createServerClientSSR } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CoursePlayer } from "./components/CoursePlay";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
};

export default async function AdminCoursePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { lesson: lessonId } = await searchParams;

  const supabase = await createServerClientSSR();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      "id, title, description, lessons(id, title, video_url, lesson_order, status)"
    )
    .eq("id", id)
    .single();

  if (error || !course) return notFound();

  const lessons = (course.lessons || []).sort(
    (a, b) => a.lesson_order - b.lesson_order
  );

  return (
    <div className="p-4 sm:p-8">
      <CoursePlayer
        courseTitle={course.title}
        description={course.description}
        lessons={lessons}
        initialLessonId={lessonId}
        isAdminView
      />
    </div>
  );
}
