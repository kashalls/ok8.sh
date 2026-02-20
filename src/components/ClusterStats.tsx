"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Server,
  Box,
  Zap,
  Clock,
  Calendar,
  ArrowUpFromLine,
  ArrowDownToLine,
  AlertTriangle,
  Shield,
  Container,
} from "./icons";

interface Metric {
  name: string;
  label: string;
  value: string | null;
  color?: string;
}

interface MetricsResponse {
  metrics: Metric[];
  timestamp: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cluster_node_count: Server,
  cluster_pods_running: Box,
  cluster_cpu_usage: Cpu,
  cluster_power_usage: Zap,
  cluster_uptime_days: Clock,
  cluster_age_days: Calendar,
  cluster_network_transmit_usage: ArrowUpFromLine,
  cluster_network_receive_usage: ArrowDownToLine,
  prometheus_active_alerts: AlertTriangle,
  talos_version: Shield,
  kubernetes_version: Container,
};

function kromgoColorToClass(color?: string): string {
  switch (color) {
    case "green": return "text-success";
    case "orange": return "text-warning";
    case "red": return "text-danger";
    default: return "text-accent";
  }
}

// Primary stats shown as large cards
const primaryStats = [
  "cluster_node_count",
  "cluster_pods_running",
  "cluster_cpu_usage",
  "cluster_power_usage",
  "cluster_uptime_days",
  "cluster_age_days",
];

// Secondary stats shown as smaller badges
const secondaryStats = [
  "cluster_network_transmit_usage",
  "cluster_network_receive_usage",
  "prometheus_active_alerts",
  "talos_version",
  "kubernetes_version",
];

function StatSkeleton() {
  return (
    <div className="stat-card rounded-xl border border-card-border bg-card/50 backdrop-blur-sm p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-card-border/50" />
        <div className="h-4 w-20 bg-card-border/50 rounded" />
      </div>
      <div className="h-8 w-24 bg-card-border/50 rounded" />
    </div>
  );
}

export default function ClusterStats() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Failed");
      const data: MetricsResponse = await res.json();
      setMetrics(data.metrics);
      setLastUpdated(
        new Date(data.timestamp).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const primary = metrics.filter((m) => primaryStats.includes(m.name));
  const secondary = metrics.filter((m) => secondaryStats.includes(m.name));

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-card-border bg-card/50 text-xs text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
            Live Metrics
            {lastUpdated && (
              <span className="text-muted/60">· {lastUpdated}</span>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Stats at a Glance
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            Real-time metrics from the homelab, powered by Prometheus and{" "}
            <a
              href="https://github.com/kashalls/kromgo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Kromgo
            </a>
            .
          </p>
        </motion.div>

        {/* Primary stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
            : primary.map((metric, i) => {
                const Icon = iconMap[metric.name] || Server;
                const color = kromgoColorToClass(metric.color);

                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                      className="stat-card rounded-xl border border-card-border bg-card/50 backdrop-blur-sm p-6 h-full"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-lg bg-card border border-card-border flex items-center justify-center ${color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm text-muted">{metric.label}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">
                        {metric.value ?? "—"}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
        </div>

        {/* Secondary stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          {!loading &&
            secondary.map((metric) => {
              const Icon = iconMap[metric.name] || Server;
              const color = kromgoColorToClass(metric.color);

              return (
                <div
                  key={metric.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-card-border bg-card/30 backdrop-blur-sm text-sm"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-muted">{metric.label}</span>
                  <span className="font-mono font-medium text-foreground">
                    {metric.value ?? "—"}
                  </span>
                </div>
              );
            })}
        </motion.div>
      </div>
    </section>
  );
}
