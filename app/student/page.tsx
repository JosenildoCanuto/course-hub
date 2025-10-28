import { AuthGuard } from "@/utils/auth/AuthGuard";

export default function StudentDashboard() {
  return (
    <AuthGuard requireRole="student">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Área do Aluno</h1>
      </div>
    </AuthGuard>
  );
}
