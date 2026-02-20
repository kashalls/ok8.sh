import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import GatewayHero from "@/components/GatewayHero";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gateway — Waifu Labs",
  description:
    "This hostname is resolving to a Waifu Labs gateway endpoint with no configured service.",
};

const CONTACT_EMAIL = process.env.GATEWAY_CONTACT_EMAIL;

export default async function GatewayPage() {
  const headersList = await headers();
  const hostname = headersList.get("host") || "unknown";

  return (
    <>
      <Navbar />
      <main>
        <GatewayHero hostname={hostname} contactEmail={CONTACT_EMAIL} />
      </main>
      <Footer />
    </>
  );
}
