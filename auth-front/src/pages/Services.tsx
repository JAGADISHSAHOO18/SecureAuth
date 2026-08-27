import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  KeyRound,
  MailCheck,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: KeyRound,
    title: "JWT session security",
    text: "Short-lived access tokens, refresh-token rotation, revocation, and automatic client refresh handling.",
  },
  {
    icon: ShieldCheck,
    title: "OAuth2 + local auth",
    text: "Use password authentication or connect external identity providers such as Google and GitHub.",
  },
  {
    icon: MailCheck,
    title: "Account recovery",
    text: "Email verification and password reset flows backed by expiring, single-purpose tokens.",
  },
  {
    icon: Smartphone,
    title: "Session management",
    text: "See active sessions, identify devices, and revoke sessions when you no longer trust them.",
  },
  {
    icon: ShieldAlert,
    title: "Abuse protection",
    text: "Input validation and layered rate limiting reduce brute-force and automated abuse risks.",
  },
  {
    icon: Activity,
    title: "Security visibility",
    text: "Audit events and account activity make security behavior easier to inspect and explain.",
  },
];

function Services() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground transition-colors duration-300">
      <section className="relative border-b border-border px-6 py-20 text-center md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.16),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What SecureAuth provides</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">Authentication, treated like a system.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Each capability supports a safer account lifecycle — from registration and verification to session control and recovery.
        </p>
      </section>

      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="group rounded-3xl border border-border bg-card/70 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-semibold">{service.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{service.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-accent/30 px-6 py-20 text-center md:py-24">
        <CheckCircle2 className="mx-auto h-9 w-9" />
        <h2 className="mt-5 text-4xl font-bold">Built to be explored.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
          Try the complete account lifecycle locally — including verification emails, password recovery, session controls, and audit history.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="rounded-2xl px-7" onClick={() => navigate("/signup")}>
            Create an account
          </Button>
          <Button size="lg" variant="outline" className="rounded-2xl px-7" onClick={() => navigate("/login")}>
            Sign in
          </Button>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-muted-foreground">
        Security features are surfaced in the dashboard so users can understand what is happening to their account.
      </footer>
    </main>
  );
}

export default Services;
