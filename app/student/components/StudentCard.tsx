import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface StudentCourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
}

export function StudentCourseCard({ course }: StudentCourseCardProps) {
  return (
    <Card className="w-full max-w-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
      <CardHeader className="px-4">
        <div className="relative w-full h-40">
          <Image
            src={course.thumbnail || "/placeholder.jpg"}
            alt={course.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-primary line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Link href={`/student/curso/${course.id}`} className="w-full">
          <Button className="w-full">Acessar Curso</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
