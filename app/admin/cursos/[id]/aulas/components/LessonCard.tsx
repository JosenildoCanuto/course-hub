"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, ListOrdered } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ConfirmDialog } from "../../../components/DialogConfirm";
import Image from "next/image";
import Link from "next/link";
import { CourseActions } from "../../../components/CourseActions";
import { SupabaseError } from "@/types/global";
import { LessonCardProps } from "@/types/lessons";

export function LessonCard({
  id,
  title,
  video_url,
  lesson_order,
  status,
  onEdit,
  onDelete,
  onClick,
}: LessonCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAvailable = status === "available";
  const supabase = createClient();

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      const { error } = await supabase.from("lessons").delete().eq("id", id);

      if (error) throw error;

      toast.success(`Aula "${title}" excluída com sucesso!`);

      setDeleteDialogOpen(false);

      onDelete();
    } catch (error: unknown) {
      const supabaseError = error as SupabaseError;
      toast.error(supabaseError.message || "Erro ao excluir aula");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : "/placeholder-video.jpg";
  };

  const thumbnailUrl = getYouTubeThumbnail(video_url);

  return (
    <>
      <Card
        onClick={onClick}
        className="w-full max-w-sm cursor-pointer transition-all hover:shadow-md"
      >
        <CardHeader className="px-4">
          <div className="relative w-full h-40">
            <Image
              src={thumbnailUrl || "/placeholder-image.jpg"}
              alt={`Thumbnail da aula: ${title}`}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ListOrdered className="w-4 h-4" />
                    <span className="text-xs font-mono">{lesson_order}</span>
                  </div>
                  <h3 className="font-semibold text-primary line-clamp-2">
                    {title}
                  </h3>
                </div>
                <CourseActions
                  onEdit={(e) => {
                    e?.stopPropagation?.();
                    onEdit();
                  }}
                  onDelete={(e) => {
                    e?.stopPropagation?.();
                    setDeleteDialogOpen(true);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                <Link href={video_url}>{video_url}</Link>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Badge
            variant={isAvailable ? "secondary" : "outline"}
            className={
              isAvailable ? "bg-blue-500 text-white dark:bg-blue-600" : ""
            }
          >
            {isAvailable ? "Disponível" : "Indisponível"}
          </Badge>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Excluir aula"
        description={`Tem certeza que deseja excluir a aula "${title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        loading={deleteLoading}
      />
    </>
  );
}
