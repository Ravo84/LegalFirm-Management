import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly = ({ children }: AdminOnlyProps) => {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminOnly;

