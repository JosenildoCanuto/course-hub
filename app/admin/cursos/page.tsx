import { getAdminCourses } from "@/lib/courses";
import { AuthGuard } from "@/utils/auth/AuthGuard";
import { createServerClientWithCookies } from "@/utils/supabase/server";
import { CourseCard } from "./components/CourseCard";
import { CourseActions } from "./components/CourseActions";

export default async function AdminCoursesPage() {
  const supabase = await createServerClientWithCookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Usuário não autenticado</p>;

  const courses = await getAdminCourses(user.id);

  return (
    <AuthGuard requireRole="admin">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl font-semibold text-primary mb-4">Meus Cursos</h1>
        <div className="flex w-full flex-wrap gap-2 lg:gap-4">
          {courses.map((course: any, i) => (
            <div key={i} className="w-full sm:w-[48%] lg:w-[25%]">
              <CourseCard
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail}
                status={course.status}
              />
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
