import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { MenuItem, StoreSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured: boolean =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

export type DataSource = 'supabase' | 'mock';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  store_name: 'Kopi Bintang',
  whatsapp_number: '6281234567890',
  address: 'Jl. Melati No. 12, Prawirotaman, Yogyakarta 55182',
  opening_time: '08:00',
  closing_time: '22:00',
  google_maps_url: 'https://maps.google.com/?q=Kopi+Bintang+Yogyakarta'
};

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'kopi-susu-bintang',
    name: 'Kopi Susu Bintang',
    category_slug: 'signature',
    description:
      'Espresso double shot dipadukan susu segar dan gula aren cair khas Bantul.',
    tasting_notes: ['Gula Aren', 'Creamy', 'Bold'],
    price: 22000,
    image_url: '/images/menu/kopi-susu-bintang.jpg',
    is_signature: true,
    is_available: true
  },
  {
    id: 'butterscotch-salt-latte',
    name: 'Butterscotch Sea Salt Latte',
    category_slug: 'signature',
    description:
      'Latte lembut dengan saus butterscotch rumahan dan taburan sea salt di atas foam.',
    tasting_notes: ['Manis Gurih', 'Caramel', 'Smooth'],
    price: 28000,
    image_url: '/images/menu/butterscotch-salt-latte.jpg',
    is_signature: true,
    is_available: true
  },
  {
    id: 'pandan-coconut-latte',
    name: 'Pandan Coconut Latte',
    category_slug: 'signature',
    description:
      'Perpaduan sirup pandan aromatik dan santan kelapa muda yang silky creamy.',
    tasting_notes: ['Pandan', 'Coconut', 'Silky'],
    price: 28000,
    image_url: '/images/menu/pandan-coconut-latte.jpg',
    is_signature: true,
    is_available: false
  },
  {
    id: 'americano',
    name: 'Americano',
    category_slug: 'classic',
    description:
      'Double shot espresso dengan air mineral panas, body tebal beraroma rempah.',
    tasting_notes: ['Bold', 'Earthy', 'Citrusy'],
    price: 18000,
    image_url: '/images/menu/americano.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category_slug: 'classic',
    description:
      'Espresso klasik dengan steamed milk dan lapisan microfoam yang tebal.',
    tasting_notes: ['Nutty', 'Velvety', 'Balanced'],
    price: 23000,
    image_url: '/images/menu/cappuccino.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'cafe-latte',
    name: 'Café Latte',
    category_slug: 'classic',
    description:
      'Espresso dengan steamed milk lebih banyak, lembut dan ramah untuk pemula.',
    tasting_notes: ['Milky', 'Gentle', 'Sweet'],
    price: 24000,
    image_url: '/images/menu/cafe-latte.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'mocha-bintang',
    name: 'Mocha Bintang',
    category_slug: 'classic',
    description:
      'Dark chocolate 70% asli dilelehkan bersama espresso dan susu steamed.',
    tasting_notes: ['Chocolate', 'Rich', 'Sweet'],
    price: 26000,
    image_url: '/images/menu/mocha-bintang.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category_slug: 'non-coffee',
    description:
      'Matcha ceremonial grade dikocok manual dengan chasen lalu dipadukan susu segar.',
    tasting_notes: ['Grassy', 'Umami', 'Smooth'],
    price: 26000,
    image_url: '/images/menu/matcha-latte.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'chocolate-bintang',
    name: 'Chocolate Bintang',
    category_slug: 'non-coffee',
    description:
      'Cokelat pekat khas Belanda disajikan hangat dengan marshmallow panggang.',
    tasting_notes: ['Chocolate', 'Toasty', 'Dessert'],
    price: 24000,
    image_url: '/images/menu/chocolate-bintang.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'red-velvet-latte',
    name: 'Red Velvet Latte',
    category_slug: 'non-coffee',
    description:
      'Red velvet creamy dengan lembutnya cream cheese foam di permukaan.',
    tasting_notes: ['Creamy', 'Sweet', 'Velvety'],
    price: 24000,
    image_url: '/images/menu/red-velvet-latte.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'butter-croissant',
    name: 'Butter Croissant',
    category_slug: 'pastry',
    description:
      'Croissant renyah berlapis butter premium Prancis, dipanggang setiap pagi.',
    tasting_notes: ['Flaky', 'Buttery', 'Warm'],
    price: 18000,
    image_url: '/images/menu/butter-croissant.jpg',
    is_signature: false,
    is_available: true
  },
  {
    id: 'choco-lava-cake',
    name: 'Choco Lava Cake',
    category_slug: 'pastry',
    description:
      'Cake cokelat lumer disajikan hangat bersama scooped vanilla ice cream.',
    tasting_notes: ['Molten', 'Rich', 'Warm'],
    price: 22000,
    image_url: '/images/menu/choco-lava-cake.jpg',
    is_signature: false,
    is_available: true
  }
];

export interface MenuResult {
  items: MenuItem[];
  source: DataSource;
}

export interface StoreSettingsResult {
  settings: StoreSettings;
  source: DataSource;
}

const delay = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const isMenuItemRow = (row: unknown): row is MenuItem => {
  if (typeof row !== 'object' || row === null) return false;
  const record = row as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.category_slug === 'string' &&
    typeof record.description === 'string' &&
    Array.isArray(record.tasting_notes) &&
    record.tasting_notes.every((note): note is string => typeof note === 'string') &&
    typeof record.price === 'number' &&
    typeof record.image_url === 'string' &&
    typeof record.is_signature === 'boolean' &&
    typeof record.is_available === 'boolean'
  );
};

const isStoreSettingsRow = (value: unknown): value is StoreSettings => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.store_name === 'string' &&
    typeof record.whatsapp_number === 'string' &&
    typeof record.address === 'string' &&
    typeof record.opening_time === 'string' &&
    typeof record.closing_time === 'string' &&
    typeof record.google_maps_url === 'string'
  );
};

export const fetchMenuItems = async (): Promise<MenuResult> => {
  if (supabase !== null) {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error === null && Array.isArray(data)) {
        const items = data.filter(isMenuItemRow);
        if (items.length > 0) {
          return { items, source: 'supabase' };
        }
      }
    } catch {
      return { items: DEFAULT_MENU_ITEMS, source: 'mock' };
    }
  }
  await delay(250);
  return { items: DEFAULT_MENU_ITEMS, source: 'mock' };
};

export const fetchStoreSettings = async (): Promise<StoreSettingsResult> => {
  if (supabase !== null) {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (error === null && isStoreSettingsRow(data)) {
        return { settings: data, source: 'supabase' };
      }
    } catch {
      return { settings: DEFAULT_STORE_SETTINGS, source: 'mock' };
    }
  }
  await delay(150);
  return { settings: DEFAULT_STORE_SETTINGS, source: 'mock' };
};
