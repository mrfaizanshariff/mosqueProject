// types/ramadan.ts

export type GoalType = 'salah' | 'quran' | 'dhikr' | 'taraweeh' | 'custom';

export type Goal = {
  id: string;
  type: GoalType;
  name: string;
  dailyTarget?: number;
  enabled: boolean;
  reminderEnabled?: boolean;
};

export type QuranPlan = {
  completionTarget: number; // 1x, 2x, or custom
  unit: 'pages' | 'juz';
  dailyTarget: number;
  totalCompleted: number;
  preferredTime?: 'fajr' | 'night' | 'anytime';
};

export type SalahProgress = {
  fajr: boolean;
  zuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

export type DailyProgress = {
  date: string; // ISO format: YYYY-MM-DD
  habits: {
    salah?: SalahProgress;
    quran?: {
      completed: boolean;
      pagesRead?: number;
      juzRead?: number;
    };
    taraweeh?: boolean;
    dhikr?: {
      completed: boolean;
      count: number;
    };
    custom?: Record<string, boolean>;
  };
  completedAt?: string; // ISO timestamp
};

export type ReminderTimes = {
  morning?: string; // HH:MM format
  beforeIftar?: string;
  night?: string;
};

export type RamadanSettings = {
  remindersEnabled: boolean;
  reminderTimes: ReminderTimes;
  autoAdjustOnMiss: boolean; // Recalculate plan on missed days
  startDate: string; // Ramadan start date
};

export type CommunityStats = {
  totalUsers: number;
  quranGoalCompleted: number;
  consistencyRate: number;
  lastUpdated: string;
};

export type RamadanState = {
  userMode: 'guest' | 'loggedIn';
  userId?: string;
  onboardingComplete: boolean;
  goals: Goal[];
  quranPlan?: QuranPlan;
  dailyProgress: Record<string, DailyProgress>;
  dhikrProgress: Record<string, number>; // Date -> count
  settings: RamadanSettings;
  communityStats?: CommunityStats;
};

// Actions for Zustand
export type RamadanActions = {
  // Onboarding
  setUserMode: (mode: 'guest' | 'loggedIn') => void;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (goalId: string) => void;
  toggleGoal: (goalId: string) => void;
  
  // Quran
  setQuranPlan: (plan: QuranPlan) => void;
  updateQuranProgress: (date: string, pagesRead: number) => void;
  markQuranComplete: (date: string) => void;
  
  // Daily habits
  toggleSalah: (date: string, prayer: keyof SalahProgress) => void;
  toggleTaraweeh: (date: string) => void;
  toggleCustomHabit: (date: string, habitId: string) => void;
  
  // Dhikr
  incrementDhikr: (date: string, count?: number) => void;
  resetDhikr: (date: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<RamadanSettings>) => void;
  
  // Utility
  completeOnboarding: () => void;
  getTodayProgress: () => DailyProgress;
  getRamadanDay: () => number;
  getOverallProgress: () => number;
  syncToAccount: (userId: string) => Promise<void>;
  reset: () => void;
};

export type RamadanStore = RamadanState & RamadanActions;