// lib/prayer-times/cities.ts

import { City } from '@/types/prayer-times';

export const INDIAN_CITIES: City[] = [
    { name: 'Mumbai', slug: 'mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', state: 'Maharashtra' },
    { name: 'Delhi', slug: 'delhi', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata', state: 'Delhi' },
    { name: 'Bangalore', slug: 'bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', state: 'Karnataka' },
    { name: 'Bengaluru', slug: 'bengaluru', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', state: 'Karnataka' },
    { name: 'Hyderabad', slug: 'hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', state: 'Telangana' },
    { name: 'Ahmedabad', slug: 'ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', state: 'Gujarat' },
    { name: 'Chennai', slug: 'chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', state: 'Tamil Nadu' },
    { name: 'Kolkata', slug: 'kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', state: 'West Bengal' },
    { name: 'Pune', slug: 'pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', state: 'Maharashtra' },
    { name: 'Jaipur', slug: 'jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', state: 'Rajasthan' },
    { name: 'Lucknow', slug: 'lucknow', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', state: 'Uttar Pradesh' },
    { name: 'Mysore', slug: 'mysore', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', state: 'Karnataka' },
    { name: 'Mysuru', slug: 'mysuru', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', state: 'Karnataka' },
    { name: 'Surat', slug: 'surat', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata', state: 'Gujarat' },
    { name: 'Nagpur', slug: 'nagpur', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata', state: 'Maharashtra' },
    { name: 'Indore', slug: 'indore', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata', state: 'Madhya Pradesh' },
    { name: 'Bhopal', slug: 'bhopal', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata', state: 'Madhya Pradesh' },
    { name: 'Patna', slug: 'patna', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', state: 'Bihar' },
    { name: 'Vadodara', slug: 'vadodara', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata', state: 'Gujarat' },
    { name: 'Ghaziabad', slug: 'ghaziabad', latitude: 28.6692, longitude: 77.4538, timezone: 'Asia/Kolkata', state: 'Uttar Pradesh' },
    { name: 'Ludhiana', slug: 'ludhiana', latitude: 30.9010, longitude: 75.8573, timezone: 'Asia/Kolkata', state: 'Punjab' },
    { name: 'Agra', slug: 'agra', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata', state: 'Uttar Pradesh' },
];

export const getCityBySlug = (slug: string): City | undefined => {
    return INDIAN_CITIES.find((city) => city.slug === slug);
};

export const getAllCitySlugs = (): string[] => {
    return INDIAN_CITIES.map((city) => city.slug);
};
