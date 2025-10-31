import { createServerClientSSR } from "@/utils/supabase/server";
import { AuthGuard } from "@/utils/auth/AuthGuard";
import { StudentCourseCard } from "./components/StudentCard";

export default async function AlunoCursosPage() {
  const supabase = await createServerClientSSR();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <p>Usuário não autenticado</p>;

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, description, thumbnail")
    .eq("status", "available");

  if (error) throw new Error(error.message);

  return (
    <AuthGuard requireRole="student">
      <div className="flex flex-col gap-6 p-4 sm:p-8">
        <h1 className="text-2xl font-semibold">Catálogo de Cursos</h1>

        {courses && courses.length > 0 ? (
          <div className="flex w-full flex-wrap gap-2 lg:gap-4">
            {courses.map((course) => (
              <StudentCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Nenhum curso disponível no momento.
          </p>
        )}
      </div>
    </AuthGuard>
  );
}
