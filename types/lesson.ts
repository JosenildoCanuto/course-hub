export type Lesson = {
  id: string;
  title: string;
  video_url: string;
  lesson_order: number;
  status: "available" | "unavailable";
  course_id?: string;
  created_at?: string;
};
