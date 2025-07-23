export type Prayer = 'Fajr' | 'Zuhar' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah';

export type PrayerTimes = {
  [key in Prayer]: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface MosqueImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  locationURL?:string;
  website?: string;
  location?: {
    lat: string | null;
    lng: string | null;
  };
  prayerTimes: PrayerTimes;
  facilities: Facility[];
  images: MosqueImage[];
  announcements: Announcement[];
  description?: string;
}