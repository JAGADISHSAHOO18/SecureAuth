import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/auth/store";
import { getAuditLog, getSessions, revokeSession } from "@/services/AuthService";
import type AuditLog from "@/models/AuditLog";
import type Session from "@/models/Session";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, Monitor, Clock3, Activity } from "lucide-react";
import { Link } from "react-router";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function Userhome() {
  const user = useAuth((state) => state.user);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionData, auditData] = await Promise.all([getSessions(), getAuditLog()]);
      setSessions(sessionData);
      setAudit(auditData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const securityScore = useMemo(() => {
    let score = 70;
    if (user?.emailVerified) score += 10;
    if (user?.provider !== "LOCAL") score += 10;
    if (sessions.length <= 3) score += 5;
    if (audit.some((item) => item.event === "PASSWORD_CHANGED")) score += 5;
    return Math.min(score, 100);
  }, [audit, sessions.length, user]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Security dashboard</p>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Security score" value={`${securityScore}%`} icon={<ShieldCheck />} />
        <Stat title="Active sessions" value={String(sessions.length)} icon={<Monitor />} />
        <Stat title="Last account event" value={audit[0]?.event ?? "None"} icon={<Activity />} />
        <Stat title="Account created" value={formatDate(user?.createdAt)} icon={<Clock3 />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active sessions</CardTitle>
            <Link to="/dashboard/profile" className="text-sm text-primary hover:underline">Manage</Link>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground">Loading...</p> : sessions.length === 0 ? (
              <p className="text-muted-foreground">No active sessions.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">
                          {session.current ? "Current session" : "Session"}
                        </p>
                        <p className="text-xs text-muted-foreground">{session.userAgent || "Unknown device"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {session.ipAddress || "Unknown IP"} · Created {formatDate(session.createdAt)}
                        </p>
                      </div>
                      {!session.current ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            void revokeSession(session.id).then(load);
                          }}
                        >
                          Revoke
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent security activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground">Loading...</p> : audit.length === 0 ? (
              <p className="text-muted-foreground">No recent security activity.</p>
            ) : (
              <div className="space-y-3">
                {audit.map((item) => (
                  <div key={item.id} className="border-b pb-3 last:border-0">
                    <p className="font-medium">{item.event.replaceAll("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">{item.details}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <span className="text-primary">{icon}</span>
        </div>
        <p className="mt-3 break-words text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
