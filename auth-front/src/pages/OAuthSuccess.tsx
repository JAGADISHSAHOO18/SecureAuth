import useAuth from "@/auth/store";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef } from "react";
import { notify } from "@/lib/notifications";
import { useNavigate } from "react-router";

export default function OAuthSuccess() {
  const hydrate = useAuth((state) => state.hydrate);
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void hydrate().then((ok) => {
      if (ok) {
        notify.success("Signed in successfully", "Your OAuth session is ready.");
        window.setTimeout(() => navigate("/dashboard", { replace: true }), 350);
      } else {
        notify.error("OAuth sign-in failed", "Please try again.");
        window.setTimeout(() => navigate("/login", { replace: true }), 350);
      }
    });
  }, [hydrate, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Spinner />
      <p className="text-muted-foreground">Completing sign-in...</p>
    </div>
  );
}
