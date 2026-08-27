import { motion } from "framer-motion";
import { Clock3, Coffee, Leaf } from "lucide-react";

interface Pillar {
  title: string;
  description: string;
  icon: typeof Leaf;
  accent: string;
}

const PILLARS: Pillar[] = [
  {
    title: "100% Biji Kopi Nusantara",
    description:
      "Bermitra langsung dengan petani lokal Aceh Gayo, Bali Kintamani, hingga Toraja — kami menjaga rantai pasok yang adil dan mutu biji yang konsisten dari kebun ke cangkir.",
    icon: Leaf,
    accent: "bg-[#FEC07B] text-[#82541A]",
  },
  {
    title: "Seni Seduhan Barista",
    description:
      "Presisi rasio air, suhu, dan teknik tuang untuk mengeluarkan potensi rasa terbaik. Setiap cangkir diracik dengan kalibrasi harian dan cinta pada detail.",
    icon: Coffee,
    accent: "bg-[#251910] text-[#FEC07B]",
  },
  {
    title: "Konsep Slow-Living",
    description:
      "Tempat di mana Anda bisa memperlambat waktu sejenak dan menikmati tiap tegukan. Ruang bernapas dari hiruk pikuk, untuk hadir sepenuhnya di momen.",
    icon: Clock3,
    accent: "bg-[#82541A] text-white",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const StorePhilosophy = (): JSX.Element => {
  return (
    <section
      id="tentang-kami"
      aria-labelledby="philosophy-heading"
      className="scroll-mt-28 bg-[#FEF8F6] px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#82541A]">
            Filosofi Kami
          </p>
          <h2
            id="philosophy-heading"
            className="mt-3 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Bukan Sekadar Kedai,
            <br />
            <span className="font-normal italic text-[#82541A]">
              Ini Ruang Bernapas Anda
            </span>
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#FEC07B]" />
          <p
            className="mt-6 text-[15px] leading-relaxed text-[#1D1B1A]/70 sm:text-base"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Kopi Bintang lahir dari kerinduan akan ruang yang jujur — tempat
            kekayaan biji kopi lokal Nusantara dirayakan dengan proses seduh
            yang{" "}
            <span className="font-semibold text-[#1D1B1A]">teliti dan berjiwa</span>.
            Kami percaya, secangkir kopi yang baik bukan hanya soal rasa,
            melainkan jeda yang ia beri: menghangatkan percakapan, menemani
            fokus, dan merayakan hal-hal kecil setiap hari. Dari tangan petani
            hingga tangan barista, setiap langkah kami jaga dengan hormat pada
            alam dan manusia.
          </p>
        </motion.div>

        {/* 3 Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {PILLARS.map((pillar) => (
            <motion.article
              key={pillar.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col rounded-[28px] bg-white p-7 shadow-[0_8px_40px_rgba(37,25,16,0.07)] ring-1 ring-[#82541A]/10 lg:p-8"
            >
              {/* Icon */}
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.accent} shadow-sm transition-transform duration-300 group-hover:scale-105`}
              >
                <pillar.icon className="h-6 w-6" />
              </span>

              <h3
                className="mt-5 font-display text-lg font-bold leading-snug text-[#1D1B1A]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed text-[#1D1B1A]/65"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {pillar.description}
              </p>

              {/* Subtle accent line */}
              <span className="mt-6 block h-1 w-10 rounded-full bg-[#FEC07B]/60 transition-all duration-300 group-hover:w-14 group-hover:bg-[#FEC07B]" />
            </motion.article>
          ))}
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-14 max-w-2xl rounded-3xl bg-[#251910] px-8 py-7 text-center shadow-xl sm:px-10"
        >
          <p
            className="font-display text-lg italic leading-relaxed text-[#FEC07B] sm:text-xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            &ldquo;Setiap tegukan adalah undangan untuk pulang — pada diri
            sendiri.&rdquo;
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            — Kopi Bintang, sejak 2021
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StorePhilosophy;
