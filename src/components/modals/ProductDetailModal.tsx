import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  Minus,
  PenLine,
  Plus,
  ShoppingBag,
  Star,
  X
} from 'lucide-react';
import type { IceLevel, MenuItem, Size, SugarLevel } from '../../types';
import {
  LARGE_SIZE_UPCHARGE,
  calculateUnitPrice,
  useCartContext
} from '../../context/CartContext';
import { COFFEE_PLACEHOLDER_IMAGE, formatIDR } from '../../lib/utils';
import ModalShell from '../ui/ModalShell';

interface LabeledOption<T extends string> {
  value: T;
  label: string;
}

const SIZE_OPTIONS: LabeledOption<Size>[] = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Large', label: `Large (+${formatIDR(LARGE_SIZE_UPCHARGE)})` }
];

const SUGAR_OPTIONS: LabeledOption<SugarLevel>[] = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Less Sugar', label: 'Less Sugar' },
  { value: 'No Sugar', label: 'No Sugar' }
];

const ICE_OPTIONS: LabeledOption<IceLevel>[] = [
  { value: 'Normal Ice', label: 'Normal Ice' },
  { value: 'Less Ice', label: 'Less Ice' },
  { value: 'Hot', label: 'Hot' }
];

const MAX_QUANTITY = 20;
const ADD_TO_CART_FEEDBACK_MS = 600;

const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = COFFEE_PLACEHOLDER_IMAGE;
};

interface OptionGroupProps<T extends string> {
  label: string;
  options: LabeledOption<T>[];
  value: T;
  onChange: (nextValue: T) => void;
}

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange
}: OptionGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              option.value === value
                ? 'border-primary-container bg-primary-container text-on-primary-container'
                : 'border-outline-variant text-on-background hover:border-secondary hover:text-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const ProductDetailModal = () => {
  const {
    selectedProductForCustomization: product,
    closeProductModal,
    addToCart,
    showToast
  } = useCartContext();

  const [displayedProduct, setDisplayedProduct] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size>('Regular');
  const [selectedSugarLevel, setSelectedSugarLevel] = useState<SugarLevel>('Normal');
  const [selectedIceLevel, setSelectedIceLevel] = useState<IceLevel>('Normal Ice');
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    if (product === null) return;
    setDisplayedProduct(product);
    setSelectedSize('Regular');
    setSelectedSugarLevel('Normal');
    setSelectedIceLevel('Normal Ice');
    setQuantity(1);
    setNote('');
    setIsAdding(false);
  }, [product]);

  const isOpen = product !== null;
  const activeProduct = displayedProduct;
  const unitPrice =
    activeProduct !== null ? calculateUnitPrice(activeProduct.price, selectedSize) : 0;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (activeProduct === null || isAdding) return;
    setIsAdding(true);
    window.setTimeout(() => {
      addToCart({
        menuItem: activeProduct,
        quantity,
        size: selectedSize,
        sugarLevel: selectedSugarLevel,
        iceLevel: selectedIceLevel,
        note: note.trim().length > 0 ? note.trim() : undefined
      });
      setIsAdding(false);
      closeProductModal();
      showToast(`${activeProduct.name} (${quantity}x) masuk ke pesanan`);
    }, ADD_TO_CART_FEEDBACK_MS);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={closeProductModal}
      labelledById="product-modal-title"
      className="max-w-md bg-surface-container-low"
    >
      {activeProduct !== null && (
        <>
          <div className="relative h-48 shrink-0">
            <img
              src={activeProduct.image_url}
              alt={activeProduct.name}
              onError={handleImageError}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            <button
              type="button"
              onClick={closeProductModal}
              aria-label="Tutup detail produk"
              className="absolute right-3 top-3 rounded-full bg-primary/70 p-2 text-on-primary-container backdrop-blur transition-colors hover:bg-primary"
            >
              <X className="h-4 w-4" />
            </button>
            {activeProduct.is_signature && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary-container/90 px-3 py-1 text-xs font-semibold text-on-primary-container backdrop-blur">
                <Star className="h-3 w-3 fill-secondary-container text-secondary-container" />
                Signature
              </span>
            )}
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <h2
                id="product-modal-title"
                className="font-display text-2xl font-bold"
              >
                {activeProduct.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {activeProduct.tasting_notes.map((tastingNote) => (
                  <span
                    key={tastingNote}
                    className="rounded-full border border-outline-variant px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-secondary"
                  >
                    {tastingNote}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-on-background/70">
                {activeProduct.description}
              </p>
              <p className="mt-3 text-sm text-on-background/60">
                Harga dasar{' '}
                <span className="font-bold text-primary">
                  {formatIDR(activeProduct.price)}
                </span>
              </p>
            </div>

            <hr className="border-outline-variant/70" />

            <OptionGroup
              label="Ukuran Gelas"
              options={SIZE_OPTIONS}
              value={selectedSize}
              onChange={setSelectedSize}
            />
            <OptionGroup
              label="Takaran Gula"
              options={SUGAR_OPTIONS}
              value={selectedSugarLevel}
              onChange={setSelectedSugarLevel}
            />
            <OptionGroup
              label="Takaran Es"
              options={ICE_OPTIONS}
              value={selectedIceLevel}
              onChange={setSelectedIceLevel}
            />

            <div>
              <label
                htmlFor="product-note-input"
                className="mb-2 flex items-center gap-1.5 text-sm font-semibold"
              >
                <PenLine className="h-4 w-4 text-secondary" />
                Catatan Tambahan{' '}
                <span className="font-normal text-on-background/50">(opsional)</span>
              </label>
              <input
                id="product-note-input"
                type="text"
                value={note}
                maxLength={100}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setNote(event.target.value)
                }
                placeholder="Contoh: Gula pisah ya"
                className="w-full rounded-2xl border border-outline-variant bg-background/70 px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-container/60"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Jumlah</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Kurangi jumlah"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-display text-lg font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tambah jumlah"
                  onClick={() =>
                    setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))
                  }
                  disabled={quantity >= MAX_QUANTITY}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-outline-variant/70 px-6 py-4">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-container py-3.5 text-sm font-bold text-on-primary-container shadow-lg shadow-primary/25 transition-colors hover:bg-primary disabled:cursor-wait disabled:opacity-80"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menambahkan...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Tambah ke Pesanan — {formatIDR(totalPrice)}
                </>
              )}
            </motion.button>
          </div>
        </>
      )}
    </ModalShell>
  );
};

export default ProductDetailModal;
