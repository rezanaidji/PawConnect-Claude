import { Navigate, Outlet } from "react-router-dom";
import { useSession, UserRole } from "../context/SessionContext";

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { session, role } = useSession();

  if (!session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
