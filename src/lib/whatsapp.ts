import type { CartItem, OrderType } from '../types';
import { formatIDR } from './utils';
import { DEFAULT_STORE_SETTINGS } from './supabase';

const TAX_RATE = 0.1;
const MESSAGE_DIVIDER = '-------------------------------';

export interface OrderTotals {
  subtotal: number;
  tax: number;
  total: number;
}

const resolveStoreName = (): string => {
  const envName = import.meta.env.VITE_STORE_NAME?.trim();
  if (envName !== undefined && envName.length > 0) return envName;
  return DEFAULT_STORE_SETTINGS.store_name;
};

const normalizePhoneNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
};

const resolveTargetNumber = (override?: string): string => {
  const candidate =
    override?.trim() ||
    import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ||
    DEFAULT_STORE_SETTINGS.whatsapp_number;
  return normalizePhoneNumber(candidate);
};

export const calculateOrderTotals = (cartItems: CartItem[]): OrderTotals => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemPriceTotal, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, tax, total: subtotal + tax };
};

const buildItemLines = (cartItems: CartItem[]): string[] =>
  cartItems.flatMap((item, index) => {
    const customizationSummary = [item.size, item.sugarLevel, item.iceLevel].join(
      ' • '
    );
    const lines = [
      `${index + 1}. ${item.menuItem.name}`,
      `   x${item.quantity} • ${customizationSummary}`,
      `   Subtotal: ${formatIDR(item.itemPriceTotal)}`
    ];
    if (item.note !== undefined && item.note.trim().length > 0) {
      lines.push(`   Catatan: ${item.note.trim()}`);
    }
    lines.push('');
    return lines;
  });

export const generateWhatsAppUrl = (
  cartItems: CartItem[],
  customerName: string,
  orderType: OrderType,
  tableNumber?: string,
  notes?: string,
  phoneNumber?: string
): string => {
  if (cartItems.length === 0) return '';

  const totals = calculateOrderTotals(cartItems);
  const storeName = resolveStoreName();

  const now = new Date();
  const dateLabel = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeLabel = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const trimmedTableNumber = tableNumber?.trim();
  const orderTypeLabel =
    orderType === 'Dine In' &&
    trimmedTableNumber !== undefined &&
    trimmedTableNumber.length > 0
      ? `Dine In (Meja ${trimmedTableNumber})`
      : orderType;

  const trimmedNotes = notes?.trim();

  const lines: string[] = [
    `*${storeName.toUpperCase()}*`,
    MESSAGE_DIVIDER,
    `Tanggal: ${dateLabel}, pukul ${timeLabel} WIB`,
    `Nama Pemesan: ${customerName.trim()}`,
    `Tipe Pesanan: ${orderTypeLabel}`,
    '',
    '*RINCIAN PESANAN*',
    ...buildItemLines(cartItems),
    '*RINGKASAN PEMBAYARAN*',
    `Subtotal: ${formatIDR(totals.subtotal)}`,
    `Pajak Restoran (10%): ${formatIDR(totals.tax)}`,
    `*TOTAL TAGIHAN: ${formatIDR(totals.total)}*`
  ];

  if (trimmedNotes !== undefined && trimmedNotes.length > 0) {
    lines.push('', `*Catatan Tambahan:* ${trimmedNotes}`);
  }

  lines.push(
    '',
    MESSAGE_DIVIDER,
    'Mohon balas pesan ini untuk mengonfirmasi pesanan Anda.',
    'Pesanan akan segera diproses setelah konfirmasi barista kami.',
    `Terima kasih sudah memesan di ${storeName}!`
  );

  const message = lines.join('\n');
  return `https://wa.me/${resolveTargetNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;
};
