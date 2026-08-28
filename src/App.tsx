import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/sections/HeroSection";
import StorePhilosophy from "./components/sections/StorePhilosophy";
import StoreSpecs from "./components/sections/StoreSpecs";
import BrandStory from "./components/sections/BrandStory";
import MenuCatalog from "./components/sections/MenuCatalog";
import StoreLocation from "./components/sections/StoreLocation";
import ProductDetailModal from "./components/modals/ProductDetailModal";
import CartModal from "./components/modals/CartModal";
import InfoModal, { type InfoTopic } from "./components/modals/InfoModal";
import Toast from "./components/ui/Toast";

const KopiBintangShell = (): JSX.Element => {
  const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null);

  useEffect(() => {
    // Ensure smooth anchor handling and scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Smooth scroll for hash links if directly loaded with hash
    const hash = window.location.hash;
    if (hash.length > 0) {
      const id = hash.slice(1);
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    const handleAnchorClick = (event: Event): void => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        event.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main>
        <HeroSection />
        <StorePhilosophy />
        <StoreSpecs />
        <BrandStory />
        <MenuCatalog />
        <StoreLocation />
      </main>
      <Footer
        onPrivacyClick={() => setInfoTopic("privacy")}
        onTermsClick={() => setInfoTopic("terms")}
      />

      {/* Modals & Notifications Layer */}
      <ProductDetailModal />
      <CartModal />
      <InfoModal
        isOpen={infoTopic !== null}
        topic={infoTopic ?? "privacy"}
        onClose={() => setInfoTopic(null)}
      />
      <Toast />
    </div>
  );
};

export default function App(): JSX.Element {
  return (
    <CartProvider>
      <KopiBintangShell />
    </CartProvider>
  );
}
