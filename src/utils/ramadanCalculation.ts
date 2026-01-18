// utils/ramadanCalculations.ts

import { QuranPlan, DailyProgress } from '../types/ramadan';

/**
 * Calculate daily Quran reading target
 */
export function calculateDailyQuranTarget(
  completionTarget: number,
  unit: 'pages' | 'juz',
  ramadanDaysRemaining: number = 30
): number {
  const totalPages = 604;
  const totalJuz = 30;
  
  if (unit === 'pages') {
    return Math.ceil((totalPages * completionTarget) / ramadanDaysRemaining);
  } else {
    return Math.ceil((totalJuz * completionTarget) / ramadanDaysRemaining);
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Calculate Ramadan day number based on start date
 */
export function calculateRamadanDay(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.min(Math.max(diffDays + 1, 1), 30);
}

/**
 * Calculate overall progress percentage
 */
export function calculateOverallProgress(
  dailyProgress: Record<string, DailyProgress>,
  goals: any[],
  ramadanDay: number
): number {
  if (ramadanDay === 0 || goals.length === 0) return 0;
  
  let totalPossible = 0;
  let totalCompleted = 0;
  
  Object.entries(dailyProgress).forEach(([date, progress]) => {
    const habitsCount = Object.keys(progress.habits).length;
    totalPossible += habitsCount;
    
    // Count completed habits
    if (progress.habits.salah) {
      const salahCompleted = Object.values(progress.habits.salah).filter(Boolean).length;
      totalCompleted += salahCompleted;
    }
    if (progress.habits.quran?.completed) totalCompleted++;
    if (progress.habits.taraweeh) totalCompleted++;
    if (progress.habits.dhikr?.completed) totalCompleted++;
    if (progress.habits.custom) {
      totalCompleted += Object.values(progress.habits.custom).filter(Boolean).length;
    }
  });
  
  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
}

/**
 * Get days until Ramadan ends
 */
export function getDaysRemaining(startDate: string): number {
  const ramadanDay = calculateRamadanDay(startDate);
  return Math.max(30 - ramadanDay + 1, 0);
}

/**
 * Recalculate Quran plan based on remaining days
 */
export function recalculateQuranPlan(
  currentPlan: QuranPlan,
  startDate: string
): QuranPlan {
  const daysRemaining = getDaysRemaining(startDate);
  
  if (daysRemaining === 0) return currentPlan;
  
  const totalTarget = currentPlan.unit === 'pages' ? 604 : 30;
  const remaining = (totalTarget * currentPlan.completionTarget) - currentPlan.totalCompleted;
  
  return {
    ...currentPlan,
    dailyTarget: Math.ceil(remaining / daysRemaining)
  };
}

/**
 * Check if all Salah prayers are completed
 */
export function isSalahComplete(salah?: any): boolean {
  if (!salah) return false;
  return salah.fajr && salah.zuhr && salah.asr && salah.maghrib && salah.isha;
}

/**
 * Get streak count (consecutive days with activity)
 */
export function getStreak(dailyProgress: Record<string, DailyProgress>): number {
  const sortedDates = Object.keys(dailyProgress).sort().reverse();
  let streak = 0;
  
  for (const date of sortedDates) {
    const progress = dailyProgress[date];
    const hasActivity = Object.values(progress.habits).some(habit => {
      if (typeof habit === 'boolean') return habit;
      if (typeof habit === 'object' && habit !== null) {
        return Object.values(habit).some(v => v === true);
      }
      return false;
    });
    
    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Format time for display
 */
export function formatRamadanDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Generate default goals
 */
export function getDefaultGoals() {
  return [
    {
      id: 'salah',
      type: 'salah' as const,
      name: 'Pray 5 Daily Salah',
      enabled: true
    },
    {
      id: 'quran',
      type: 'quran' as const,
      name: 'Read Quran Daily',
      enabled: true
    },
    {
      id: 'dhikr',
      type: 'dhikr' as const,
      name: 'Daily Dhikr',
      dailyTarget: 100,
      enabled: true
    },
    {
      id: 'taraweeh',
      type: 'taraweeh' as const,
      name: 'Taraweeh',
      enabled: true
    }
  ];
}