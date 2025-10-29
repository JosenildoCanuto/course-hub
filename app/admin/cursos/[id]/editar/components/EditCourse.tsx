// components/EditCourse.tsx

import { CourseForm } from "../../../novo/components/CourseForm";

type Props = { course: any };

export default function EditCourse({ course }: Props) {
  return (
    <div className="flex h-svh items-center">
      <div className="flex flex-col gap-4 p-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-semibold">Editar curso</h1>
        <CourseForm course={course} />
      </div>
    </div>
  );
}
