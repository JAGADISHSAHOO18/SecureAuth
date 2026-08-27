import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { notify } from "@/lib/notifications";
import { useNavigate } from "react-router";
import useAuth from "@/auth/store";
import { changePassword, deleteAccount, updateProfile } from "@/services/AuthService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  image: z.string().url("Enter a valid image URL").or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function Userprofile() {
  const user = useAuth((state) => state.user);
  const setSession = useAuth((state) => state.setSession);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const initials = (user?.name || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const profile = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      image: user?.image || "",
    },
  });

  const imageUrl = profile.watch("image");

  const password = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const saveProfile = async (values: ProfileValues) => {
    try {
      const updated = await updateProfile(values);
      const token = useAuth.getState().accessToken;
      if (token) setSession(token, updated);
      notify.success("Profile updated", "Your profile changes were saved.");
    } catch {
      notify.error("Profile update failed", "Could not update profile.");
    }
  };

  const savePassword = async (values: PasswordValues) => {
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      password.reset();
      notify.success("Password changed", "Existing sessions were revoked for security.");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      notify.error("Password change failed", message || "Could not change password.");
    }
  };

  const removeAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      await logout();
      navigate("/", { replace: true });
      notify.success("Account deleted", "Your account and stored sessions were removed.");
    } catch {
      notify.error("Account deletion failed", "Could not delete account.");
    }
  };

  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Profile & security</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={profile.handleSubmit(saveProfile)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...profile.register("name")} />
                {profile.formState.errors.name ? (
                  <p className="text-sm text-destructive">{profile.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly />
              </div>
              <div className="space-y-3">
                <Label htmlFor="image">Profile image URL (optional)</Label>
                <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                  <Avatar className="size-16 ring-2 ring-border shadow-sm">
                    {imageUrl ? <AvatarImage src={imageUrl} alt={`${user.name} profile`} /> : null}
                    <AvatarFallback className="text-base font-semibold">{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Profile preview</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Paste a direct public image URL ending in .jpg, .png, .webp, or another image format.
                    </p>
                  </div>
                </div>
                <Input id="image" placeholder="https://example.com/profile.jpg" {...profile.register("image")} />
                {profile.formState.errors.image ? (
                  <p className="text-sm text-destructive">{profile.formState.errors.image.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Tip: upload your photo to an image host or use a GitHub raw image URL, then paste the direct image link here.
                  </p>
                )}
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <span>Provider: {user.provider}</span>
                <span>Verified: {user.emailVerified ? "Yes" : "No"}</span>
              </div>
              <Button type="submit" disabled={profile.formState.isSubmitting}>
                {profile.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
          <CardContent>
            {user.provider !== "LOCAL" ? (
              <p className="text-sm text-muted-foreground">
                This account uses {user.provider.toLowerCase()} authentication. Password changes are available after creating a local password through the reset-password flow.
              </p>
            ) : null}
            <form onSubmit={password.handleSubmit(savePassword)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" disabled={user.provider !== "LOCAL"} {...password.register("currentPassword")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" disabled={user.provider !== "LOCAL"} {...password.register("newPassword")} />
                {password.formState.errors.newPassword ? (
                  <p className="text-sm text-destructive">{password.formState.errors.newPassword.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" disabled={user.provider !== "LOCAL"} {...password.register("confirmPassword")} />
                {password.formState.errors.confirmPassword ? (
                  <p className="text-sm text-destructive">{password.formState.errors.confirmPassword.message}</p>
                ) : null}
              </div>
              <Button type="submit" disabled={password.formState.isSubmitting || user.provider !== "LOCAL"}>
                {password.formState.isSubmitting ? "Changing..." : "Change password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-destructive/40">
        <CardHeader><CardTitle className="text-destructive">Danger zone</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Permanently delete this account and revoke its stored sessions.
          </p>
          <Button variant="destructive" className="mt-4" onClick={removeAccount}>
            Delete account
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
