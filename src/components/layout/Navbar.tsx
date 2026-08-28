import { useEffect, useState, type MouseEvent, type SyntheticEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Coffee,
  Compass,
  MapPin,
  Menu,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

interface NavLink {
  label: string;
  href: string;
  icon: typeof Coffee;
}

const NAV_LINKS: NavLink[] = [
  { label: "Tentang Kami", href: "#tentang-kami", icon: Coffee },
  { label: "Fasilitas & Suasana", href: "#fasilitas", icon: Sparkles },
  { label: "Pilihan Kopi", href: "#pilihan-kopi", icon: Compass },
  { label: "Lokasi Toko", href: "#lokasi-toko", icon: MapPin },
];

const Navbar = (): JSX.Element => {
  const { totalItemsCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLogoError, setIsLogoError] = useState<boolean>(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [isMobileMenuOpen]);

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ): void => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement !== null) {
      window.setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      window.history.pushState(null, "", href);
    } else {
      const fallback = document.querySelector(href);
      fallback?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleQuickAction = (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ): void => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    window.setTimeout(() => {
      const target = document.getElementById("pilihan-kopi");
      if (target !== null) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", "#pilihan-kopi");
      }
    }, 100);
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
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50"
      >
        <div className="bg-[#FEF8F6]/90 backdrop-blur-md border border-white/60 shadow-lg rounded-full px-5 py-3 flex items-center justify-between relative">
          {/* Logo Section */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
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
                <Coffee className="h-5 w-5 text-[#FEC07B]" />
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
                    className="flex items-center justify-center"
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
                    className="flex items-center justify-center"
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Menu Dropdown Card */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-3 p-6 rounded-3xl bg-[#FEF8F6]/95 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/20 flex flex-col gap-4 lg:hidden"
              >
                <nav
                  aria-label="Navigasi mobile"
                  className="flex flex-col gap-2"
                >
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium text-[#1D1B1A] transition-colors hover:bg-white active:bg-white"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#82541A]/10 text-[#82541A]">
                        <link.icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-left">{link.label}</span>
                      <span className="text-[#82541A]/40">›</span>
                    </a>
                  ))}
                </nav>

                <a
                  href="#pilihan-kopi"
                  onClick={handleQuickAction}
                  className="bg-[#251910] text-[#FFF8F0] py-3 rounded-full text-center font-medium shadow-md hover:bg-[#1D1B1A] transition-colors"
                >
                  Lihat Menu & Pesan
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
