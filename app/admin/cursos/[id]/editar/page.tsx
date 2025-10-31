import { AuthGuard } from "@/utils/auth/AuthGuard";
import { Card } from "@/components/ui/card";
import { createServerClientSSR } from "@/utils/supabase/server";
import { CourseForm } from "../../novo/components/CourseForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createServerClientSSR();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) {
    return (
      <div className="flex items-center justify-center h-svh">
        <p className="text-muted-foreground">Curso não encontrado.</p>
      </div>
    );
  }

  return (
    <AuthGuard requireRole="admin">
      <div className="flex h-svh items-center">
        <Card className="flex flex-col gap-4 p-8 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl leading-none font-semibold">Editar curso</h1>
          <CourseForm course={course} />
        </Card>
      </div>
    </AuthGuard>
  );
}
