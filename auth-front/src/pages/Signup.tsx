import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { notify } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuth2Buttons from "@/components/OAuth2Buttons";
import { registerUser } from "@/services/AuthService";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type FormValues = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password });
      notify.success("Account created successfully", "Your account has been created.");
      window.setTimeout(() => navigate("/login"), 350);
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const message = (
          error as { response?: { data?: { message?: string } } }
        ).response?.data?.message;
        const visibleMessage = message || "Registration failed";
        setServerError(visibleMessage);
        const isDuplicate = /already exists|already registered|duplicate/i.test(visibleMessage);
        notify.error(
          isDuplicate ? "Account already exists" : "Registration failed",
          visibleMessage,
        );
      } else {
        setServerError("Registration failed. Please try again.");
        notify.error("Registration failed", "Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="rounded-2xl shadow-2xl">
          <CardContent className="p-7">
            <h1 className="text-center text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Secure authentication with modern security practices.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <Field label="Name" icon={<User className="h-4 w-4" />} error={form.formState.errors.name?.message}>
                <Input {...form.register("name")} className="pl-10" />
              </Field>
              <Field label="Email" icon={<Mail className="h-4 w-4" />} error={form.formState.errors.email?.message}>
                <Input type="email" {...form.register("email")} className="pl-10" />
              </Field>
              <Field label="Password" icon={<Lock className="h-4 w-4" />} error={form.formState.errors.password?.message}>
                <Input type="password" {...form.register("password")} className="pl-10" />
              </Field>
              <Field label="Confirm password" icon={<Lock className="h-4 w-4" />} error={form.formState.errors.confirmPassword?.message}>
                <Input type="password" {...form.register("confirmPassword")} className="pl-10" />
              </Field>

              {serverError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {serverError}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create account"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <OAuth2Buttons />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
