// app/admin/cursos/components/CourseForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type valueForm = {
  type: "title" | "description" | "thumbnail";
  title: string;
  placeholder: string;
};

const supabase = createClient();

const schema = z.object({
  title: z
    .string()
    .min(3, "Título obrigatório")
    .refine(async (title) => {
      const { data } = await supabase
        .from("courses")
        .select("id")
        .eq("title", title)
        .single();
      return !data;
    }, "Já existe um curso com esse título"),
  description: z.string().min(10, "Descrição obrigatória"),
  thumbnail: z.string().url("URL inválida").optional(),
  status: z.enum(["available", "unavailable"]),
});

export function CourseForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "unavailable" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("courses").insert({
        ...data,
        admin_id: user.id,
      });

      if (error) throw error;

      toast.success(`Curso "${data.title}" criado com sucesso!`);

      router.push("/admin/cursos");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar curso");
    } finally {
      setLoading(false);
    }
  };

  const values: valueForm[] = [
    { type: "title", title: "Título", placeholder: "Ex: Introdução ao React" },
    {
      type: "description",
      title: "Descrição",
      placeholder: "Descreva o conteúdo do curso...",
    },
    {
      type: "thumbnail",
      title: "Thumbnail (URL)",
      placeholder: "https://exemplo.com/imagem.jpg",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {values.map((value, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Label htmlFor="title">{value.title}</Label>
          <Input
            id={value.type}
            placeholder={value.placeholder}
            {...register(value.type)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-4">
        <Label>Status</Label>
        <Select
          onValueChange={(value) => setValue("status", value)}
          defaultValue="unavailable"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="unavailable">Indisponível</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Criar curso"}
      </Button>
    </form>
  );
}
