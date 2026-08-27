import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { notify } from "@/lib/notifications";
import { forgotPassword } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type Values = z.infer<typeof schema>;

export default function ForgotPassword() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Values) => {
    try {
      await forgotPassword(values.email);
      notify.success("Reset link requested", "If that account exists, a reset link has been sent.");
    } catch {
      notify.error("Request failed", "Unable to process the request.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="p-7">
          <h1 className="text-3xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send a secure reset link when the account exists.
          </p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" {...form.register("email")} />
              </div>
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
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
