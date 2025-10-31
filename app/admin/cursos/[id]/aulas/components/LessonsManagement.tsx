"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePlus, Video } from "lucide-react";
import { LessonModal } from "./LessonModal";
import { LessonCard } from "./LessonCard";
import { Loading } from "@/app/admin/components/Loading";
import { useRouter } from "next/navigation";
import { Lesson, LessonsManagementProps } from "@/types/lessons";
import { CourseWithLessons } from "@/types/courses";


export function LessonsManagement({ initialData }: LessonsManagementProps) {
  const [courses, setCourses] = useState<CourseWithLessons[]>(initialData);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithLessons | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (loading) return <Loading />;

  const handleAddLesson = (course: CourseWithLessons) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setModalOpen(true);
  };

  const handleEditLesson = (lesson: Lesson, course: CourseWithLessons) => {
    setSelectedLesson(lesson);
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleDeleteSuccess = (deletedLessonId: string) => {
    setCourses((prev) =>
      prev.map((course) => ({
        ...course,
        lessons: course.lessons.filter(
          (lesson) => lesson.id !== deletedLessonId
        ),
      }))
    );
  };

  const handleSuccess = (lesson: Lesson) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === lesson.course_id) {
          const exist = course.lessons.find((l) => l.id === lesson.id);

          const updatedLessons = exist
            ? course.lessons.map((l) => (l.id === lesson.id ? lesson : l))
            : [...course.lessons, lesson];

          return { ...course, lessons: updatedLessons };
        }
        return course;
      })
    );

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <div key={course.id}>
          <div className="flex flex-row items-center justify-end">
            <Button onClick={() => handleAddLesson(course)}>
              <SquarePlus />
              Adicionar Aula
            </Button>
          </div>
          <div>
            {course.lessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma aula cadastrada para este curso</p>
              </div>
            ) : (
              <div className="flex w-full flex-wrap gap-2 lg:gap-4">
                {course.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    video_url={lesson.video_url}
                    lesson_order={lesson.lesson_order}
                    status={lesson.status}
                    onClick={() =>
                      router.push(
                        `/admin/cursos/${course.id}?lesson=${lesson.id}`
                      )
                    }
                    onEdit={() => handleEditLesson(lesson, course)}
                    onDelete={() => handleDeleteSuccess(lesson.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <LessonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        course={selectedCourse}
        lesson={selectedLesson}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
