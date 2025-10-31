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

type Course = {
  id?: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "available" | "unavailable";
};

type CourseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: (course: Course) => void;
};

const supabase = createClient();

export function CourseModal({
  open,
  onOpenChange,
  course,
  onSuccess,
}: CourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Course>({
    title: "",
    description: "",
    thumbnail: "",
    status: "available",
  });

  const isEditing = !!course?.id;

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail || "",
        status: course.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        status: "available",
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data, error;

      if (isEditing) {
        ({ data, error } = await supabase
          .from("courses")
          .update({
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnail,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", course!.id)
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from("courses")
          .insert({
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnail,
            status: formData.status,
          })
          .select()
          .single());
      }

      if (error) throw error;

      toast.success(
        `Curso "${data.title}" ${
          isEditing ? "atualizado" : "criado"
        } com sucesso!`
      );

      onSuccess(data);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar curso");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Course, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputs = [
    { id: "title", label: "Título", placeholder: "Ex: Introdução ao React" },
    {
      id: "description",
      label: "Descrição",
      placeholder: "Descrição do curso",
    },
    {
      id: "thumbnail",
      label: "Thumbnail (URL)",
      placeholder: "https://exemplo.com/imagem.jpg",
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Curso" : "Adicionar Novo Curso"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {inputs.map((input) => (
            <div key={input.id} className="flex flex-col gap-2">
              <Label htmlFor={input.id}>{input.label}</Label>
              <Input
                id={input.id}
                value={formData[input.id]}
                placeholder={input.placeholder}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                required={input.id !== "thumbnail"}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
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
                ? "Salvando..."
                : isEditing
                ? "Atualizar Curso"
                : "Criar Curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
