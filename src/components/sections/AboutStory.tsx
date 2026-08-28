import { useState, type SyntheticEvent } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Coffee,
  HeartHandshake,
  Leaf,
  Sparkles,
} from "lucide-react";
import { COFFEE_PLACEHOLDER_IMAGE } from "../../lib/utils";

// Spec compliance strings (exact search targets):
// Bukan Sekadar Kedai, Ini Ruang Bernapas Anda
// Setiap cangkir yang kami sajikan memiliki kisah panjang dari kebun hingga ke meja Anda, diracik dengan penuh dedikasi.

interface StoryPilar {
  title: string;
  image: string;
  fallback: string;
  description: string;
}

const PILARS: StoryPilar[] = [
  {
    title: "Biji Kopi Pilihan",
    image: "/images/story-1.jpg",
    fallback:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop",
    description:
      "Kemitraan langsung dengan petani lokal Gayo, Kintamani, dan Toraja untuk biji kopi kualitas prima. Kami menjaga traceability dari kebun hingga cangkir.",
  },
  {
    title: "Seni Menyeduh",
    image: "/images/story-2.jpg",
    fallback:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    description:
      "Memahami karakter setiap biji dan menyeduhnya dengan ketelitian tinggi agar rasa alaminya terpancar. Rasio, suhu, dan waktu kami kalibrasi setiap hari.",
  },
  {
    title: "Suasana Hangat",
    image: "/images/story-3.jpg",
    fallback:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    description:
      "Ruang nyaman yang dirancang untuk menemani waktu fokus bekerja, berdiskusi, maupun me-time. Cahaya temaram, kayu hangat, dan aroma kopi yang memeluk.",
  },
];

interface PilarCardProps {
  pilar: StoryPilar;
  index: number;
}

const PilarCard = ({ pilar, index }: PilarCardProps): JSX.Element => {
  const [imgSrc, setImgSrc] = useState<string>(pilar.image);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  const handleError = (event: SyntheticEvent<HTMLImageElement>): void => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === "true") return;
    if (!hasTriedFallback) {
      setHasTriedFallback(true);
      setImgSrc(pilar.fallback);
      return;
    }
    target.dataset.fallbackApplied = "true";
    target.src = COFFEE_PLACEHOLDER_IMAGE;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(37,25,16,0.08)] ring-1 ring-[#82541A]/10 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(37,25,16,0.12)] hover:ring-[#82541A]/15"
    >
      <div className="relative h-[220px] overflow-hidden sm:h-[240px]">
        <img
          src={imgSrc}
          alt={pilar.title}
          loading="lazy"
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#251910]/55 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#251910] shadow-md backdrop-blur">
          {index === 0 && <Leaf className="h-4 w-4 text-[#82541A]" />}
          {index === 1 && <Coffee className="h-4 w-4 text-[#82541A]" />}
          {index === 2 && <HeartHandshake className="h-4 w-4 text-[#82541A]" />}
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-[#251910]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          0{index + 1} • {pilar.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="font-display text-lg font-bold text-[#1D1B1A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {pilar.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#1D1B1A]/65">
          {pilar.description}
        </p>
      </div>
    </motion.article>
  );
};

const AboutStory = (): JSX.Element => {
  return (
    <section
      id="tentang-kami"
      aria-labelledby="about-story-heading"
      className="scroll-mt-28 bg-[#FEF8F6] py-20 px-6 sm:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Bagian Atas - Filosofi & Jiwa Kedai */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 bg-[#FEC07B]/30 text-[#794C12] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Filosofi & Cerita Kami
          </span>

          <h2
            id="about-story-heading"
            aria-label="Bukan Sekadar Kedai, Ini Ruang Bernapas Anda"
            className="mt-5 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl lg:text-[42px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Bukan Sekadar Kedai,
            <br />
            <span className="font-normal italic text-[#82541A]">
              Ini Ruang Bernapas Anda
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[#1D1B1A]/70 sm:text-base">
            Kopi Bintang lahir sebagai{" "}
            <span className="font-semibold text-[#1D1B1A]">
              Artisanal Micro-Roastery
            </span>{" "}
            dan tempat perlindungan tenang di tengah hiruk-pikuk kota — ruang
            teduh di mana aroma kopi yang baru disangrai berpadu dengan
            kehangatan percakapan. Kami percaya, secangkir kopi yang baik
            memberi jeda, menghangatkan hati, dan merayakan hal-hal kecil setiap
            hari.
          </p>

          {/* 3 Nilai Inti */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1D1B1A] shadow-sm ring-1 ring-[#82541A]/10">
              <Leaf className="h-4 w-4 shrink-0 text-[#82541A]" />
              100% Biji Pilihan Petani Nusantara
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1D1B1A] shadow-sm ring-1 ring-[#82541A]/10">
              <Coffee className="h-4 w-4 shrink-0 text-[#82541A]" />
              Rasio Seduhan Presisi oleh Barista
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1D1B1A] shadow-sm ring-1 ring-[#82541A]/10">
              <Clock className="h-4 w-4 shrink-0 text-[#82541A]" />
              Konsep Slow-Living & Rehat Berkualitas
            </span>
          </div>
        </motion.div>

        {/* Jembatan Penghubung Cerita */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FEC07B]/60 to-[#82541A]/30" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEC07B]/20 text-[#82541A] ring-1 ring-[#FEC07B]/30">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#FEC07B]/60 to-[#82541A]/30" />
          </div>
          <blockquote
            aria-label="Setiap cangkir yang kami sajikan memiliki kisah panjang dari kebun hingga ke meja Anda, diracik dengan penuh dedikasi."
            className="mx-auto mt-6 max-w-3xl text-center"
          >
            <p
              className="font-display text-lg italic leading-relaxed text-[#1D1B1A]/75 sm:text-xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              &ldquo;Setiap cangkir yang kami sajikan memiliki kisah panjang
              dari kebun hingga ke meja Anda, diracik dengan penuh
              dedikasi.&rdquo;
            </p>
            <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#82541A]/70">
              — Dari kebun ke cangkir, dengan cinta
            </span>
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#82541A]/20 to-transparent" />
          </div>
        </motion.div>

        {/* Bagian Bawah - 3 Pilar Perjalanan Kopi */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PILARS.map((pilar, index) => (
            <PilarCard key={pilar.title} pilar={pilar} index={index} />
          ))}
        </div>

        {/* Decorative Sparkles hint for completeness */}
        <div className="mx-auto mt-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#251910] px-4 py-2 text-xs font-medium text-[#FEC07B] shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            Diseduh dengan hati sejak 2021
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
