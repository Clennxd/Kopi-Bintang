import { motion } from "framer-motion";
import {
  Car,
  Coffee,
  CreditCard,
  Dog,
  Heart,
  Laptop,
  ShieldCheck,
  Sparkles,
  Trees,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AreaCard {
  title: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
}

const AREA_CARDS: AreaCard[] = [
  {
    title: "Indoor Work Zone",
    icon: Laptop,
    description:
      "Ruang ber-AC yang tenang dan dingin, dirancang khusus untuk WFC, tugas kuliah, atau meeting santai.",
    tags: ["Full AC", "Wi-Fi 100 Mbps", "Kursi Ergonomis"],
  },
  {
    title: "Slow Bar Experience",
    icon: Coffee,
    description:
      "Duduk berhadapan dengan barista, berdiskusi profil rasa, dan menikmati seni seduhan manual V60.",
    tags: ["Manual Brew", "Single Origin", "Barista Interaction"],
  },
  {
    title: "Outdoor Green Sanctuary",
    icon: Trees,
    description:
      "Area terbuka hijau dengan sirkulasi udara alami dan pencahayaan matahari yang segar untuk ngobrol santai.",
    tags: ["Asri & Sejuk", "Smoking Friendly", "Pet Friendly"],
  },
];

interface Facility {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

const FACILITIES: Facility[] = [
  {
    title: "Colokan Listrik",
    subtitle: "Tersedia di tiap meja",
    icon: Zap,
  },
  {
    title: "High-Speed Wi-Fi",
    subtitle: "Koneksi stabil 100 Mbps",
    icon: Wifi,
  },
  {
    title: "Musholla Bersih",
    subtitle: "Tempat ibadah privat & nyaman",
    icon: Heart,
  },
  {
    title: "Parkir Luas",
    subtitle: "Aman untuk mobil & motor",
    icon: Car,
  },
  {
    title: "Pet-Friendly",
    subtitle: "Ramah hewan di area outdoor",
    icon: Dog,
  },
  {
    title: "QRIS & Cashless",
    subtitle: "Transaksi praktis & cepat",
    icon: CreditCard,
  },
];

const StoreSpecs = (): JSX.Element => {
  return (
    <section
      id="fasilitas"
      aria-labelledby="specs-heading"
      className="scroll-mt-28 bg-white px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 bg-[#82541A]/10 text-[#82541A] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Kenyamanan Ruang
          </span>
          <h2
            id="specs-heading"
            className="mt-4 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Dirancang untuk Setiap Kebutuhan Hari Anda
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#1D1B1A]/60 sm:text-[15px]">
            Dari suasana hening untuk fokus bekerja hingga sudut asri untuk bersantai bersama teman.
          </p>
          <div className="mx-auto mt-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEC07B]/20 px-3 py-1 text-xs font-medium text-[#794C12] ring-1 ring-[#FEC07B]/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Terkurasi untuk kenyamanan maksimal
            </span>
          </div>
        </motion.div>

        {/* Bagian 1: 3 Area Utama Kedai */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {AREA_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E1DF] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEC07B]/20 text-[#82541A] ring-1 ring-[#FEC07B]/30">
                  <card.icon className="h-6 w-6" />
                </span>
                <h3
                  className="mt-5 font-display text-xl font-bold leading-tight text-[#1D1B1A]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1D1B1A]/65">
                  {card.description}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#FEF8F6] px-3 py-1.5 text-xs font-medium text-[#82541A] ring-1 ring-[#E7E1DF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bagian 2: Fasilitas Penunjang Lengkap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16"
        >
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E7E1DF] to-transparent" />
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#1D1B1A]">
              Fasilitas Penunjang Lengkap
            </h3>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E7E1DF] to-transparent" />
          </div>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#FEC07B]/60" />

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {FACILITIES.map((facility, index) => (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white p-5 text-center border border-[#E7E1DF] shadow-sm hover:shadow-md transition-all duration-300 sm:p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEC07B]/20 text-[#82541A] ring-1 ring-[#FEC07B]/30">
                  <facility.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight text-[#1D1B1A]">
                    {facility.title}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-[#1D1B1A]/55">
                    {facility.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreSpecs;
