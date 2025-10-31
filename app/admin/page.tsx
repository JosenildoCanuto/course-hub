import { getAdminCourses } from "@/lib/courses";
import { AuthGuard } from "@/utils/auth/AuthGuard";
import { createServerClientSSR } from "@/utils/supabase/server";
import { CourseCard } from "./cursos/components/CourseCard";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/courses";

export default async function AdminCoursesPage() {
  const supabase = await createServerClientSSR();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Usuário não autenticado</p>;

  const courses = await getAdminCourses(user.id);

  return (
    <AuthGuard requireRole="admin">
      <div className="flex flex-col gap-6 p-4 sm:p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl leading-none font-semibold">Meus Cursos</h1>
          <Link href="admin/cursos/novo">
            <Button>
              <SquarePlus />
              Criar curso
            </Button>
          </Link>
        </div>
        <div className="flex w-full flex-wrap gap-2 lg:gap-4">
          {courses.map((course: Course) => (
            <CourseCard
              key={course.id}
              id={course.id as string}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              status={course.status}
            />
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
