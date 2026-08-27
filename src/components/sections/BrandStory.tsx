import { useState, type SyntheticEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Coffee, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { COFFEE_PLACEHOLDER_IMAGE } from "../../lib/utils";

interface StoryCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  fallback: string;
  icon: LucideIcon;
  accent: string;
}

const STORY_CARDS: StoryCard[] = [
  {
    title: "Biji Kopi Pilihan",
    subtitle: "Dari Kebun ke Cangkir",
    description:
      "Kurasi biji single origin & blend house pilihan — disangrai dengan profil medium untuk menonjolkan karakter cokelat, karamel, dan buah.",
    image: "/images/story-1.jpg",
    fallback:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop",
    icon: Coffee,
    accent: "bg-[#FEC07B] text-[#82541A]",
  },
  {
    title: "Seni Menyeduh",
    subtitle: "Presisi & Jiwa",
    description:
      "Rasio, suhu, dan ritme tuang dijaga presisi. Barista kami meracik dengan hati — setiap cangkir adalah performa kecil yang jujur.",
    image: "/images/story-2.jpg",
    fallback:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    icon: Sparkles,
    accent: "bg-[#251910] text-[#FEC07B]",
  },
  {
    title: "Suasana Hangat",
    subtitle: "Ruang untuk Semua Cerita",
    description:
      "Cahaya temaram, kayu hangat, dan aroma kopi yang memeluk — tempat untuk bekerja, berbincang, atau sekadar diam dan bernapas.",
    image: "/images/story-3.jpg",
    fallback:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    icon: Users,
    accent: "bg-[#82541A] text-white",
  },
];

interface VisualCardProps {
  card: StoryCard;
  index: number;
}

const VisualCard = ({ card, index }: VisualCardProps): JSX.Element => {
  const [imgSrc, setImgSrc] = useState<string>(card.image);
  const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
    const target = event.currentTarget;
    if (hasTriedFallback) {
      target.src = COFFEE_PLACEHOLDER_IMAGE;
      return;
    }
    // First failure: try Unsplash fallback
    setHasTriedFallback(true);
    setImgSrc(card.fallback);
  };

  // If fallback also fails, use placeholder
  const handleFallbackError = (event: SyntheticEvent<HTMLImageElement>): void => {
    if (event.currentTarget.dataset.fallbackApplied === "true") return;
    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = COFFEE_PLACEHOLDER_IMAGE;
  };

  const onError = hasTriedFallback ? handleFallbackError : handleImageError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_40px_rgba(37,25,16,0.08)] ring-1 ring-[#82541A]/10 transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(37,25,16,0.15)]"
    >
      {/* Image */}
      <div className="relative h-[280px] overflow-hidden sm:h-[300px]">
        <img
          src={imgSrc}
          alt={card.title}
          loading="lazy"
          onError={onError}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#251910]/70 via-[#251910]/10 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

        {/* Floating number + icon */}
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${card.accent} shadow-md`}
          >
            <card.icon className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-[#251910] backdrop-blur">
            0{index + 1}
          </span>
        </div>

        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {card.subtitle}
          </p>
          <h3
            className="mt-1 font-display text-2xl font-bold leading-tight text-white"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {card.title}
          </h3>
        </div>

        {/* Hover arrow */}
        <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:bg-white group-hover:text-[#251910]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p
          className="text-sm leading-relaxed text-[#1D1B1A]/65"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {card.description}
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#82541A] transition-colors group-hover:text-[#251910]">
          <span>Lihat lebih dekat</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.article>
  );
};

const BrandStory = (): JSX.Element => {
  return (
    <section
      aria-labelledby="brand-story-heading"
      className="bg-[#FEF8F6] px-6 py-16 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#82541A]">
            Cerita Kami
          </p>
          <h2
            id="brand-story-heading"
            className="mt-3 font-display text-[30px] font-bold leading-tight text-[#1D1B1A] sm:text-4xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Dari Biji hingga
            <br />
            <span className="font-normal italic text-[#82541A]">
              Suasana yang Menghangatkan
            </span>
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed text-[#1D1B1A]/60 sm:text-[15px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Tiga babak kecil yang merangkai Kopi Bintang — dijahit dengan
            pelan, disajikan dengan hati.
          </p>
        </motion.div>

        {/* Grid 3 Kartu Visual */}
        <div className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {STORY_CARDS.map((card, index) => (
            <VisualCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
