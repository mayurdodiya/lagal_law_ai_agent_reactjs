import { useAuth } from "@/contexts/AuthContext.tsx";
import { Navigate, Outlet } from "react-router-dom";

type RoleType = "user" | "admin" | "support_team"

type Props = {
  allowedRoles: RoleType[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  
  // if (loading || !user) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/auth" replace />;
  
  const userRole = user?.userProfileInfo?.role as RoleType | null;
  
  // If role is not available yet, don't render anything (wait for it)
  if (!userRole) return <div>Loading...</div>;
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
