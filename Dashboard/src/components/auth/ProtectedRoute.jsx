import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000);
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

  if ((error || timeoutReached) && !isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname }, // 🔑 save current route
    });
    return null;
  }

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect({
      appState: { returnTo: location.pathname }, // 🔑 save current route
    });
    return null;
  }

  return children;
};

export default ProtectedRoute;
