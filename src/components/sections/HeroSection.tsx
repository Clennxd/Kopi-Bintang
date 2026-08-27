import { motion } from "framer-motion";
import { ArrowRight, Coffee, Star } from "lucide-react";

const HeroSection = (): JSX.Element => {
  const scrollToTarget = (targetId: string): void => {
    const element = document.getElementById(targetId);
    if (element !== null) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const selector = `#${targetId}`;
      document
        .querySelector(selector)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-label="Hero Kopi Bintang"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#FEF8F6] pt-24 sm:min-h-[88vh] sm:pt-20"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2070&auto=format&fit=crop"
          alt="Suasana hangat kedai Kopi Bintang"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#251910]/75 via-[#251910]/55 to-[#251910]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#251910]/60 via-transparent to-[#FEF8F6]/15" />
        <div className="absolute inset-0 bg-[#1D1B1A]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-[640px]">
          {/* Floating Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FEC07B] text-[#251910]">
              <Coffee className="h-4 w-4" />
            </span>
            <span className="tracking-wide">
              Artisanal Coffee & Roastery Sanctuary
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="mt-6 font-display text-[40px] font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-[56px]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Menikmati Kopi Asli,
            <br />
            <span className="font-normal italic text-[#FEC07B]">
              Dari Hati untuk
            </span>
            <br />
            Hari Anda
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-white/85 sm:text-base"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Kopi Bintang adalah ruang teduh bagi penikmat kopi asli Nusantara
            — tempat untuk fokus, rehat, atau berbagi cerita. Diseduh dengan
            teliti, disajikan dengan hati.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={() => scrollToTarget("tentang-kami")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#251910] px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-[#1D1B1A] hover:shadow-2xl hover:gap-3 sm:px-8"
            >
              Kenali Kedai Kami
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget("pilihan-kopi")}
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#251910] sm:px-8"
            >
              Jelajahi Menu Kopi
            </button>
          </motion.div>

          {/* Floating Rating Card - Mobile: below CTA, Desktop: anchored bottom-right relative? Spec says floating card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
              ease: "easeOut",
            }}
            className="mt-10 inline-flex max-w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_60px_rgba(37,25,16,0.18)] ring-1 ring-black/5 sm:mt-12 sm:px-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEC07B] text-[#82541A]">
              <Star className="h-5 w-5 fill-[#82541A] text-[#82541A]" />
            </span>
            <div className="text-left">
              <p className="flex items-center gap-1.5 text-sm font-bold text-[#1D1B1A]">
                Rating 4.9/5
                <span className="h-1 w-1 rounded-full bg-[#1D1B1A]/30" />
                <span className="font-medium text-[#82541A]">
                  2.000+ Pecinta Kopi Terpikat
                </span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#1D1B1A]/60">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-[#FEC07B] text-[#FEC07B]"
                    />
                  ))}
                </span>
                <span>di Google & Instagram</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative floating accent bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FEF8F6] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};

export default HeroSection;
