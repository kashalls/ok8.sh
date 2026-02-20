"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GithubIcon } from "./icons";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-secondary/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-card-border bg-card/50 backdrop-blur-sm text-xs text-muted mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
          Cluster Online
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-foreground">Infrastructure,</span>
          <br />
          <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent bg-clip-text text-transparent animate-gradient">
            automated.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          A fully automated, GitOps-driven Kubernetes Homelab.
          <br className="hidden sm:block" />
          Powered by Talos Linux, Flux, and a passion for tinkering.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://docs.ok8.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
          >
            <BookOpen className="w-4 h-4" />
            Checkout Some Guides
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/waifulabs/infrastructure"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-card-border text-foreground font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            View Source
          </a>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="rounded-xl border border-card-border bg-card/80 backdrop-blur-sm overflow-hidden glow-accent">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="text-xs text-muted font-mono ml-2">
                ~ kubectl
              </span>
            </div>
            <div className="p-5 font-mono text-sm text-left space-y-1.5">
              <div>
                <span className="text-success">$</span>{" "}
                <span className="text-muted">kubectl get nodes</span>
              </div>
              <div className="text-foreground/70 text-xs leading-relaxed">
                <pre className="whitespace-pre-wrap">{`NAME       STATUS   ROLES           AGE    VERSION
fenrys     Ready    control-plane   110d   v1.35.1
maomao     Ready    control-plane   110d   v1.35.1
nyanners   Ready    worker          69d    v1.35.1
shylily    Ready    control-plane   110d   v1.35.1`}</pre>
              </div>
              <div className="mt-3">
                <span className="text-success">$</span>{" "}
                <span className="text-muted">flux get kustomizations</span>
              </div>
              <div className="text-foreground/70 text-xs leading-relaxed">
                <pre className="whitespace-pre-wrap">{`NAME             REVISION    READY
cluster-apps     main@sha1   True
home-kubernetes  main@sha1   True`}</pre>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <span className="text-success">$</span>{" "}
                <span className="w-2 h-4 bg-accent/70 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
