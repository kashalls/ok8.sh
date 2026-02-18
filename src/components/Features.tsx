"use client";

import { motion } from "framer-motion";
import { GitBranch, Eye, Lock, Workflow, HardDrive, Globe } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitOps Driven",
    description:
      "Every change flows through Git. Flux watches the repository and reconciles the cluster state automatically — no manual kubectl required.",
  },
  {
    icon: Workflow,
    title: "Fully Declarative",
    description:
      "Infrastructure as code from top to bottom. Kubernetes manifests, Helm releases, and Kustomizations define the entire stack.",
  },
  {
    icon: Eye,
    title: "Observable",
    description:
      "Prometheus, Grafana, and Alertmanager provide deep visibility into every layer of the stack. Nothing runs in the dark.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description:
      "SOPS-encrypted secrets, network policies, and Talos Linux's immutable OS ensure a hardened environment throughout.",
  },
  {
    icon: HardDrive,
    title: "Persistent Storage",
    description:
      "Rook-Ceph provides distributed, replicated storage across the cluster — keeping data safe and available.",
  },
  {
    icon: Globe,
    title: "Externally Accessible",
    description:
      "Cloudflare Tunnels and ExternalDNS expose services to the internet without opening firewall ports.",
  },
];

export default function Features() {
  return (
    <section className="relative py-32 px-6">
      {/* Divider */}
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
            Low maintenance, high reward. The stack is designed to run reliably with minimal intervention — so I can spend more time building and less time babysitting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="feature-card rounded-xl border border-card-border bg-card/30 backdrop-blur-sm p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent-secondary/20 border border-card-border flex items-center justify-center text-accent mb-4">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
