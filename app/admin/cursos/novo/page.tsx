import { AuthGuard } from "@/utils/auth/AuthGuard";
import { CourseForm } from "./components/CourseForm";
import { Card } from "@/components/ui/card";

export default function NewCoursePage() {
  return (
    <AuthGuard requireRole="admin">
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-2xl p-8 flex flex-col gap-4">
          <h1 className="text-2xl leading-none font-semibold">
            Criar novo curso
          </h1>
          <CourseForm />
        </Card>
      </div>
    </AuthGuard>
  );
}
