// app/aluno/curso/[id]/page.tsx
import { createServerClientSSR } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/utils/auth/AuthGuard";
import { CoursePlayer } from "./components/CoursePlay";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CursoPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createServerClientSSR();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      "id, title, description, lessons(id, title, video_url, lesson_order, status)"
    )
    .eq("id", id)
    .eq("status", "available")
    .single();

  if (error || !course) return notFound();

  const lessons =
    course.lessons
      ?.filter((l) => l.status === "available")
      .sort((a, b) => a.lesson_order - b.lesson_order) || [];

  if (lessons.length === 0)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma aula disponível para este curso.
      </div>
    );

  return (
    <AuthGuard requireRole="student">
      <div className="p-4 sm:p-8">
        <CoursePlayer
          courseTitle={course.title}
          description={course.description}
          lessons={lessons}
        />
      </div>
    </AuthGuard>
  );
}
