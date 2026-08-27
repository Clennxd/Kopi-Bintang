import { motion } from "framer-motion";
import {
  Armchair,
  Banknote,
  CarFront,
  Coffee,
  Dog,
  Droplets,
  Leaf,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SpecCard {
  title: string;
  icon: LucideIcon;
  image: string;
  highlights: string[];
  description: string;
}

const SPEC_CARDS: SpecCard[] = [
  {
    title: "Indoor Work-Friendly Zone",
    icon: Armchair,
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop",
    description:
      "Ruang ber-AC sejuk untuk fokus maksimal — entah mengejar deadline atau menyeruput kopi sambil membaca.",
    highlights: [
      "Full AC sejuk",
      "Colokan listrik di setiap meja",
      "Wi-Fi 100 Mbps",
      "Kursi ergonomis untuk kerja / tugas",
    ],
  },
  {
    title: "Slow Bar Experience",
    icon: Coffee,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    description:
      "Duduk berhadapan langsung dengan barista, berdiskusi profil rasa, dan menyaksikan seduhan V60 / Aeropress secara langsung.",
    highlights: [
      "Bar interaktif dengan barista",
      "Demo seduhan V60 & Aeropress",
      "Diskusi profil rasa & origin",
      "Kurasi biji single origin",
    ],
  },
  {
    title: "Outdoor Green Garden",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    description:
      "Sirkulasi udara terbuka yang asri dengan tanaman hijau — area smoking ramah dan santai untuk sore yang panjang.",
    highlights: [
      "Sirkulasi udara terbuka",
      "Asri dengan tanaman hijau",
      "Area smoking ramah",
      "Santai & instagramable",
    ],
  },
];

interface QuickFacility {
  label: string;
  icon: LucideIcon;
}

const QUICK_FACILITIES: QuickFacility[] = [
  { label: "Musholla Nyaman", icon: Sparkles },
  { label: "Area Parkir Luas", icon: CarFront },
  { label: "Pet Friendly Outdoor", icon: Dog },
  { label: "QRIS & Cashless Ready", icon: Banknote },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: index * 0.1, ease: "easeOut" as const },
  }),
};

const StoreSpecs = (): JSX.Element => {
  return (
    <section
      id="fasilitas"
      aria-labelledby="specs-heading"
      className="scroll-mt-28 bg-white px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#82541A]">
            Fasilitas & Suasana
          </p>
          <h2
            id="specs-heading"
            className="mt-3 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Kenyamanan yang
            <br />
            <span className="font-normal italic text-[#82541A]">
              Kami Siapkan untuk Anda
            </span>
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed text-[#1D1B1A]/60 sm:text-[15px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Tiga zona dengan karakter berbeda — pilih sudut yang paling
            memanggil hati Anda hari ini.
          </p>
        </motion.div>

        {/* Grid 3 Kartu Area Kedai */}
        <div className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {SPEC_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-[28px] bg-[#FEF8F6] shadow-[0_8px_40px_rgba(37,25,16,0.08)] ring-1 ring-[#82541A]/10 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(37,25,16,0.13)]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#251910]/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#251910] shadow-md backdrop-blur">
                  <card.icon className="h-5 w-5" />
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-[#251910] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white">
                  {index === 0
                    ? "Zona Produktivitas"
                    : index === 1
                      ? "Zona Eksplorasi Rasa"
                      : "Zona Rehat Hijau"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3
                  className="font-display text-lg font-bold leading-tight text-[#1D1B1A]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-[#1D1B1A]/65"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {card.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {card.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-[#1D1B1A]/80"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FEC07B]/60 text-[#82541A]">
                        {item.includes("AC") ? (
                          <Droplets className="h-3.5 w-3.5" />
                        ) : item.includes("Wi-Fi") ? (
                          <Wifi className="h-3.5 w-3.5" />
                        ) : item.includes("Colokan") ? (
                          <Zap className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#82541A]" />
                        )}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Baris Fasilitas Cepat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-[24px] bg-[#251910] px-6 py-7 shadow-xl sm:px-8 lg:px-10"
        >
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p
              className="font-display text-lg font-semibold italic text-[#FEC07B] sm:text-xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Fasilitas penunjang lengkap
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {QUICK_FACILITIES.map((facility) => (
                <span
                  key={facility.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  <facility.icon className="h-4 w-4 shrink-0 text-[#FEC07B]" />
                  {facility.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreSpecs;
