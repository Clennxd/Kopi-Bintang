import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { fetchMenuItems } from "../../lib/supabase";
import {
  COFFEE_PLACEHOLDER_IMAGE,
  formatIDR,
  getImageFallback,
} from "../../lib/utils";
import type { MenuItem } from "../../types";

interface CategoryOption {
  label: string;
  value: string;
}

const CATEGORIES: CategoryOption[] = [
  { label: "Semua", value: "all" },
  { label: "Signature Bintang", value: "signature" },
  { label: "Espresso Based", value: "classic" },
  { label: "Manual Brew", value: "manual-brew" },
  { label: "Non-Coffee", value: "non-coffee" },
];

// Map for filtering fallback: some legacy slugs like classic <-> espresso
const categoryMatches = (item: MenuItem, active: string): boolean => {
  if (active === "all") return true;
  if (active === "signature") return item.category_slug === "signature";
  if (active === "classic")
    return (
      item.category_slug === "classic" ||
      item.category_slug === "espresso" ||
      item.category_slug === "espresso-based"
    );
  if (active === "manual-brew")
    return (
      item.category_slug === "manual-brew" ||
      item.category_slug === "manual_brew"
    );
  if (active === "non-coffee")
    return (
      item.category_slug === "non-coffee" ||
      item.category_slug === "non_coffee"
    );
  return item.category_slug === active;
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = COFFEE_PLACEHOLDER_IMAGE;
};

interface ProductCardProps {
  item: MenuItem;
  index: number;
}

const ProductCard = ({ item, index }: ProductCardProps): JSX.Element => {
  const { openProductModal } = useCart();

  const isManualBrew = item.category_slug === "manual-brew" || item.category_slug === "manual_brew";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_40px_rgba(37,25,16,0.08)] ring-1 ring-[#82541A]/10 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(37,25,16,0.15)] hover:ring-[#82541A]/20"
    >
      {/* Image */}
      <div className="relative h-[210px] overflow-hidden bg-[#F9F2F0]">
        <img
          src={getImageFallback(item.image_url)}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            item.is_available ? "" : "grayscale"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#251910]/55 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.is_signature && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEC07B] px-3 py-1 text-[11px] font-bold tracking-wide text-[#251910] shadow-md">
              <Star className="h-3 w-3 fill-[#82541A] text-[#82541A]" />
              Signature
            </span>
          )}
          {isManualBrew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wide text-[#82541A] shadow-md backdrop-blur">
              <Sparkles className="h-3 w-3 text-[#82541A]" />
              Single Origin
            </span>
          )}
          {!item.is_available && (
            <span className="inline-flex items-center rounded-full bg-[#1D1B1A]/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
              Habis
            </span>
          )}
        </div>

        {/* Hover border highlight overlay */}
        <span className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-transparent transition-all group-hover:ring-[#FEC07B]/40" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          className="font-display text-lg font-bold leading-tight text-[#1D1B1A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {item.name}
        </h3>
        <p
          className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#1D1B1A]/60"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {item.description}
        </p>

        {/* Tasting Notes Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tasting_notes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-[#82541A]/15 bg-[#FEF8F6] px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#82541A]"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#82541A]/10 pt-4">
          <span className="text-base font-bold text-[#251910]">
            {formatIDR(item.price)}
          </span>
          <button
            type="button"
            onClick={() => openProductModal(item)}
            disabled={!item.is_available}
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-[#251910] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1D1B1A] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Pilih & Pesan ${item.name}`}
          >
            <span>Pilih & Pesan</span>
            <ShoppingBag className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const SkeletonCard = (): JSX.Element => (
  <div className="animate-pulse space-y-3 rounded-[28px] bg-white p-4 ring-1 ring-[#82541A]/10">
    <div className="h-[200px] rounded-2xl bg-[#F9F2F0]" />
    <div className="h-4 w-2/3 rounded bg-[#EDE7E5]" />
    <div className="h-3 w-full rounded bg-[#EDE7E5]" />
    <div className="h-3 w-1/2 rounded bg-[#EDE7E5]" />
  </div>
);

const MenuCatalog = (): JSX.Element => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchMenuItems();
      if (cancelled) return;
      setMenuItems(result.items);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset expanded when category changes
  useEffect(() => {
    setIsExpanded(false);
  }, [activeCategory]);

  const filteredItems = useMemo(
    () => menuItems.filter((item) => categoryMatches(item, activeCategory)),
    [menuItems, activeCategory]
  );

  const visibleItems = useMemo(() => {
    if (isExpanded) return filteredItems;
    return filteredItems.slice(0, 4);
  }, [filteredItems, isExpanded]);

  const shouldShowToggle = filteredItems.length > 4;

  return (
    <section
      id="pilihan-kopi"
      aria-labelledby="menu-catalog-heading"
      className="scroll-mt-28 bg-[#FEF8F6] px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#82541A]">
            Pilihan Kopi Pilihan
          </p>
          <h2
            id="menu-catalog-heading"
            className="mt-3 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Temukan Rasa
            <br />
            <span className="font-normal italic text-[#82541A]">
              Favorit Anda
            </span>
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed text-[#1D1B1A]/60 sm:text-[15px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Kurasi kopi terbaik dari biji pilihan Nusantara — dari Signature
            manis-creamy hingga Manual Brew single origin yang floral.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-2.5"
          role="group"
          aria-label="Filter kategori menu"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                aria-pressed={isActive}
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-semibold shadow-sm"
                    : "bg-white text-[#1D1B1A]/70 ring-1 ring-[#82541A]/15 hover:bg-[#FEF8F6] hover:text-[#251910] hover:ring-[#82541A]/25"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-secondary-container"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-[28px] bg-white px-8 py-16 text-center ring-1 ring-[#82541A]/10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF8F6] text-[#82541A]">
                <Star className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-[#1D1B1A]">
                Belum ada menu di kategori ini
              </p>
              <p className="mt-1 max-w-sm text-sm text-[#1D1B1A]/60">
                Silakan pilih kategori lain atau lihat semua menu untuk pilihan lengkap.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {visibleItems.map((item, idx) => (
                    <ProductCard key={item.id} item={item} index={idx} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {shouldShowToggle && (
                <div className="mt-10 flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#82541A]/20 bg-white px-7 py-3 text-sm font-semibold text-[#251910] shadow-sm transition-colors hover:border-[#82541A]/35 hover:bg-[#FEF8F6]"
                  >
                    {isExpanded ? "Ciutkan Menu" : "Lihat Semua Menu"}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuCatalog;
