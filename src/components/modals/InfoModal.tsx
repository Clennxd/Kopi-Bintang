import { motion } from 'framer-motion';
import {
  Clock,
  Headphones,
  MapPin,
  MessageCircle,
  ScrollText,
  ShieldCheck,
  X,
  type LucideIcon
} from 'lucide-react';
import { useCartContext } from '../../context/CartContext';
import ModalShell from '../ui/ModalShell';

export type InfoTopic = 'privacy' | 'terms' | 'contact';

interface InfoSection {
  heading: string;
  body: string;
}

interface InfoContent {
  title: string;
  icon: LucideIcon;
  intro: string;
  sections: InfoSection[];
}

const INFO_CONTENT: Record<InfoTopic, InfoContent> = {
  privacy: {
    title: 'Kebijakan Privasi',
    icon: ShieldCheck,
    intro:
      'Privasi Anda penting bagi kami. Berikut ringkasan bagaimana Kopi Bintang menangani data Anda.',
    sections: [
      {
        heading: 'Data yang Kami Kumpulkan',
        body: 'Kami hanya meminta nama dan nomor meja untuk keperluan penyajian pesanan. Seluruh komunikasi berlangsung langsung melalui WhatsApp pribadi Anda.'
      },
      {
        heading: 'Penyimpanan Lokal',
        body: 'Keranjang belanja Anda disimpan di penyimpanan lokal peramban (localStorage) agar tidak hilang saat halaman dimuat ulang. Data ini tidak pernah dikirim ke server mana pun tanpa tindakan Anda sendiri.'
      },
      {
        heading: 'Tanpa Pembagian Data',
        body: 'Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga dalam bentuk apa pun.'
      }
    ]
  },
  terms: {
    title: 'Syarat & Ketentuan',
    icon: ScrollText,
    intro:
      'Dengan melakukan pesanan melalui aplikasi ini, Anda menyetujui ketentuan layanan berikut.',
    sections: [
      {
        heading: 'Konfirmasi Pesanan',
        body: 'Pesanan dianggap resmi setelah Anda mengonfirmasikannya di WhatsApp dan mendapat balasan dari barista kami.'
      },
      {
        heading: 'Pembayaran',
        body: 'Pembayaran dapat dilakukan secara tunai maupun QRIS saat pesanan diambil atau disajikan. Harga yang tertera sudah termasuk PPN 10%.'
      },
      {
        heading: 'Perubahan & Pembatalan',
        body: 'Perubahan atau pembatalan pesanan dapat dilakukan selama status pesanan belum diproses oleh bar.'
      },
      {
        heading: 'Ketersediaan Menu',
        body: 'Ketersediaan bahan baku dapat berubah sewaktu-waktu; barista kami akan menawarkan pengganti terbaik apabila menu favorit Anda habis.'
      }
    ]
  },
  contact: {
    title: 'Hubungi Admin',
    icon: Headphones,
    intro:
      'Ada pertanyaan, kritik, atau saran? Tim kami siap membantu Anda setiap hari operasional.',
    sections: []
  }
};

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: InfoTopic;
}

const InfoModal = ({ isOpen, onClose, topic = 'privacy' }: InfoModalProps) => {
  const { storeSettings } = useCartContext();
  const content = INFO_CONTENT[topic];
  const ContentIcon = content.icon;

  const adminWhatsAppUrl = `https://wa.me/${storeSettings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Halo Admin ${storeSettings.store_name}, saya ingin bertanya.`
  )}`;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledById={`info-modal-title-${topic}`}
      className="max-w-lg bg-surface-container-low"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant/70 px-6 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
            <ContentIcon className="h-5 w-5" />
          </span>
          <div>
            <h2
              id={`info-modal-title-${topic}`}
              className="font-display text-xl font-bold"
            >
              {content.title}
            </h2>
            <p className="text-xs text-on-background/55">{storeSettings.store_name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-2 text-on-background/60 transition-colors hover:bg-surface-container-high hover:text-on-background"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <p className="text-sm leading-relaxed text-on-background/75">{content.intro}</p>

        {content.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="text-sm font-bold text-primary">{section.heading}</h3>
            <p className="mt-1 text-sm leading-relaxed text-on-background/70">
              {section.body}
            </p>
          </section>
        ))}

        {topic === 'contact' && (
          <div className="space-y-3 rounded-2xl border border-outline-variant/70 bg-background/70 p-4 text-sm">
            <p className="flex items-center gap-2 text-on-background/75">
              <Clock className="h-4 w-4 shrink-0 text-secondary" />
              {storeSettings.opening_time}–{storeSettings.closing_time} WIB
            </p>
            <p className="flex items-start gap-2 text-on-background/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              {storeSettings.address}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <motion.a
                whileTap={{ scale: 0.96 }}
                href={adminWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-bold text-on-primary-container transition-colors hover:bg-primary"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Admin
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.96 }}
                href={storeSettings.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-xs font-bold text-secondary transition-colors hover:border-secondary"
              >
                <MapPin className="h-4 w-4" />
                Lihat di Google Maps
              </motion.a>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default InfoModal;
