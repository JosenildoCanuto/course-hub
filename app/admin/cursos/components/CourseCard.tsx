"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlockIcon } from "@/components/ui/icons/akar-icons-block";
import { CircleCheck } from "lucide-react";
import { CourseActions } from "./CourseActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { ConfirmDialog } from "./DialogConfirm";
import { CourseModal } from "../[id]/editar/components/CourseModal";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "available" | "unavailable";
};

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  status,
}: CourseCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // 👈 controle do modal

  const isAvailable = status === "available";
  const router = useRouter();
  const supabase = createClient();

  const handleCardClick = () => {
    router.push(`/admin/cursos/${id}/aulas`);
  };

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setModalOpen(true); // 👈 abre o modal
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;

      toast.success(`Curso "${title}" excluído com sucesso!`);
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir curso");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCourseSuccess = () => {
    router.refresh(); // 👈 atualiza sem F5
  };

  return (
    <>
      <Card
        className="w-full max-w-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
        onClick={handleCardClick}
      >
        <CardHeader className="px-4">
          <div className="relative w-full h-40">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary line-clamp-1">
              {title}
            </h3>
            <CourseActions onEdit={handleEdit} onDelete={handleDelete} />
          </div>
          <p className="text-primary text-sm">{description}</p>
        </CardContent>
        <CardFooter>
          <Badge
            variant={isAvailable ? "secondary" : "outline"}
            className={
              isAvailable ? "bg-blue-500 text-white dark:bg-blue-600" : ""
            }
          >
            {isAvailable ? <CircleCheck /> : <BlockIcon />}
            {isAvailable ? "DISPONÍVEL" : "INDISPONÍVEL"}
          </Badge>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir curso"
        description={`Tem certeza que deseja excluir o curso "${title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        loading={deleteLoading}
      />

      <CourseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        course={{
          id,
          title,
          description,
          thumbnail,
          status,
        }}
        onSuccess={handleCourseSuccess}
      />
    </>
  );
}
