import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { notify } from "@/lib/notifications";
import { resetPassword, validateResetToken } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});
type Values = z.infer<typeof schema>;

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [tokenState, setTokenState] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setTokenState("invalid");
      return;
    }
    validateResetToken(token)
      .then(() => {
        if (mounted) setTokenState("valid");
      })
      .catch(() => {
        if (mounted) setTokenState("invalid");
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password }: Values) => {
    if (!token) {
      notify.error("Reset link unavailable", "The reset token is missing or invalid.");
      return;
    }
    try {
      await resetPassword(token, password);
      notify.success("Password reset successfully", "You can now sign in with your new password.");
      window.setTimeout(() => navigate("/login"), 350);
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      notify.error("Password reset failed", message || "Unable to reset password.");
    }
  };

  if (tokenState !== "valid") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-2xl shadow-xl">
          <CardContent className="p-8 text-center">
            {tokenState === "checking" ? (
              <>
                <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <h1 className="text-2xl font-bold">Checking reset link</h1>
                <p className="mt-2 text-muted-foreground">Please wait while we verify this password-reset link.</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Lock className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Reset link expired or already used</h1>
                <p className="mt-3 text-muted-foreground">This password-reset link is no longer valid. Please request a new reset link.</p>
                <Button className="mt-6 w-full" type="button" onClick={() => navigate("/forgot-password")}>
                  Request a new reset link
                </Button>
              </>
            )}
            <Link to="/login" className="mt-5 block text-center text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="p-7">
          <h1 className="text-3xl font-bold">Choose a new password</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" className="pl-10" {...form.register("password")} />
              </div>
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword ? (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
          </form>
          <Link to="/login" className="mt-6 block text-center text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
