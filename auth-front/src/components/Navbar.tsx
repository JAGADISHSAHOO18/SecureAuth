import { Button } from "@/components/ui/button";
import useAuth from "@/auth/store";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
    "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-200",
    "hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:after:scale-x-100",
    "active:translate-y-0 active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    isActive
      ? "bg-accent text-accent-foreground shadow-sm after:scale-x-100"
      : "text-muted-foreground",
  ].join(" ");

export default function Navbar() {
  const user = useAuth((state) => state.user);
  const authLoading = useAuth((state) => state.authLoading);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const initials = (user?.name || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <NavLink
          to="/"
          className="group flex shrink-0 items-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="SecureAuth home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
            <ShieldCheck className="h-5 w-5 transition-transform duration-200 group-hover:rotate-3" />
          </span>
          <span>SecureAuth</span>
        </NavLink>

        {!authLoading && user ? (
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/profile" className={navLinkClass}>
                Profile
              </NavLink>
              {isAdmin ? (
                <NavLink to="/dashboard/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              ) : null}
            </div>

            <div className="ml-1 sm:ml-2">
              <ThemeToggle />
            </div>

            <NavLink
              to="/dashboard/profile"
              className="group hidden items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:flex"
              title="Open profile"
              aria-label="Open profile"
            >
              <Avatar className="size-8 ring-1 ring-border transition-transform duration-200 group-hover:scale-105">
                {user.image ? <AvatarImage src={user.image} alt={`${user.name} profile`} /> : null}
                <AvatarFallback className="text-xs font-semibold">{initials || "U"}</AvatarFallback>
              </Avatar>
              <span className="max-w-28 truncate text-sm font-medium text-muted-foreground">{user.name}</span>
            </NavLink>

            <Button
              size="sm"
              variant="outline"
              className="group ml-1 border-border/80 hover:border-foreground/25"
              onClick={() => {
                void logout().finally(() => navigate("/"));
              }}
              disabled={authLoading}
            >
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>
            </div>

            <div className="ml-1 sm:ml-2">
              <ThemeToggle />
            </div>

            <NavLink to="/login" className="ml-1 sm:ml-2">
              <Button size="sm" variant="outline" className="border-border/80 hover:border-foreground/25">
                Login
              </Button>
            </NavLink>
            <NavLink to="/signup">
              <Button size="sm">Sign up</Button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
