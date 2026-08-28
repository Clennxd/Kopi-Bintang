import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, MapPin, Navigation, Store } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { isStoreOpen } from "../../lib/utils";

const StoreLocation = (): JSX.Element => {
  const { storeSettings } = useCart();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Spec operational hours 07:00 - 22:00
  const OPEN_TIME = "07:00";
  const CLOSE_TIME = "22:00";
  const isOpen = isStoreOpen(OPEN_TIME, CLOSE_TIME);

  // Optional: also track local time string for accessibility
  const currentTimeLabel = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleDirections = (): void => {
    const url = storeSettings.google_maps_url?.trim().length
      ? storeSettings.google_maps_url
      : "https://maps.google.com/?q=Kopi+Bintang+Senopati+Jakarta";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="lokasi-toko"
      aria-labelledby="store-location-heading"
      className="scroll-mt-28 bg-white px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#82541A]">
            Lokasi & Jam Operasional
          </p>
          <h2
            id="store-location-heading"
            className="mt-3 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Kunjungi Kedai Kami
            <br />
            <span className="font-normal italic text-[#82541A]">
              Ngopi Santai di Senopati
            </span>
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed text-[#1D1B1A]/60 sm:text-[15px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Mampir kapan saja untuk kerja, ngobrol, atau sekadar rehat sejenak.
            Aroma kopi baru disangrai selalu menanti Anda di balik pintu kayu hangat kami.
          </p>

          {/* LIVE Operational Badge */}
          <div className="mt-6 flex justify-center">
            {isOpen ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm"
                aria-live="polite"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span>● Buka Sekarang (07.00 - 22.00)</span>
                <span className="hidden text-xs font-normal text-emerald-600 sm:inline">
                  • {currentTimeLabel} WIB
                </span>
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm"
                aria-live="polite"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 opacity-80" />
                <span>○ Sedang Tutup (Buka Kembali 07.00)</span>
                <span className="hidden text-xs font-normal text-amber-600 sm:inline">
                  • {currentTimeLabel} WIB
                </span>
              </motion.span>
            )}
          </div>
        </div>

        {/* Cards Row */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col rounded-3xl bg-[#FEF8F6] p-7 shadow-[0_8px_40px_rgba(37,25,16,0.08)] ring-1 ring-[#82541A]/10 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#251910] text-[#FEC07B]">
                <Store className="h-5 w-5" />
              </span>
              <div>
                <h3
                  className="font-display text-lg font-bold leading-tight text-[#1D1B1A]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Kopi Bintang Sanctuary & Slow Bar
                </h3>
                <p className="text-xs font-medium uppercase tracking-wide text-[#82541A]">
                  Flagship Store • Senopati
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#82541A] shadow-sm ring-1 ring-[#82541A]/10">
                  <MapPin className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-[#1D1B1A]/80">
                  Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#82541A] shadow-sm ring-1 ring-[#82541A]/10">
                  <Clock3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1D1B1A]">
                    Senin - Minggu: 07.00 - 22.00
                  </p>
                  <p className="text-xs text-[#1D1B1A]/55">
                    Termasuk hari libur nasional • Waktu Indonesia Barat
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDirections}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#251910] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1D1B1A] hover:shadow-lg"
              >
                <Navigation className="h-4 w-4" />
                Dapatkan Petunjuk Arah
              </button>
              <span className="hidden items-center justify-center rounded-full border border-[#82541A]/15 bg-white px-4 py-3 text-xs font-medium text-[#1D1B1A]/60 sm:inline-flex">
                Parkir luas & Musholla
              </span>
            </div>

            <p className="mt-4 text-center text-xs text-[#1D1B1A]/45 sm:text-left">
              Klik tombol di atas untuk membuka Google Maps di tab baru.
            </p>
          </motion.div>

          {/* Visual Map Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#251910] shadow-[0_16px_48px_rgba(37,25,16,0.18)] ring-1 ring-[#82541A]/15"
          >
            {/* Map image background */}
            <div className="relative h-[320px] w-full overflow-hidden sm:h-[360px] lg:h-full lg:min-h-[380px]">
              <img
                src="https://images.unsplash.com/photo-1524634126442-357e0eac3c14?q=80&w=1200&auto=format&fit=crop"
                alt="Peta lokasi Kopi Bintang"
                loading="lazy"
                className="h-full w-full object-cover opacity-90 sepia-[0.25] contrast-105 brightness-95 transition-transform duration-700 group-hover:scale-105"
              />
              {/* Warm sepia coffee overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FEC07B]/20 via-[#82541A]/20 to-[#251910]/55" />
              <div className="absolute inset-0 bg-[#251910]/10" />
              {/* Grid pattern overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
                aria-hidden="true"
              />

              {/* Center Pin */}
              <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
                {/* Pulse rings */}
                <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FEC07B]/25 animate-ping" style={{ animationDuration: "2.2s" }} />
                <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FEC07B]/30 animate-pulse" />
                {/* Pin itself */}
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FEC07B] text-[#251910] shadow-xl ring-4 ring-white/40">
                  <MapPin className="h-6 w-6 fill-[#251910]/10" />
                </span>
                {/* Small label */}
                <span className="absolute left-1/2 top-[52px] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#251910] px-3 py-1 text-xs font-bold text-white shadow-md">
                  Kopi Bintang
                </span>
              </div>

              {/* Top label */}
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#251910] shadow-md backdrop-blur">
                📍 Senopati • Kebayoran Baru
              </div>

              {/* Bottom CTA */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1D1B1A]">
                    Lihat lokasi akurat
                  </p>
                  <p className="truncate text-xs text-[#1D1B1A]/60">
                    Buka langsung di Google Maps
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDirections}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#251910] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1D1B1A]"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Buka di Google Maps
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
