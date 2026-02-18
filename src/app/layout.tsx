import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waifu Labs — Homelab Infrastructure",
  description:
    "A fully automated, GitOps-driven Kubernetes homelab. Powered by Talos Linux, Flux, and a passion for self-hosting.",
  metadataBase: new URL("https://ok8.sh"),
  openGraph: {
    title: "Waifu Labs — Homelab Infrastructure",
    description:
      "A fully automated, GitOps-driven Kubernetes homelab. Powered by Talos Linux, Flux, and a passion for self-hosting.",
    url: "https://ok8.sh",
    siteName: "Waifu Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waifu Labs — Homelab Infrastructure",
    description:
      "A fully automated, GitOps-driven Kubernetes homelab. Powered by Talos Linux, Flux, and a passion for self-hosting.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased noise`}
      >
        {children}
      </body>
    </html>
  );
}
