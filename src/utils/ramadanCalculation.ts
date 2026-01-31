// utils/ramadanCalculations.ts

import { QuranPlan, DailyProgress, DhikrType, Goal, SalahProgress } from '../types/ramadan';

/**
 * Calculate daily Quran reading target
 */
/**
 * Calculate daily Quran reading target
 */
export function calculateDailyQuranTarget(
  completionTarget: number,
  unit: 'pages' | 'juz' | 'verses',
  ramadanDaysRemaining: number = 30
): number {
  const totalPages = 604;
  const totalJuz = 30;
  const totalVerses = 6236;

  if (unit === 'pages') {
    return Math.ceil((totalPages * completionTarget) / ramadanDaysRemaining);
  } else if (unit === 'juz') {
    return Math.ceil((totalJuz * completionTarget) / ramadanDaysRemaining);
  } else {
    return Math.ceil((totalVerses * completionTarget) / ramadanDaysRemaining);
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  goals: Goal[],
  ramadanDay: number
): number {
  if (ramadanDay === 0 || goals.length === 0) return 0;

  let totalPossible = 0;
  let totalCompletedValue = 0;

  // We calculate progress based on active goals across all days passed
  goals.filter(g => g.enabled).forEach(goal => {
    for (let i = 1; i <= ramadanDay; i++) {
      totalPossible += 1; // Each day each goal is 1 unit
    }
  });

  Object.entries(dailyProgress).forEach(([date, progress]) => {
    if (progress.habits.salah) {
      if (isSalahComplete(progress.habits.salah)) totalCompletedValue += 1;
      else {
        // Partial salah progress? Let's say 0.2 per prayer
        const salahCompletedCount = Object.values(progress.habits.salah).filter(Boolean).length;
        totalCompletedValue += (salahCompletedCount / 5);
      }
    }
    if (progress.habits.quran?.completed) totalCompletedValue += 1;
    if (progress.habits.taraweeh) totalCompletedValue += 1;
    if (progress.habits.dhikr?.completed) totalCompletedValue += 1;
    if (progress.habits.custom) {
      const customTotal = Object.values(progress.habits.custom).length;
      if (customTotal > 0) {
        const customCompleted = Object.values(progress.habits.custom).filter(Boolean).length;
        totalCompletedValue += (customCompleted / customTotal);
      }
    }
  });

  return totalPossible > 0 ? Math.min(Math.round((totalCompletedValue / totalPossible) * 100), 100) : 0;
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

  let totalTargetValue = 604;
  if (currentPlan.unit === 'juz') totalTargetValue = 30;
  else if (currentPlan.unit === 'verses') totalTargetValue = 6236;

  const remaining = (totalTargetValue * currentPlan.completionTarget) - currentPlan.totalCompleted;

  return {
    ...currentPlan,
    dailyTarget: Math.ceil(remaining / daysRemaining)
  };
}

/**
 * Check if all Salah prayers are completed
 */
export function isSalahComplete(salah?: SalahProgress): boolean {
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
      dhikrTypes: [
        { id: 'subhanallah', name: 'SubhanAllah', target: 33 },
        { id: 'alhamdulillah', name: 'Alhamdulillah', target: 33 },
        { id: 'allahuakbar', name: 'Allahu Akbar', target: 34 }
      ],
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