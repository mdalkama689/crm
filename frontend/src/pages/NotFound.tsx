import { useNavigate } from "react-router-dom"; 
import { Button } from "../components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800 px-4 text-center">
      <h1 className="text-[6rem] font-bold">404</h1>
      <p className="text-xl sm:text-2xl mt-4">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Button
        className="mt-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default NotFound
