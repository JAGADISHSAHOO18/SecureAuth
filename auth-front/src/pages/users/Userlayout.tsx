import useAuth from "@/auth/store";
import { Navigate, Outlet } from "react-router";

export default function Userlayout() {
  const user = useAuth((state) => state.user);
  const authLoading = useAuth((state) => state.authLoading);

  if (authLoading) {
    return <div className="p-10 text-center text-muted-foreground">Checking your session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
