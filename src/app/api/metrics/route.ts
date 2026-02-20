import { NextResponse } from "next/server";

interface KromgoMetric {
  name: string;
  label: string;
  value: string | null;
  color?: string;
}

interface KromgoResponse {
  color: string;
  label: string;
  message: string;
  schemaVersion: number;
}

const KROMGO_BASE = process.env.KROMGO_BASE_URL || "http://kromgo";

const METRICS: { name: string; label: string }[] = [
  { name: "cluster_node_count", label: "Nodes" },
  { name: "cluster_pods_running", label: "Running Pods" },
  { name: "cluster_cpu_usage", label: "CPU Usage" },
  { name: "cluster_power_usage", label: "Power Draw" },
  { name: "cluster_uptime_days", label: "Uptime" },
  { name: "cluster_age_days", label: "Cluster Age" },
  { name: "cluster_network_transmit_usage", label: "Network TX" },
  { name: "cluster_network_receive_usage", label: "Network RX" },
  { name: "prometheus_active_alerts", label: "Active Alerts" },
  { name: "talos_version", label: "Talos Version" },
  { name: "kubernetes_version", label: "Kubernetes" },
];

async function fetchMetric(
  metric: (typeof METRICS)[0]
): Promise<KromgoMetric> {
  try {
    const res = await fetch(`${KROMGO_BASE}/${metric.name}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: KromgoResponse = await res.json();
    return {
      name: metric.name,
      label: metric.label,
      value: data.message,
      color: data.color,
    };
  } catch {
    return { name: metric.name, label: metric.label, value: null };
  }
}

export async function GET() {
  const results = await Promise.allSettled(METRICS.map(fetchMetric));
  const metrics = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { name: "unknown", label: "Unknown", value: null }
  );

  return NextResponse.json(
    { metrics, timestamp: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
