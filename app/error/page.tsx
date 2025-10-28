"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();

  const errorMessage = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Ocorreu um Erro!</h1>
      {errorMessage ? (
        <p className="text-lg">
          Detalhes: **{decodeURIComponent(errorMessage)}**
        </p>
      ) : (
        <p>Tente novamente mais tarde.</p>
      )}
    </div>
  );
}
