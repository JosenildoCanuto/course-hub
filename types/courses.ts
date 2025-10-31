import { Lesson } from "./lessons";

export type Course = {
  id?: string;
  admin_id?: string;
  title: string;
  description: string;
  status: "available" | "unavailable";
  thumbnail: string;
  created_at?: string;
  updated_at?: string;
};

export type CourseWithLessons = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type CoursePlayerProps = {
  courseTitle: string;
  description: string;
  lessons: Lesson[];
  initialLessonId?: string;
  isAdminView?: boolean;
  course?: CourseWithLessons;
};

export type CourseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: (course: Course) => void;
};

export type CoursePreview = {
  title: string;
  description: string;
  thumbnail?: string;
  status: "available" | "unavailable";
};
