import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center pt-[25%]">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
        404
      </h1>
      <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400">
        Page not found
      </p>
      <Button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
    </div>
  );
}
