import { CourseWithLessons } from "./courses";

export type Lesson = {
  id: string;
  title: string;
  video_url: string;
  lesson_order: number;
  status: "available" | "unavailable";
  course_id?: string;
  created_at?: string;
};

export type LessonCardProps = {
  id: string;
  title: string;
  video_url: string;
  lesson_order: number;
  status: "available" | "unavailable";
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
};

export type LessonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseWithLessons | null;
  lesson?: Lesson | null;
  onSuccess: (lesson: Lesson) => void;
};

export type LessonsManagementProps = {
  initialData: CourseWithLessons[];
};
