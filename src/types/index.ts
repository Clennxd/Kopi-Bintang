export type Size = 'Regular' | 'Large';
export type SugarLevel = 'Normal' | 'Less Sugar' | 'No Sugar';
export type IceLevel = 'Normal Ice' | 'Less Ice' | 'Hot';
export type OrderType = 'Dine In' | 'Takeaway';

export interface MenuItem {
  id: string;
  name: string;
  category_slug: string;
  description: string;
  tasting_notes: string[];
  price: number;
  image_url: string;
  is_signature: boolean;
  is_available: boolean;
}

export interface CustomizationOptions {
  size: Size;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  size: Size;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  itemPriceTotal: number;
  note?: string;
}

export interface StoreSettings {
  store_name: string;
  whatsapp_number: string;
  address: string;
  opening_time: string;
  closing_time: string;
  google_maps_url: string;
}
