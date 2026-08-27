import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { notify } from "@/lib/notifications";
import { verifyEmail } from "@/services/AuthService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const token = params.get("token") || "";
  const verifiedOnce = useRef(false);

  useEffect(() => {
    if (verifiedOnce.current) return;
    verifiedOnce.current = true;
    if (!token) {
      setStatus("error");
      return;
    }

    void verifyEmail(token)
      .then(() => {
        setStatus("success");
        notify.success("Email verified", "Your account is ready to use.");
      })
      .catch(() => {
        setStatus("error");
        notify.error("Verification failed", "The link is invalid, expired, or already used.");
      });
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {status === "loading" ? <p>Verifying your email...</p> : null}
          {status === "success" ? (
            <>
              <h1 className="text-2xl font-bold">Email verified</h1>
              <p className="mt-2 text-muted-foreground">Your account is ready to use.</p>
              <Link to="/login">
                <Button className="mt-6">Continue to login</Button>
              </Link>
            </>
          ) : null}
          {status === "error" ? (
            <>
              <h1 className="text-2xl font-bold">Verification failed</h1>
              <p className="mt-2 text-muted-foreground">The link may have expired or already been used.</p>
              <Link to="/login">
                <Button className="mt-6" variant="outline">Back to login</Button>
              </Link>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
