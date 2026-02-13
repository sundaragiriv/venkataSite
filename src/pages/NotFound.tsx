import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logger } from "../lib/logger";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.debug("404 Info: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="mb-4 text-4xl md:text-6xl font-bold text-primary">404</h1>
        <p className="mb-6 text-xl text-secondary">Oops! Page not found</p>
        <p className="mb-8 text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn-gradient inline-flex items-center justify-center gap-2"
          >
            Return to Home
          </Link>
          <Link 
            to="/signals" 
            className="btn-soft inline-flex items-center justify-center gap-2"
          >
            View Signals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
