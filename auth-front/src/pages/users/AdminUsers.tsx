import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import useAuth from "@/auth/store";
import type User from "@/models/User";
import { getAdminUsers } from "@/services/AuthService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsers() {
  const user = useAuth((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.roles.includes("ROLE_ADMIN")) {
      setLoading(false);
      return;
    }
    void getAdminUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">User administration</h1>
      <Card className="mt-6">
        <CardHeader><CardTitle>Registered users</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Verified</th>
                    <th className="p-3">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.provider}</td>
                      <td className="p-3">{item.emailVerified ? "Yes" : "No"}</td>
                      <td className="p-3">{item.roles.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
