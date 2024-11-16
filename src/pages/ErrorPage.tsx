import { Button } from "@/components/ui/button";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="animate-bounce mb-8">
        <span className="text-6xl">🎨</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Error Occurred!!
      </h1>

      <p className="text-lg md:text-xl text-slate-700 mb-4 max-w-md">
        {error?.message || "Looks like we've lost our artistic direction here!"}
      </p>

      <Button onClick={() => navigate("/arts")}>Return to Gallery</Button>
    </div>
  );
};

export default ErrorPage;
