import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg transition-colors duration-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-dark-text">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 dark:text-pastel-yellow hover:text-blue-700 dark:hover:text-yellow-300 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
