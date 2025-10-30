// app/error/page.tsx
import { Suspense } from "react";
import { ErrorContent } from "./components/ErrorContent";

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">
            Carregando Detalhes do Erro...
          </h1>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
