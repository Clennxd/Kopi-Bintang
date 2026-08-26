import { useRef, useState, type FormEvent, type SyntheticEvent } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import {
  Coffee,
  Hash,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Trash2,
  TriangleAlert,
  UtensilsCrossed,
  X,
  type LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem, OrderType } from '../../types';
import { useCartContext } from '../../context/CartContext';
import { generateWhatsAppUrl } from '../../lib/whatsapp';
import {
  COFFEE_PLACEHOLDER_IMAGE,
  cn,
  formatIDR,
  getImageFallback
} from '../../lib/utils';
import ModalShell from '../ui/ModalShell';

interface OrderTypeOption {
  value: OrderType;
  label: string;
  icon: LucideIcon;
}

const ORDER_TYPE_OPTIONS: OrderTypeOption[] = [
  { value: 'Dine In', label: 'Makan di Tempat', icon: UtensilsCrossed },
  { value: 'Takeaway', label: 'Bungkus', icon: ShoppingBag }
];

const CONFETTI_COLORS = ['#251910', '#82541A', '#FEC07B', '#FFF8F0', '#D2C4BD'];

const fireCoffeeConfetti = (): void => {
  confetti({
    particleCount: 110,
    spread: 78,
    startVelocity: 42,
    origin: { y: 0.62 },
    colors: CONFETTI_COLORS
  });
  confetti({
    particleCount: 55,
    angle: 60,
    spread: 62,
    origin: { x: 0, y: 0.7 },
    colors: CONFETTI_COLORS
  });
  confetti({
    particleCount: 55,
    angle: 120,
    spread: 62,
    origin: { x: 1, y: 0.7 },
    colors: CONFETTI_COLORS
  });
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = COFFEE_PLACEHOLDER_IMAGE;
};

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeFromCart } = useCartContext();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 rounded-2xl border border-outline-variant/70 bg-background/70 p-3"
    >
      <img
        src={getImageFallback(item.menuItem.image_url)}
        alt={item.menuItem.name}
        onError={handleImageError}
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-bold">{item.menuItem.name}</h3>
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Hapus ${item.menuItem.name} dari keranjang`}
            className="shrink-0 rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-on-background/60">
          {item.size} · Gula {item.sugarLevel} · {item.iceLevel}
        </p>
        {item.note !== undefined && item.note.length > 0 && (
          <p className="mt-0.5 text-[11px] italic text-secondary">
            Catatan: {item.note}
          </p>
        )}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Kurangi jumlah item"
              onClick={() => updateQuantity(item.id, -1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-secondary hover:text-secondary"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
            <button
              type="button"
              aria-label="Tambah jumlah item"
              onClick={() => updateQuantity(item.id, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-secondary hover:text-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-primary">
            {formatIDR(item.itemPriceTotal)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const CartModal = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    clearCart,
    totalItemsCount,
    subtotal,
    taxAmount,
    grandTotal,
    showToast,
    storeSettings
  } = useCartContext();

  const [customerName, setCustomerName] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameFieldControls = useAnimationControls();

  const isNameInvalid = hasSubmitAttempt && customerName.trim().length === 0;

  const resetCheckoutForm = () => {
    setCustomerName('');
    setOrderType('Dine In');
    setTableNumber('');
    setOrderNotes('');
    setHasSubmitAttempt(false);
  };

  const handleBrowseMenu = () => {
    closeCart();
    window.setTimeout(() => {
      document
        .getElementById('menu-katalog')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Keranjang berhasil dikosongkan.');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const trimmedName = customerName.trim();
    if (trimmedName.length === 0) {
      setHasSubmitAttempt(true);
      await nameFieldControls.start({
        x: [0, -10, 10, -6, 6, 0],
        transition: { duration: 0.45 }
      });
      nameInputRef.current?.focus();
      return;
    }

    if (cart.length === 0) return;

    setIsSending(true);
    fireCoffeeConfetti();

    const whatsappUrl = generateWhatsAppUrl(
      cart,
      trimmedName,
      orderType,
      orderType === 'Dine In' && tableNumber.trim().length > 0
        ? tableNumber.trim()
        : undefined,
      orderNotes.trim().length > 0 ? orderNotes.trim() : undefined
    );

    if (whatsappUrl.length > 0) {
      const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (openedWindow === null) {
        window.location.href = whatsappUrl;
      }
    }

    clearCart();
    closeCart();
    resetCheckoutForm();
    setIsSending(false);
    showToast('Pesanan dikirim! Lanjutkan konfirmasi di WhatsApp ya.');
  };

  return (
    <ModalShell
      isOpen={isCartOpen}
      onClose={closeCart}
      labelledById="cart-modal-title"
      className="max-w-lg bg-[#FFFCF9]/90 backdrop-blur-2xl"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant/70 px-6 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
            <Coffee className="h-5 w-5" />
          </span>
          <div>
            <h2 id="cart-modal-title" className="font-display text-xl font-bold">
              Pesanan Anda
            </h2>
            <p className="text-xs text-on-background/55">
              {totalItemsCount > 0
                ? `${totalItemsCount} item siap diseduh`
                : 'Belum ada item'}{' '}
              · {storeSettings.store_name}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Tutup keranjang"
          className="rounded-full p-2 text-on-background/60 transition-colors hover:bg-surface-container-high hover:text-on-background"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container/40 ring-2 ring-secondary-container/60">
              <Sparkles className="h-9 w-9 text-on-secondary-container" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold">
                Keranjang Masih Kosong
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-on-background/60">
                Yuk pilih menu favoritmu dulu, nanti kami siapkan sepanci mungkin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBrowseMenu}
              className="inline-flex items-center gap-2 rounded-full bg-primary-container px-5 py-2.5 text-sm font-bold text-on-primary-container transition-colors hover:bg-primary"
            >
              <Sparkles className="h-4 w-4" />
              Jelajahi Menu
            </button>
          </div>
        ) : (
          <>
            <section aria-label="Daftar item keranjang" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-on-background/50">
                  Item Pesanan
                </p>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Kosongkan
                </button>
              </div>
              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </section>

            <form
              id="cart-checkout-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Form info pemesan"
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="customer-name-input"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Nama Pemesan <span className="text-red-500">*</span>
                </label>
                <motion.div animate={nameFieldControls}>
                  <input
                    ref={nameInputRef}
                    id="customer-name-input"
                    type="text"
                    value={customerName}
                    placeholder="Contoh: Rizky Pratama"
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                      if (event.target.value.trim().length > 0) {
                        setHasSubmitAttempt(false);
                      }
                    }}
                    className={cn(
                      'w-full rounded-2xl border bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:ring-2',
                      isNameInvalid
                        ? 'border-red-400 ring-2 ring-red-100 focus:border-red-500'
                        : 'border-outline-variant focus:border-secondary focus:ring-secondary-container/60'
                    )}
                  />
                </motion.div>
                <AnimatePresence>
                  {isNameInvalid && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-1.5"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
                        <TriangleAlert className="h-3.5 w-3.5" />
                        Nama pemesan wajib diisi ya.
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <fieldset>
                <legend className="mb-1.5 text-sm font-semibold">Tipe Pesanan</legend>
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={orderType === value}
                      onClick={() => setOrderType(value)}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                        orderType === value
                          ? 'border-primary-container bg-primary-container text-on-primary-container'
                          : 'border-outline-variant bg-background/60 text-on-background/75 hover:border-secondary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {orderType === 'Dine In' && (
                  <motion.div
                    key="table-number-field"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <label
                      htmlFor="table-number-input"
                      className="mb-1.5 block text-sm font-semibold"
                    >
                      Nomor Meja
                    </label>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-background/40" />
                      <input
                        id="table-number-input"
                        type="text"
                        inputMode="numeric"
                        value={tableNumber}
                        onChange={(event) => setTableNumber(event.target.value)}
                        placeholder="Contoh: 12"
                        className="w-full rounded-2xl border border-outline-variant bg-background/70 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-container/60"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="order-notes-textarea"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Catatan Pesanan{' '}
                  <span className="font-normal text-on-background/50">(opsional)</span>
                </label>
                <textarea
                  id="order-notes-textarea"
                  rows={2}
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder="Contoh: Sediakan paper bag buat dibawa pulang"
                  className="w-full resize-none rounded-2xl border border-outline-variant bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-container/60"
                />
              </div>

              <div className="space-y-2 rounded-2xl bg-surface-container-low p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-on-background/65">Subtotal</span>
                  <span className="font-semibold">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-background/65">Pajak PPN 10%</span>
                  <span className="font-semibold">{formatIDR(taxAmount)}</span>
                </div>
                <div className="my-1 border-t border-dashed border-outline-variant" />
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold">Grand Total</span>
                  <span className="font-display text-lg font-black text-primary">
                    {formatIDR(grandTotal)}
                  </span>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <footer className="shrink-0 border-t border-outline-variant/70 px-6 py-4">
          <motion.button
            type="submit"
            form="cart-checkout-form"
            disabled={isSending}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0B6E4F] via-[#1FA855] to-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/25 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-80"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyiapkan pesan...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Kirim Pesanan ke WhatsApp
              </>
            )}
          </motion.button>
          <p className="mt-2 text-center text-[11px] text-on-background/55">
            Pesanan terkirim sebagai chat WhatsApp ke barista{' '}
            {storeSettings.store_name}.
          </p>
        </footer>
      )}
    </ModalShell>
  );
};

export default CartModal;
