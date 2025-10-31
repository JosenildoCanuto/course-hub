"use client";

import { BoxLesson } from "@/app/student/curso/[id]/components/BoxLesson";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { LessonModal } from "../aulas/components/LessonModal";
import { CoursePlayerProps } from "@/types/courses";
import { Lesson } from "@/types/lessons";

export function CoursePlayer({
  courseTitle,
  description,
  lessons,
  initialLessonId,
  isAdminView = false,
}: CoursePlayerProps) {
  const initialLesson =
    lessons.find((l) => l.id === initialLessonId) || lessons[0];

  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const [lessonList, setLessonList] = useState(lessons);

  const getVideoId = (url: string) => {
    try {
      const id = new URL(url).searchParams.get("v");
      return id || url.split("/").pop() || "";
    } catch {
      return "";
    }
  };

  const videoId = getVideoId(currentLesson.video_url);
  const sortedLessons = [...lessonList].sort(
    (a, b) => a.lesson_order - b.lesson_order
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="flex-1 border rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={currentLesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {currentLesson.lesson_order}. {currentLesson.title}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>

            {isAdminView && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Admin Preview
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <aside className="w-full flex flex-col gap-4 lg:w-1/3 border rounded-xl h-fit lg:h-[80vh] p-4 bg-card">
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">{courseTitle}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm text-muted-foreground">Aulas</h3>
            <span className="text-xs text-muted-foreground">
              {sortedLessons.length} aulas
            </span>
          </div>

          <ScrollArea className="h-[60vh] pr-2">
            <div className="space-y-2">
              {sortedLessons.map((lesson) => (
                <BoxLesson
                  key={lesson.id}
                  order={lesson.lesson_order}
                  title={lesson.title}
                  onClick={() => setCurrentLesson(lesson)}
                  isActive={currentLesson.id === lesson.id}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
