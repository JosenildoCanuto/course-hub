"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Lesson } from "@/types/lesson";

type CourseWithLessons = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type LessonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseWithLessons | null;
  lesson?: Lesson | null;
  onSuccess: (lesson: Lesson) => void;
};

export function LessonModal({
  open,
  onOpenChange,
  course,
  lesson,
  onSuccess,
}: LessonModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    lesson_order: 1,
    status: "available" as "available" | "unavailable",
  });

  const supabase = createClient();

  const isEditing = !!lesson;

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        video_url: lesson.video_url,
        lesson_order: lesson.lesson_order,
        status: lesson.status,
      });
    } else {
      setFormData({
        title: "",
        video_url: "",
        lesson_order: (course?.lessons.length || 0) + 1,
        status: "available",
      });
    }
  }, [lesson, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      setLoading(true);

      if (isEditing && lesson) {
        const { data, error } = await supabase
          .from("lessons")
          .update({
            title: formData.title,
            video_url: formData.video_url,
            lesson_order: formData.lesson_order,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", lesson.id)
          .select()
          .single();

        if (error) throw error;

        toast.success("Aula atualizada com sucesso!");
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from("lessons")
          .insert({
            title: formData.title,
            video_url: formData.video_url,
            lesson_order: formData.lesson_order,
            status: formData.status,
            course_id: course.id,
          })
          .select()
          .single();

        if (error) throw error;

        toast.success("Aula criada com sucesso!");
        onSuccess(data);
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.message || `Erro ao ${isEditing ? "atualizar" : "criar"} aula`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dados = [
    {
      id: "title",
      label: "Título da Aula *",
      placeholder: "Ex: Introdução ao React Hooks",
      type: "text",
    },
    {
      id: "video_url",
      label: "URL do Vídeo do YouTube *",
      placeholder: "Ex: https://www.youtube.com/watch?v=...",
      type: "url",
    },
    {
      id: "lesson_order",
      label: "Ordem *",
      type: "number",
      min: "1",
      placeholder: "1",
    },
  ];

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar" : "Adicionar"} Aula - {course.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {dados.map((value, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Label htmlFor={value.id}>{value.label}</Label>
              <Input
                id={value.id}
                type={value.type}
                min={value.min}
                value={formData[value.id as keyof typeof formData]}
                placeholder={value.placeholder}
                onChange={(e) => {
                  if (value.type === "number") {
                    handleInputChange(value.id, parseInt(e.target.value) || 1);
                  } else {
                    handleInputChange(value.id, e.target.value);
                  }
                }}
                required
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <Label>Status da Aula</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "available" | "unavailable") =>
                handleInputChange("status", value)
              }
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Atualizando..."
                  : "Criando..."
                : isEditing
                ? "Atualizar Aula"
                : "Criar Aula"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
