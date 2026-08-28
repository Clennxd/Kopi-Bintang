import { useState } from "react";
import { Clock3, Headphones, MapPin, ScrollText, ShieldCheck, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import InfoModal, { type InfoTopic } from "../modals/InfoModal";

interface FooterProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

const Footer = ({ onPrivacyClick, onTermsClick }: FooterProps): JSX.Element => {
  const { storeSettings } = useCart();
  const [activeTopic, setActiveTopic] = useState<InfoTopic | null>(null);
  const [isLogoError, setIsLogoError] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrivacy = (): void => {
    if (onPrivacyClick) {
      onPrivacyClick();
      return;
    }
    setActiveTopic("privacy");
  };

  const handleTerms = (): void => {
    if (onTermsClick) {
      onTermsClick();
      return;
    }
    setActiveTopic("terms");
  };

  const handleContact = (): void => {
    const digits = storeSettings.whatsapp_number.replace(/\D/g, "");
    const normalized = digits.startsWith("62") ? digits : `62${digits.replace(/^0+/, "")}`;
    const text = encodeURIComponent(
      `Halo Admin ${storeSettings.store_name}, saya ingin bertanya.`
    );
    window.open(`https://wa.me/${normalized}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const isControlled = onPrivacyClick !== undefined || onTermsClick !== undefined;

  return (
    <>
      <footer className="bg-[#1D1B1A] text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_1fr]">
            {/* Brand Section */}
            <div>
              <button
                type="button"
                onClick={handleScrollToTop}
                aria-label="Kopi Bintang — kembali ke atas"
                className="group flex items-center gap-3 text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white text-[#251910] shadow-md transition-transform group-hover:scale-105">
                  {!isLogoError ? (
                    <img
                      src="/images/logo.png"
                      alt="Logo Kopi Bintang"
                      className="h-11 w-11 object-cover"
                      onError={() => setIsLogoError(true)}
                    />
                  ) : (
                    <Star className="h-6 w-6 fill-[#FEC07B] text-[#FEC07B]" />
                  )}
                </span>
                <span>
                  <span
                    className="font-display text-xl font-bold leading-none tracking-tight"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Kopi Bintang
                  </span>
                  <span className="block text-xs font-medium tracking-wide text-white/60">
                    Artisanal Coffee & Sanctuary Space
                  </span>
                </span>
              </button>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
                Ruang teduh untuk menyeruput kopi asli Nusantara — diseduh teliti, disajikan dengan hati sejak 2021.
              </p>

              <p className="mt-6 text-xs text-white/45">
                © {currentYear} Kopi Bintang. All rights reserved. Diseduh dengan cinta di Yogyakarta & Jakarta.
              </p>
            </div>

            {/* Navigation & Info Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
                Informasi
              </h3>
              <nav aria-label="Tautan informasi footer" className="mt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handlePrivacy}
                  className="inline-flex items-center gap-2 text-left text-sm text-white/70 transition-colors hover:text-[#FEC07B]"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#FEC07B]/80" />
                  Kebijakan Privasi
                </button>
                <button
                  type="button"
                  onClick={handleTerms}
                  className="inline-flex items-center gap-2 text-left text-sm text-white/70 transition-colors hover:text-[#FEC07B]"
                >
                  <ScrollText className="h-4 w-4 shrink-0 text-[#FEC07B]/80" />
                  Syarat & Ketentuan
                </button>
                <button
                  type="button"
                  onClick={handleContact}
                  className="inline-flex items-center gap-2 text-left text-sm text-white/70 transition-colors hover:text-[#FEC07B]"
                >
                  <Headphones className="h-4 w-4 shrink-0 text-[#FEC07B]/80" />
                  Kontak Kami
                </button>
              </nav>
            </div>

            {/* Jam Operasional & Alamat */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
                Kunjungi Kami
              </h3>
              <div className="mt-4 space-y-3 text-sm text-white/65">
                <p className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 shrink-0 text-[#FEC07B]/80" />
                  <span>
                    <span className="font-semibold text-white">Senin - Minggu</span> • 07.00 - 22.00 WIB
                  </span>
                </p>
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FEC07B]/80" />
                  <span>
                    Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190
                    <span className="block text-xs text-white/45">
                      {storeSettings.address}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
            <p>
              <span className="font-medium text-white/60">{storeSettings.store_name}</span> • {storeSettings.opening_time}–{storeSettings.closing_time} WIB
            </p>
            <button
              type="button"
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-[#FEC07B]/40 hover:text-white"
              aria-label="Kembali ke atas"
            >
              ↑
              Kembali ke atas
            </button>
          </div>
        </div>
      </footer>

      {/* Local InfoModal fallback when not controlled by parent */}
      {!isControlled && (
        <InfoModal
          isOpen={activeTopic !== null}
          topic={activeTopic ?? "privacy"}
          onClose={() => setActiveTopic(null)}
        />
      )}
    </>
  );
};

export default Footer;
