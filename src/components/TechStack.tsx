"use client";

import { motion } from "framer-motion";

const stack = [
  {
    category: "Operating System",
    items: [
      { name: "Talos Linux", description: "Immutable Kubernetes OS", href: "https://www.talos.dev/" },
    ],
  },
  {
    category: "Orchestration",
    items: [
      { name: "Kubernetes", description: "Container orchestration", href: "https://kubernetes.io/" },
      { name: "Flux", description: "GitOps continuous delivery", href: "https://fluxcd.io/" },
    ],
  },
  {
    category: "Networking",
    items: [
      { name: "Cilium", description: "eBPF-based CNI", href: "https://cilium.io/" },
      { name: "Cloudflare Tunnels", description: "Secure ingress", href: "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/" },
      { name: "ExternalDNS", description: "Automated DNS records", href: "https://github.com/kubernetes-sigs/external-dns" },
    ],
  },
  {
    category: "Storage",
    items: [
      { name: "Rook-Ceph", description: "Distributed block storage", href: "https://rook.io/" },
      { name: "Volsync", description: "PVC replication & backup", href: "https://volsync.readthedocs.io/" },
    ],
  },
  {
    category: "Observability",
    items: [
      { name: "Prometheus", description: "Metrics collection", href: "https://prometheus.io/" },
      { name: "Grafana", description: "Dashboards & visualization", href: "https://grafana.com/" },
      { name: "Kromgo", description: "Prometheus badge API", href: "https://github.com/kashalls/kromgo" },
    ],
  },
  {
    category: "Security",
    items: [
      { name: "External Secrets", description: "Sync secrets from external providers", href: "https://external-secrets.io/" },
      { name: "1Password", description: "Secrets management backend", href: "https://developer.1password.com/docs/connect/" },
      { name: "Cert-Manager", description: "Automated TLS certificates", href: "https://cert-manager.io/" },
    ],
  },
];

export default function TechStack() {
  return (
    <section className="relative py-32 px-6">
      <div className="glow-line max-w-md mx-auto mb-32 opacity-40" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Built Sustainably
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            Open source tools stitched together with care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: gi * 0.08, duration: 0.4 }}
              className="rounded-xl border border-card-border bg-card/30 backdrop-blur-sm p-6"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-2 shrink-0" />
                    <div>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.name}
                      </a>
                      <p className="text-xs text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
