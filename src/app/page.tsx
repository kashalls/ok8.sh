import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClusterStats from "@/components/ClusterStats";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClusterStats />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
