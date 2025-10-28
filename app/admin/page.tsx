import LoginButton from "@/components/LoginLogoutButton";
import { AuthGuard } from "@/utils/auth/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard requireRole="admin">
      <div className="p-6">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <LoginButton />
        </div>
        <h1 className="text-2xl font-bold">Painel do Admin</h1>
      </div>
    </AuthGuard>
  );
}
