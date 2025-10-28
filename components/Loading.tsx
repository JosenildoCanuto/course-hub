import { Spinner } from "./ui/spinner";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4">
      <Spinner />
    </div>
  );
};
