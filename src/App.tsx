import { useEffect, useMemo, useState, type KeyboardEvent, type SyntheticEvent } from 'react';
import {
  Clock,
  Coffee,
  Headphones,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ScrollText,
  Star,
  type LucideIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MenuItem, StoreSettings } from './types';
import { CartProvider, useCartContext } from './context/CartContext';
import {
  DEFAULT_STORE_SETTINGS,
  fetchMenuItems,
  fetchStoreSettings,
  isSupabaseConfigured
} from './lib/supabase';
import {
  COFFEE_PLACEHOLDER_IMAGE,
  formatIDR,
  getImageFallback,
  isStoreOpen
} from './lib/utils';
import ProductDetailModal from './components/modals/ProductDetailModal';
import CartModal from './components/modals/CartModal';
import InfoModal, { type InfoTopic } from './components/modals/InfoModal';
import Toast from './components/ui/Toast';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Semua Menu',
  signature: 'Signature',
  classic: 'Kopi Klasik',
  'non-coffee': 'Non-Kopi',
  pastry: 'Pastry & Dessert'
};

interface InfoTopicOption {
  topic: InfoTopic;
  label: string;
  icon: LucideIcon;
}

const INFO_TOPIC_OPTIONS: InfoTopicOption[] = [
  { topic: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck },
  { topic: 'terms', label: 'Syarat & Ketentuan', icon: ScrollText },
  { topic: 'contact', label: 'Kontak Admin', icon: Headphones }
];

const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = COFFEE_PLACEHOLDER_IMAGE;
};

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MenuCard = ({ item, index }: MenuCardProps) => {
  const { openProductModal } = useCartContext();

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductModal(item);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' }}
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${item.name}`}
      onClick={() => openProductModal(item)}
      onKeyDown={handleCardKeyDown}
      className="group cursor-pointer overflow-hidden rounded-3xl bg-surface-container-low shadow-sm ring-1 ring-outline-variant transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={getImageFallback(item.image_url)}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            item.is_available ? '' : 'grayscale'
          }`}
        />
        {item.is_signature && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
            <Star className="h-3 w-3 fill-secondary-container text-secondary-container" />
            Signature
          </span>
        )}
        {!item.is_available && (
          <span className="absolute inset-0 flex items-center justify-center bg-primary/60 font-display text-xl italic text-on-primary-container">
            Habis hari ini
          </span>
        )}
      </div>
      <div className="space-y-3 p-5">
        <h3 className="font-display text-xl font-semibold">{item.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-on-background/70">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {item.tasting_notes.map((note) => (
            <span
              key={note}
              className="rounded-full border border-outline-variant px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-secondary"
            >
              {note}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-primary">
            {formatIDR(item.price)}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openProductModal(item);
            }}
            disabled={!item.is_available}
            className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-bold text-on-secondary-container transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Pesan
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse space-y-3 rounded-3xl bg-surface-container-low p-4 ring-1 ring-outline-variant">
    <div className="h-40 rounded-2xl bg-surface-container-high" />
    <div className="h-4 w-2/3 rounded bg-surface-container-high" />
    <div className="h-3 w-full rounded bg-surface-container-high" />
    <div className="h-3 w-1/2 rounded bg-surface-container-high" />
  </div>
);

const KopiBintangApp = () => {
  const { openCart, totalItemsCount } = useCartContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [menuResult, settingsResult] = await Promise.all([
        fetchMenuItems(),
        fetchStoreSettings()
      ]);
      if (cancelled) return;
      setMenuItems(menuResult.items);
      setSettings(settingsResult.settings);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isOpenNow = isStoreOpen(settings.opening_time, settings.closing_time);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(menuItems.map((item) => item.category_slug)))],
    [menuItems]
  );

  const visibleItems = useMemo(
    () =>
      activeCategory === 'all'
        ? menuItems
        : menuItems.filter((item) => item.category_slug === activeCategory),
    [activeCategory, menuItems]
  );

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 z-20 border-b border-outline-variant bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <Coffee className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                {settings.store_name}
              </p>
              <p className="text-xs text-on-background/60">Kedai Kopi UMKM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold sm:text-sm ${
                isOpenNow
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-background/70'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOpenNow ? 'bg-emerald-600' : 'bg-red-500'
                }`}
              />
              <Clock className="hidden h-4 w-4 sm:inline-flex" />
              {isOpenNow ? 'Buka' : 'Tutup'}
              <span className="hidden font-normal opacity-70 md:inline">
                {settings.opening_time}–{settings.closing_time}
              </span>
            </span>
            <motion.button
              type="button"
              onClick={openCart}
              whileTap={{ scale: 0.92 }}
              aria-label={`Buka keranjang (${totalItemsCount} item)`}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container transition-colors hover:bg-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 400 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-container px-1 text-[11px] font-bold text-on-secondary-container"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
            Diseduh dengan Cinta Sejak 2021
          </p>
          <h1 className="mt-4 font-display text-5xl font-black leading-tight sm:text-6xl">
            Ngopi Nyaman,
            <br />
            Harga Bersahabat.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-on-background/70">
            Biji arabika pilihan dari petani lokal, disangrai sendiri setiap pagi.
            Ketuk menu untuk kustomisasi, pesan mudah via WhatsApp.
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-on-background/50">
            {isSupabaseConfigured ? 'Terhubung ke Supabase' : 'Mode Demo · Data Lokal'}
          </p>
        </motion.section>

        <nav
          id="menu-katalog"
          aria-label="Kategori menu"
          className="mb-8 flex flex-wrap scroll-mt-24 justify-center gap-2"
        >
          {categories.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveCategory(slug)}
              aria-pressed={activeCategory === slug}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === slug
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-background hover:bg-surface-container-highest'
              }`}
            >
              {CATEGORY_LABELS[slug] ?? slug}
            </button>
          ))}
        </nav>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((placeholderIndex) => (
              <SkeletonCard key={placeholderIndex} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-low">
        <div className="mx-auto max-w-6xl space-y-5 px-6 py-8">
          <nav
            aria-label="Informasi toko"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {INFO_TOPIC_OPTIONS.map(({ topic, label, icon: Icon }) => (
              <button
                key={topic}
                type="button"
                onClick={() => setInfoTopic(topic)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-on-background/60 transition-colors hover:text-secondary"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>
          <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-center text-on-background/80 transition-colors hover:text-secondary"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              {settings.address}
            </a>
            <p className="text-on-background/60">
              Jam operasional {settings.opening_time}–{settings.closing_time} WIB
            </p>
          </div>
          <p className="text-center text-xs text-on-background/45">
            © 2026 {settings.store_name}. Diseduh dengan penuh cinta di Yogyakarta.
          </p>
        </div>
      </footer>

      <ProductDetailModal />
      <CartModal />
      <InfoModal
        isOpen={infoTopic !== null}
        topic={infoTopic ?? 'privacy'}
        onClose={() => setInfoTopic(null)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <KopiBintangApp />
    </CartProvider>
  );
}
