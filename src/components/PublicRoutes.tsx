// src/components/PublicRoute.tsx
import { useAuth } from "@/contexts/AuthContext.tsx";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If already authenticated, redirect to dashboard
  if (user) return <Navigate to="/dashboard" />;

  return <Outlet />;
};

export default PublicRoute;
