// components/admin/CourseCard.tsx
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BlockIcon } from "@/components/ui/icons/akar-icons-block";
import { CircleCheck } from "lucide-react";
import { CourseActions } from "./CourseActions";

type CourseCardProps = {
  title: string;
  description: string;
  thumbnail: string;
  status: "available" | "unavailable";
};

export function CourseCard({ title, description, thumbnail, status }: CourseCardProps) {
  const isAvailable = status === "available";

  return (
    <Card className="w-full max-w-sm">
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
          <CourseActions />
        </div>
        <p className=" text-primary text-sm">{description}</p>
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
  );
}
