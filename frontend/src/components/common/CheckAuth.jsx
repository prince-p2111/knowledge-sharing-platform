import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ children, isAuthenticated }) => {
  const location = useLocation();

  const path = location.pathname;

  const isAuthPage = path.startsWith("/auth");

  // 1. If authenticated and trying to access login/signup → redirect to home
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // 2. If not authenticated and accessing protected pages
  const isProtected = path.startsWith("/articles/") && path !== "/articles"; // Exclude /articles list

  if (!isAuthenticated && isProtected) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default CheckAuth;
