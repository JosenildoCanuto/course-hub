// app/admin/aulas/page.tsx
import { AuthGuard } from "@/utils/auth/AuthGuard";
import { createServerClientWithCookies } from "@/utils/supabase/server";
import { getLessonsCourses } from "@/lib/lessons";
import { LessonsManagement } from "./components/LessonsManagement";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CourseLessonsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerClientWithCookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("id", id)
    .single();

  if (!course) {
    return (
      <div className="flex items-center justify-center h-svh">
        <p className="text-muted-foreground">Curso não encontrado.</p>
      </div>
    );
  }

  const coursesWithLessons = await getLessonsCourses(user.id);

  const currentCourse = coursesWithLessons.find((c) => c.id === id);

  const lessonsCount = currentCourse?.lessons?.length || 0;

  return (
    <AuthGuard requireRole="admin">
      <div className="container mx-auto py-6 px-6">
        <div className="flex flex-col gap-2">
          {/* <Link href="/admin/cursos">
            <Button variant="outline" size="icon" className="border-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link> */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold">Gerenciar Aulas</h1>
                <p className="text-muted-foreground">{course.title}</p>
                <Badge variant="secondary">
                  {lessonsCount} aula
                  {lessonsCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </div>

          {currentCourse ? (
            <LessonsManagement initialData={[currentCourse]} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma aula encontrada para este curso.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
