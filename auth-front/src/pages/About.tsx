import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Github,
  Layers3,
  LockKeyhole,
  Mail,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: LockKeyhole,
    title: "Secure by design",
    text: "JWT access tokens, refresh-token rotation, revocation, BCrypt hashing, validation, and layered rate limiting.",
  },
  {
    icon: Layers3,
    title: "Built in layers",
    text: "A React + Spring Boot architecture that keeps UI, API, security, persistence, and infrastructure concerns separated.",
  },
  {
    icon: ShieldCheck,
    title: "Visible security",
    text: "Users can inspect active sessions and recent authentication events instead of treating security as a black box.",
  },
];

const stack = [
  { icon: Code2, label: "React + TypeScript" },
  { icon: Server, label: "Spring Boot + Security" },
  { icon: Database, label: "MySQL + JPA" },
  { icon: Mail, label: "Mailpit + Email flows" },
];

function About() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground transition-colors duration-300">
      <section className="relative border-b border-border px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(120,120,120,0.16),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(120,120,120,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Built for modern authentication
            </div>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
              Security should feel <span className="text-muted-foreground">simple.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              SecureAuth is a full-stack authentication platform focused on secure sessions, account recovery,
              session control, and security visibility — packaged as a real application instead of a collection of demos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl px-7" onClick={() => navigate("/signup")}>
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl px-7" onClick={() => navigate("/services")}>
                Explore features
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">SecureAuth architecture</p>
                <p className="text-sm text-muted-foreground">Security-first application flow</p>
              </div>
            </div>
            <div className="space-y-3">
              {["Authenticate", "Issue short-lived access token", "Rotate refresh token securely", "Track sessions + audit events"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Why it exists</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">More than a login screen.</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              SecureAuth treats authentication as a system: identity, tokens, sessions, recovery, abuse protection,
              and observability all work together.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group rounded-3xl border border-border bg-card/70 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-semibold">{pillar.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{pillar.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-accent/30 px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Technology</p>
            <h2 className="mt-3 text-4xl font-bold">A practical modern stack.</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              The project combines a typed React frontend with Spring Security and a relational database, then adds
              Docker, testing, documentation, and local email tooling around the core application.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stack.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="rounded-xl bg-accent p-3 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center md:py-24">
        <CheckCircle2 className="mx-auto h-9 w-9" />
        <h2 className="mt-5 text-4xl font-bold">Ready to see it in action?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
          Create an account, verify your email, and explore the dashboard, session controls, recovery flows, and audit trail.
        </p>
        <Button size="lg" className="mt-8 rounded-2xl px-8" onClick={() => navigate("/signup")}>
          Get started
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Github className="h-4 w-4" />
          Full-stack authentication project
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SecureAuth. Built with React, Spring Boot, and modern security practices.
      </footer>
    </main>
  );
}

export default About;
