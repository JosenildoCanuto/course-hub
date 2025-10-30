import { Spinner } from "./ui/spinner";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Spinner />
    </div>
  );
};
