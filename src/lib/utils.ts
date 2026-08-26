import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

const IDR_GROUP_SEPARATOR = '.';

export const formatIDR = (amount: number): string => {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  const grouped = safeAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, IDR_GROUP_SEPARATOR);
  return `Rp ${grouped}`;
};

const parseTimeToMinutes = (time: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time.trim());
  if (match === null) return null;
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

export const isStoreOpen = (openingTime: string, closingTime: string): boolean => {
  const openingMinutes = parseTimeToMinutes(openingTime);
  const closingMinutes = parseTimeToMinutes(closingTime);
  if (openingMinutes === null || closingMinutes === null) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (openingMinutes <= closingMinutes) {
    return currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
  }
  return currentMinutes >= openingMinutes || currentMinutes < closingMinutes;
};

export const COFFEE_PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  [
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'>",
    "<rect width='640' height='480' fill='#251910'/>",
    "<circle cx='320' cy='205' r='168' fill='#33241B'/>",
    "<path d='M320 94 L325.3 108.7 L340.9 109.2 L330.6 118.8 L332.9 133.8 L320 125 L307.1 133.8 L309.4 118.8 L299.1 109.2 L314.7 108.7 Z' fill='#FEC07B'/>",
    "<path d='M282 196 C274 184 290 176 282 164' fill='none' stroke='#FEC07B' stroke-width='6' stroke-linecap='round' opacity='0.55'/>",
    "<path d='M320 202 C312 188 328 180 320 162' fill='none' stroke='#FEC07B' stroke-width='6' stroke-linecap='round' opacity='0.85'/>",
    "<path d='M358 196 C350 184 366 176 358 164' fill='none' stroke='#FEC07B' stroke-width='6' stroke-linecap='round' opacity='0.55'/>",
    "<ellipse cx='320' cy='326' rx='120' ry='14' fill='#82541A' opacity='0.55'/>",
    "<ellipse cx='320' cy='322' rx='112' ry='12' fill='#FEC07B'/>",
    "<rect x='254' y='212' width='132' height='98' rx='22' fill='#FFF8F0'/>",
    "<path d='M386 232 C420 236 420 276 386 282' fill='none' stroke='#FFF8F0' stroke-width='11' stroke-linecap='round'/>",
    "<rect x='270' y='224' width='100' height='10' rx='5' fill='#EDE7E5'/>",
    "<text x='324' y='400' text-anchor='middle' font-family='Georgia, Times New Roman, serif' font-size='30' letter-spacing='8' fill='#FFF8F0'>KOPI BINTANG</text>",
    "<text x='323' y='432' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='13' letter-spacing='5' fill='#D2C4BD'>FOTO SEGERA TERSEDIA</text>",
    '</svg>'
  ].join(' ')
)}`;

export const getImageFallback = (url: string): string => {
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : COFFEE_PLACEHOLDER_IMAGE;
};
