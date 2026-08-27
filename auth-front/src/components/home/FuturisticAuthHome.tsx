import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, KeyRound, Lock, Shield, ShieldCheck, Sparkles, ArrowDown, CheckCircle2, Gauge, Eye, Workflow } from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  {
    title: "JWT + Refresh Tokens",
    desc: "Short-lived access tokens with secure refresh-token rotation and revocation.",
    icon: <KeyRound className="h-10 w-10" />,
  },
  {
    title: "OAuth2 + Email Security",
    desc: "Google/GitHub OAuth2 plus email verification and secure password reset flows.",
    icon: <ShieldCheck className="h-10 w-10" />,
  },
  {
    title: "Session + Audit Controls",
    desc: "Manage active sessions, revoke devices, and review real authentication events.",
    icon: <ClipboardCheck className="h-10 w-10" />,
  },
];

export default function FuturisticAuthHome() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground transition-colors duration-300">
      <section className="relative flex min-h-[78vh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.18),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur"
        >
          <Shield className="h-4 w-4 text-primary" />
          Secure authentication for modern applications
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="max-w-5xl text-5xl font-bold tracking-tight md:text-7xl"
        >
          Secure. Fast. <span className="text-muted-foreground">Futuristic.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          A full-stack authentication platform built around secure JWT sessions,
          OAuth2, account protection, account recovery, and real security visibility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="rounded-2xl px-7 text-base"
            onClick={() => navigate("/signup")}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl px-7 text-base"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </motion.div>

        <motion.a
          href="#features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="group mt-14 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:bg-accent hover:text-foreground"
        >
          Explore the platform
          <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
        </motion.a>
      </section>

      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {[{ icon: ShieldCheck, label: "Secure sessions" }, { icon: Gauge, label: "Rate limiting" }, { icon: Eye, label: "Audit visibility" }, { icon: Workflow, label: "Account recovery" }].map(({ icon: Icon, label }) => (
            <div key={label} className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
              <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              {label}
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Security by design
            </p>
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="mt-4 text-muted-foreground">
              The important authentication primitives are visible, testable, and built into the product.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full rounded-2xl border-border bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-foreground transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-accent/40 px-6 py-24">
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
          <h2 className="mt-3 text-4xl font-bold">A clear path from sign-in to security.</h2>
          <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-4 md:gap-y-4">
            {["Authenticate", "Issue access token", "Rotate refresh token", "Monitor sessions"].map((step, index) => (
              <div key={step} className="group relative">
                <div className="rounded-2xl border border-border bg-card/70 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">{index + 1}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <p className="font-semibold transition-transform duration-300 group-hover:translate-x-0.5">{step}</p>
                </div>

                {index < 3 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-4 -translate-x-1/2 text-muted-foreground md:left-full md:top-1/2 md:mt-0 md:-translate-y-1/2 md:translate-x-0 md:ml-2.5"
                  >
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 md:block" />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Why SecureAuth</p>
            <h2 className="mt-3 text-4xl font-bold">Security that users can actually understand.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Track active sessions, rotate refresh tokens, recover accounts securely, and inspect recent security events without guessing what your system is doing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Input validation", "Rate limiting", "Session revocation", "Audit logging"].map((item) => (
              <div
                key={item}
                className="group rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 inline-flex rounded-xl bg-accent p-2 transition-transform duration-200 group-hover:scale-105">
                  <Lock className="h-5 w-5" />
                </div>
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {["Email verification", "Password reset", "Session revocation"].map((item) => (
            <div key={item} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/70 p-4 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <CheckCircle2 className="h-4 w-4" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <Sparkles className="mx-auto h-8 w-8" />
        <h2 className="mt-5 text-4xl font-bold">Start securing your application.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Create an account and explore the authentication and security controls.
        </p>
        <Button size="lg" className="mt-8 rounded-2xl px-8 text-base" onClick={() => navigate("/signup")}>
          Create Account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SecureAuth. Built with Spring Boot, React, and modern security practices.
      </footer>
    </main>
  );
}
