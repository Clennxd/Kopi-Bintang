import { useState, type MouseEvent, type SyntheticEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, Star, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Fasilitas & Suasana", href: "#fasilitas" },
  { label: "Pilihan Kopi", href: "#pilihan-kopi" },
  { label: "Lokasi", href: "#lokasi-toko" },
];

const Navbar = (): JSX.Element => {
  const { totalItemsCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLogoError, setIsLogoError] = useState<boolean>(false);

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    event.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement !== null) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href.startsWith("#")) {
      window.history.pushState(null, "", href);
      const fallbackElement = document.querySelector(href);
      fallbackElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoError = (event: SyntheticEvent<HTMLImageElement>): void => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === "true") return;
    target.dataset.fallbackApplied = "true";
    setIsLogoError(true);
  };

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl backdrop-blur-md bg-[#FEF8F6]/80 rounded-full border border-white/40 shadow-xl z-50 px-6 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="Kopi Bintang - Beranda"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#251910] shadow-sm">
              {!isLogoError ? (
                <img
                  src="/images/logo.png"
                  alt="Logo Kopi Bintang"
                  className="h-9 w-9 object-cover"
                  onError={handleLogoError}
                />
              ) : (
                <Star className="h-5 w-5 fill-[#FEC07B] text-[#FEC07B]" />
              )}
            </span>
            <span
              className="font-display text-[17px] font-bold tracking-tight text-[#1D1B1A] sm:text-lg"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Kopi Bintang
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-[#1D1B1A]/75 transition-colors hover:bg-white/60 hover:text-[#251910] xl:px-4"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <motion.button
              type="button"
              onClick={openCart}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.02 }}
              aria-label={`Buka keranjang, ${totalItemsCount} item`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#251910] text-white shadow-md transition-colors hover:bg-[#1D1B1A] sm:h-11 sm:w-11"
            >
              <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white shadow-md ring-2 ring-[#FEF8F6]/80"
                  >
                    {totalItemsCount > 99 ? "99+" : totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={
                isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-expanded={isMobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#251910] shadow-sm ring-1 ring-white/50 backdrop-blur transition-colors hover:bg-white lg:hidden sm:h-11 sm:w-11"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#1D1B1A]/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="fixed top-[4.75rem] left-1/2 z-40 w-[92%] max-w-6xl -translate-x-1/2 lg:hidden"
            >
              <div className="overflow-hidden rounded-[28px] border border-white/40 bg-[#FEF8F6]/95 shadow-2xl backdrop-blur-xl">
                <div className="space-y-1 p-3">
                  {NAV_LINKS.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                      className="flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-medium text-[#1D1B1A] transition-colors hover:bg-white hover:shadow-sm active:bg-white"
                    >
                      <span>{link.label}</span>
                      <span className="text-[#82541A]/40">›</span>
                    </motion.a>
                  ))}
                </div>
                <div className="border-t border-[#82541A]/10 bg-white/50 px-6 py-4">
                  <p
                    className="text-center text-xs font-medium tracking-wide text-[#1D1B1A]/60"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Diseduh dengan Cinta Sejak 2021 • Kopi Bintang
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
