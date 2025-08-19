'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { getCurrentPrayerFromTimings, getNextPrayer } from '../lib/data';
import { CityProvider, useCity } from './CityContext';

interface PrayerTimingsContextType {
  timings: any;
  currentPrayer: string;
  nextPrayer: string;
  loading: boolean;
  error: string | null;
}

const PrayerTimingsContext = createContext<PrayerTimingsContextType | undefined>(undefined);

export const PrayerTimingsProvider = ({ children }: { children: ReactNode }) => {
  const [timings, setTimings] = useState<any>(null);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { city } = useCity();
  const [debouncedCity, setDebouncedCity] = useState(city);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce city changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedCity(city);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [city]);

  useEffect(() => {
    const fetchTimings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(debouncedCity)}&country=India&method=1`);
        const data = await res.json();
        setTimings(data.data.timings);
        setCurrentPrayer(getCurrentPrayerFromTimings(data.data.timings));
        setNextPrayer(getNextPrayer(data.data.timings));
      } catch (err: any) {
        setError('Failed to fetch prayer timings');
      } finally {
        setLoading(false);
      }
    };
    fetchTimings();
    const interval = setInterval(() => {
      fetchTimings();
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [debouncedCity]);

  return (
    <PrayerTimingsContext.Provider value={{ timings, currentPrayer, nextPrayer, loading, error }}>
      {children}
    </PrayerTimingsContext.Provider>
  );
};

export function usePrayerTimings() {
  const context = useContext(PrayerTimingsContext);
  if (!context) {
    throw new Error('usePrayerTimings must be used within a PrayerTimingsProvider');
  }
  return context;
}
