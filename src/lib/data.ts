import { Mosque, Prayer } from './types';
import masjidData from '../../public/assets/masjids-data-updated.json'
export const mosques: Mosque[] = masjidData 

export const getCurrentPrayer = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // This is a simplified approach and should be replaced with actual calculation  if (currntTime < '06:00') return 'Fajr';
  if (currentTime < '14:00') return 'Dhuhr';
  if (currentTime < '17:30') return 'Asr';
  if (currentTime < '20:00') return 'Maghrib';
  return 'Isha';
};

export const getNextPrayer = (): Prayer => {
  const current = getCurrentPrayer();

  if (!current) return 'Fajr';

  const prayerOrder: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const nextIndex = (prayerOrder.indexOf(current) + 1) % prayerOrder.length;
  return prayerOrder[nextIndex];
};


export const getMosqueById = (id: string): Mosque | undefined => {
  return mosques.find(mosque => mosque.id === id);
};

export const getMosquesByCity = (city: string): Mosque[] => {
  return mosques.filter(mosque => mosque.city.toLowerCase() === city.toLowerCase());
};

export const getAllCities = (): string[] => {
  const cities = new Set(mosques.map(mosque => mosque.city));
  return Array.from(cities);
};