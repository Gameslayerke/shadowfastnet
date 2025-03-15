import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, logout } = useAuth();

  // Check token validity on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");

    if (!token || !expiry || new Date(expiry) <= new Date()) {
      logout(); // Clear invalid or expired token
    }
  }, [logout]);

  // If user is not authenticated, redirect to Sign In
  if (!user) {
    return <Navigate to="/SignIn" replace />;
  }

  // If role is required and user doesn't have the required role, redirect to unauthorized page
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
