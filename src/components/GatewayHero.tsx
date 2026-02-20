"use client";

import { motion } from "framer-motion";
import { Globe, AlertTriangle, Shield } from "./icons";

interface GatewayHeroProps {
  hostname: string;
  contactEmail?: string;
}

export default function GatewayHero({ hostname, contactEmail }: GatewayHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-secondary/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-card-border bg-card/50 backdrop-blur-sm text-xs text-muted mb-8"
        >
          <Shield className="w-3.5 h-3.5" />
          Gateway Endpoint
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-foreground">Nothing to</span>
          <br />
          <span className="bg-gradient-to-r from-accent via-accent-secondary to-accent bg-clip-text text-transparent animate-gradient">
            see here.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          This is a gateway endpoint. The hostname you attempted to visit
          is resolving to this server, but there is no content configured
          for it.
        </motion.p>

        {/* Hostname card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 max-w-xl mx-auto"
        >
          <div className="rounded-xl border border-card-border bg-card/80 backdrop-blur-sm overflow-hidden glow-accent">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <span className="text-xs text-muted font-mono ml-2">
                request details
              </span>
            </div>
            <div className="p-6 font-mono text-sm text-left space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-accent shrink-0" />
                <span className="text-muted">Requested Host</span>
              </div>
              <div className="pl-7">
                <span className="text-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-card-border inline-block">
                  {hostname}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                <span className="text-muted">Status</span>
              </div>
              <div className="pl-7">
                <span className="text-warning/90 text-xs">
                  No service configured for this hostname
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact info */}
        {contactEmail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10"
          >
            <p className="text-sm text-muted">
              If you believe you are seeing this page in error, please contact
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
            >
              {contactEmail}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
