import { Mosque } from './types';

export const mosques: Mosque[] = [
  {
    id: '1',
    name: 'Masjid Al-Noor',
    address: '123 Islamic Center Dr',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(555) 123-4567',
    email: 'info@masjidalnoor.org',
    website: 'https://www.masjidalnoor.org',
    location: {
      lat: 40.7128,
      lng: -74.006,
    },
    prayerTimes: {
      Fajr: '05:30',
      Dhuhr: '13:15',
      Asr: '16:45',
      Maghrib: '19:30',
      Isha: '21:00',
    },
    facilities: [
      { id: '1-1', name: 'Wudu Area', icon: 'droplets' },
      { id: '1-2', name: 'Women\'s Prayer Space', icon: 'users' },
      { id: '1-3', name: 'Library', icon: 'book-open' },
      { id: '1-4', name: 'Weekend School', icon: 'school' },
      { id: '1-5', name: 'Parking', icon: 'parking' },
      { id: '1-6', name: 'Wheelchair Access', icon: 'wheelchair' },
    ],
    images: [
      { 
        id: '1-1', 
        url: 'https://images.pexels.com/photos/2042759/pexels-photo-2042759.jpeg', 
        alt: 'Masjid Al-Noor exterior view',
        width: 1200,
        height: 800,
      },
      { 
        id: '1-2', 
        url: 'https://images.pexels.com/photos/6039242/pexels-photo-6039242.jpeg', 
        alt: 'Masjid Al-Noor prayer hall',
        width: 1200,
        height: 800,
      },
      { 
        id: '1-3', 
        url: 'https://images.pexels.com/photos/6039243/pexels-photo-6039243.jpeg', 
        alt: 'Masjid Al-Noor minaret',
        width: 800,
        height: 1200,
      },
      { 
        id: '1-4', 
        url: 'https://images.pexels.com/photos/2526122/pexels-photo-2526122.jpeg', 
        alt: 'Masjid Al-Noor courtyard',
        width: 1200,
        height: 800,
      },
    ],
    announcements: [
      {
        id: '1-1',
        title: 'Ramadan Prayer Schedule',
        content: 'Join us for Taraweeh prayers every night during Ramadan starting at 9:30 PM.',
        date: '2023-03-01',
        isImportant: true,
      },
      {
        id: '1-2',
        title: 'Friday Khutbah Speaker',
        content: 'This week\'s Jumu\'ah Khutbah will be delivered by Sheikh Ahmad Ali.',
        date: '2023-03-10',
      },
    ],
    description: 'Masjid Al-Noor is one of the oldest and largest Islamic centers in the city, serving the Muslim community since 1975. The mosque offers a wide range of services including daily prayers, educational programs, and community events.',
  },
  {
    id: '2',
    name: 'Islamic Center of Manhattan',
    address: '456 West 42nd St',
    city: 'New York',
    state: 'NY',
    zipCode: '10036',
    phone: '(555) 987-6543',
    email: 'contact@icm.org',
    website: 'https://www.icm.org',
    location: {
      lat: 40.7589,
      lng: -73.9851,
    },
    prayerTimes: {
      Fajr: '05:15',
      Dhuhr: '13:00',
      Asr: '17:00',
      Maghrib: '19:35',
      Isha: '21:15',
    },
    facilities: [
      { id: '2-1', name: 'Wudu Area', icon: 'droplets' },
      { id: '2-2', name: 'Women\'s Prayer Space', icon: 'users' },
      { id: '2-3', name: 'Community Hall', icon: 'users-2' },
      { id: '2-4', name: 'Bookstore', icon: 'book' },
      { id: '2-5', name: 'Childcare', icon: 'baby' },
    ],
    images: [
      { 
        id: '2-1', 
        url: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg', 
        alt: 'Islamic Center of Manhattan exterior',
        width: 1200,
        height: 800,
      },
      { 
        id: '2-2', 
        url: 'https://images.pexels.com/photos/5236208/pexels-photo-5236208.jpeg', 
        alt: 'Islamic Center of Manhattan prayer hall',
        width: 1200,
        height: 800,
      },
      { 
        id: '2-3', 
        url: 'https://images.pexels.com/photos/6039220/pexels-photo-6039220.jpeg', 
        alt: 'Islamic Center of Manhattan dome',
        width: 800,
        height: 1200,
      },
    ],
    announcements: [
      {
        id: '2-1',
        title: 'Community Iftar',
        content: 'Join us for a community iftar every Saturday during Ramadan.',
        date: '2023-03-05',
      },
      {
        id: '2-2',
        title: 'Eid Prayer',
        content: 'Eid prayer will be held at the Central Park at 8:00 AM and 9:30 AM.',
        date: '2023-04-20',
        isImportant: true,
      },
    ],
    description: 'The Islamic Center of Manhattan has been serving the Muslim community in Manhattan since 1990. The center provides a space for daily prayers, educational programs, and community events.',
  },
  {
    id: '3',
    name: 'Brooklyn Mosque',
    address: '789 Atlantic Ave',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11217',
    phone: '(555) 456-7890',
    email: 'info@brooklynmosque.org',
    website: 'https://www.brooklynmosque.org',
    location: {
      lat: 40.6782,
      lng: -73.9442,
    },
    prayerTimes: {
      Fajr: '05:45',
      Dhuhr: '13:30',
      Asr: '16:30',
      Maghrib: '19:25',
      Isha: '20:45',
    },
    facilities: [
      { id: '3-1', name: 'Wudu Area', icon: 'droplets' },
      { id: '3-2', name: 'Women\'s Prayer Space', icon: 'users' },
      { id: '3-3', name: 'Islamic School', icon: 'school' },
      { id: '3-4', name: 'Community Kitchen', icon: 'utensils' },
      { id: '3-5', name: 'Funeral Services', icon: 'heart-handshake' },
    ],
    images: [
      { 
        id: '3-1', 
        url: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg', 
        alt: 'Brooklyn Mosque exterior',
        width: 1200,
        height: 800,
      },
      { 
        id: '3-2', 
        url: 'https://images.pexels.com/photos/6578888/pexels-photo-6578888.jpeg', 
        alt: 'Brooklyn Mosque interior',
        width: 1200,
        height: 800,
      },
      { 
        id: '3-3', 
        url: 'https://images.pexels.com/photos/6578889/pexels-photo-6578889.jpeg', 
        alt: 'Brooklyn Mosque courtyard',
        width: 800,
        height: 1200,
      },
    ],
    announcements: [
      {
        id: '3-1',
        title: 'Islamic Classes',
        content: 'New Islamic classes for adults starting next month. Register now!',
        date: '2023-02-28',
      },
      {
        id: '3-2',
        title: 'Mosque Renovation',
        content: 'The mosque will be undergoing renovations from March 15-20. Prayers will be held in the community hall during this time.',
        date: '2023-03-10',
        isImportant: true,
      },
    ],
    description: 'Brooklyn Mosque is a vibrant community center serving the diverse Muslim population of Brooklyn. The mosque offers a range of services including daily prayers, educational programs, and community outreach.',
  },
  {
    id: '4',
    name: 'Queens Islamic Center',
    address: '321 Northern Blvd',
    city: 'Queens',
    state: 'NY',
    zipCode: '11101',
    phone: '(555) 789-0123',
    email: 'contact@qic.org',
    website: 'https://www.qic.org',
    location: {
      lat: 40.7505,
      lng: -73.9188,
    },
    prayerTimes: {
      Fajr: '05:20',
      Dhuhr: '13:10',
      Asr: '16:40',
      Maghrib: '19:30',
      Isha: '21:05',
    },
    facilities: [
      { id: '4-1', name: 'Wudu Area', icon: 'droplets' },
      { id: '4-2', name: 'Women\'s Prayer Space', icon: 'users' },
      { id: '4-3', name: 'Youth Center', icon: 'users-2' },
      { id: '4-4', name: 'Counseling Services', icon: 'heart' },
      { id: '4-5', name: 'Halal Food Pantry', icon: 'shopping-basket' },
    ],
    images: [
      { 
        id: '4-1', 
        url: 'https://images.pexels.com/photos/460740/pexels-photo-460740.jpeg', 
        alt: 'Queens Islamic Center exterior',
        width: 1200,
        height: 800,
      },
      { 
        id: '4-2', 
        url: 'https://images.pexels.com/photos/236148/pexels-photo-236148.jpeg', 
        alt: 'Queens Islamic Center prayer hall',
        width: 1200,
        height: 800,
      },
      { 
        id: '4-3', 
        url: 'https://images.pexels.com/photos/7048043/pexels-photo-7048043.jpeg', 
        alt: 'Queens Islamic Center classroom',
        width: 800,
        height: 1200,
      },
    ],
    announcements: [
      {
        id: '4-1',
        title: 'Quran Competition',
        content: 'Annual Quran competition for children will be held on March 25. Register by March 15.',
        date: '2023-03-01',
      },
      {
        id: '4-2',
        title: 'Food Drive',
        content: 'Monthly food drive this Sunday. Please bring non-perishable items to donate.',
        date: '2023-03-12',
      },
    ],
    description: 'Queens Islamic Center serves the diverse Muslim community of Queens with a focus on youth engagement and community outreach. The center offers daily prayers, educational programs, and social services.',
  },
  {
    id: '5',
    name: 'Bronx Muslim Community Center',
    address: '567 Grand Concourse',
    city: 'Bronx',
    state: 'NY',
    zipCode: '10451',
    phone: '(555) 234-5678',
    email: 'info@bronxmuslimcenter.org',
    website: 'https://www.bronxmuslimcenter.org',
    location: {
      lat: 40.8175,
      lng: -73.9204,
    },
    prayerTimes: {
      Fajr: '05:25',
      Dhuhr: '13:20',
      Asr: '16:50',
      Maghrib: '19:35',
      Isha: '21:10',
    },
    facilities: [
      { id: '5-1', name: 'Wudu Area', icon: 'droplets' },
      { id: '5-2', name: 'Women\'s Prayer Space', icon: 'users' },
      { id: '5-3', name: 'Community Garden', icon: 'flower' },
      { id: '5-4', name: 'Health Clinic', icon: 'stethoscope' },
      { id: '5-5', name: 'Sports Facilities', icon: 'dumbbell' },
    ],
    images: [
      { 
        id: '5-1', 
        url: 'https://images.pexels.com/photos/2325445/pexels-photo-2325445.jpeg', 
        alt: 'Bronx Muslim Community Center exterior',
        width: 1200,
        height: 800,
      },
      { 
        id: '5-2', 
        url: 'https://images.pexels.com/photos/1381833/pexels-photo-1381833.jpeg', 
        alt: 'Bronx Muslim Community Center interior',
        width: 1200,
        height: 800,
      },
      { 
        id: '5-3', 
        url: 'https://images.pexels.com/photos/1850021/pexels-photo-1850021.jpeg', 
        alt: 'Bronx Muslim Community Center garden',
        width: 800,
        height: 1200,
      },
    ],
    announcements: [
      {
        id: '5-1',
        title: 'Health Fair',
        content: 'Free health screenings available at our annual health fair on April 15.',
        date: '2023-03-20',
      },
      {
        id: '5-2',
        title: 'New Imam',
        content: 'We are pleased to welcome Sheikh Yusuf Ali as our new imam starting April 1.',
        date: '2023-03-25',
        isImportant: true,
      },
    ],
    description: 'Bronx Muslim Community Center focuses on serving the local community through health services, youth programs, and community engagement. The center offers daily prayers, educational programs, and social services.',
  },
];

export const getCurrentPrayer = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // This is a simplified approach and should be replaced with actual calculation
  if (currentTime < '06:00') return 'Fajr';
  if (currentTime < '14:00') return 'Dhuhr';
  if (currentTime < '17:30') return 'Asr';
  if (currentTime < '20:00') return 'Maghrib';
  return 'Isha';
};

export const getNextPrayer = () => {
  const current = getCurrentPrayer();
  
  switch (current) {
    case 'Fajr': return 'Dhuhr';
    case 'Dhuhr': return 'Asr';
    case 'Asr': return 'Maghrib';
    case 'Maghrib': return 'Isha';
    case 'Isha': return 'Fajr';
    default: return 'Fajr';
  }
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