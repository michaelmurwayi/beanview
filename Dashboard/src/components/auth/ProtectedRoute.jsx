import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Safety: prevent infinite "Loading..."
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10s fallback
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && !timeoutReached) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Checking authentication...</span>
      </div>
    );
  }

  if (error || timeoutReached) {
    loginWithRedirect();
    return null;
  }

  // 🔑 If not authenticated, kick off Auth0 login
  if (!isAuthenticated && !isLoading) {
    loginWithRedirect();
    return null; // prevent rendering until redirect happens
  }

  return children;
};

export default ProtectedRoute;
