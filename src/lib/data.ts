import { Mosque, Prayer } from './types';
import masjidData from '../../public/assets/masjids-data-updated.json'
export const mosques: Mosque[] = masjidData 

export function convert24To12Hour(time24: string): string {
  if (!/^\d{1,2}:\d{2}$/.test(time24)) return time24; // Return as is if format is invalid
  let [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
export const getCurrentPrayer = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // This is a simplified approach and should be replaced with actual calculation  if (currntTime < '06:00') return 'Fajr';
  if (convert24To12Hour(currentTime) < '6:45 AM') return 'Fajr';
  if (convert24To12Hour(currentTime) < '3:00 PM') return 'Zuhar';
  if (convert24To12Hour(currentTime) < '6:00 PM') return 'Asr';
  if (convert24To12Hour(currentTime) < '7:00 PM') return 'Maghrib';
  return 'Isha';
};

export const getNextPrayer = (timings: any): Prayer => {
  const now = new Date();
  const isFriday = now.getDay() === 5; // 5 = Friday
  const prayerOrder: Prayer[] = isFriday
    ? ['Fajr', 'Jummah', 'Asr', 'Maghrib', 'Isha']
    : ['Fajr', 'Zuhar', 'Asr', 'Maghrib', 'Isha'];
  const current = getCurrentPrayerFromTimings(timings, now);

  if (!current) return 'Fajr';

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

/**
 * Returns the current prayer name based on timings from Aladhan API and current time.
 * @param timings - timings object from Aladhan API (keys: Fajr, Dhuhr, Asr, Maghrib, Isha)
 * @param now - current Date object
 */
export function getCurrentPrayerFromTimings(timings: any, now: Date = new Date()): Prayer {
  if (!timings) return 'Fajr';
  const isFriday = now.getDay() === 5; // 5 = Friday
  const prayerOrder: Prayer[] = isFriday
    ? ['Fajr', 'Jummah', 'Asr', 'Maghrib', 'Isha']
    : ['Fajr', 'Zuhar', 'Asr', 'Maghrib', 'Isha'];
  const timingKeys = ['Fajr','Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const today = now;
  const prayerTimes = timingKeys.map((key, idx) => {
    const [h, m] = (timings[key] || '00:00').split(':').map(Number);
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
    return { key: prayerOrder[idx], date: d };
  });
  let current = prayerTimes[0];
  for (let i = 0; i < prayerTimes.length; i++) {
    if (now >= prayerTimes[i].date) {
      current = prayerTimes[i];
    }
  }
  return current.key;
}