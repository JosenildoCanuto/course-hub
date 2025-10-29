"use client";

import { useEffect, useState } from "react";
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
import { Loading } from "@/components/Loading";

type valueForm = {
  type: "title" | "description" | "thumbnail";
  title: string;
  placeholder: string;
};

type Course = {
  id?: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "available" | "unavailable";
};

type CourseFormProps = {
  course?: Course;
};

const supabase = createClient();

const createSchema = (course?: Course) =>
  z.object({
    title: z
      .string()
      .min(3, "Título obrigatório")
      .refine(async (title) => {
        if (course?.id && title === course.title) {
          return true;
        }

        const { data } = await supabase
          .from("courses")
          .select("id")
          .eq("title", title)
          .single();
        return !data;
      }, "Já existe um curso com esse título"),
    description: z.string().min(10, "Descrição obrigatória"),
    thumbnail: z.string().url("URL inválida").optional().or(z.literal("")),
    status: z.enum(["available", "unavailable"]),
  });

export function CourseForm({ course }: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema(course)),
    defaultValues: {
      status: course?.status || "unavailable",
      title: course?.title || "",
      description: course?.description || "",
      thumbnail: course?.thumbnail || "",
    },
  });

  const isEditing = !!course?.id;

  const buttonText = loading
    ? "Salvando..."
    : isEditing
    ? "Atualizar curso"
    : "Criar curso";

  useEffect(() => {
    if (course) {
      setValue("title", course.title);
      setValue("description", course.description);
      setValue("thumbnail", course.thumbnail || "");
      setValue("status", course.status);
    }
  }, [course, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const submitData = {
        ...data,
        thumbnail: data.thumbnail || null,
      };

      if (course?.id) {
        const { error } = await supabase
          .from("courses")
          .update(submitData)
          .eq("id", course.id);

        if (error) throw error;

        toast.success(`Curso "${data.title}" atualizado com sucesso!`);
      } else {
        const { error } = await supabase.from("courses").insert({
          ...submitData,
          admin_id: user.id,
        });

        if (error) throw error;

        toast.success(`Curso "${data.title}" criado com sucesso!`);
      }

      router.push("/admin/cursos");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar curso");
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

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {values.map((value, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Label htmlFor={value.type}>{value.title}</Label>
          {value.type === "description" ? (
            <Textarea
              id={value.type}
              placeholder={value.placeholder}
              {...register(value.type)}
            />
          ) : (
            <Input
              id={value.type}
              placeholder={value.placeholder}
              {...register(value.type)}
            />
          )}
          {errors[value.type] && (
            <p className="text-red-500 text-sm">
              {errors[value.type]?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-4">
        <Label>Status</Label>
        <Select
          onValueChange={(value) => setValue("status", value)}
          defaultValue={course?.status || "unavailable"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="unavailable">Indisponível</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {buttonText}
      </Button>
    </form>
  );
}
