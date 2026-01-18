// store/ramadanStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  RamadanStore, 
  DailyProgress, 
  Goal, 
  QuranPlan,
  SalahProgress 
} from '../types/ramadan';
import { 
  getTodayDate, 
  calculateRamadanDay, 
  calculateOverallProgress,
  recalculateQuranPlan,
  getDefaultGoals
} from '../utils/ramadanCalculation'

const initialState = {
  userMode: 'guest' as const,
  onboardingComplete: false,
  goals: getDefaultGoals(),
  dailyProgress: {},
  dhikrProgress: {},
  settings: {
    remindersEnabled: true,
    reminderTimes: {
      morning: '08:00',
      beforeIftar: '18:00',
      night: '21:00'
    },
    autoAdjustOnMiss: true,
    startDate: '2025-02-18' // Update this to actual Ramadan start date
  }
};

export const useRamadanStore = create<RamadanStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Onboarding actions
      setUserMode: (mode) => set({ userMode: mode }),

      setGoals: (goals) => set({ goals }),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal]
      })),

      removeGoal: (goalId) => set((state) => ({
        goals: state.goals.filter(g => g.id !== goalId)
      })),

      toggleGoal: (goalId) => set((state) => ({
        goals: state.goals.map(g => 
          g.id === goalId ? { ...g, enabled: !g.enabled } : g
        )
      })),

      completeOnboarding: () => set({ onboardingComplete: true }),

      // Quran actions
      setQuranPlan: (plan) => set({ quranPlan: plan }),

      updateQuranProgress: (date, pagesRead) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const currentQuran = progress.habits.quran || { completed: false };
        
        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                quran: {
                  ...currentQuran,
                  pagesRead: (currentQuran.pagesRead || 0) + pagesRead
                }
              }
            }
          },
          quranPlan: state.quranPlan ? {
            ...state.quranPlan,
            totalCompleted: state.quranPlan.totalCompleted + pagesRead
          } : undefined
        };
      }),

      markQuranComplete: (date) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        
        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                quran: {
                  ...(progress.habits.quran || {}),
                  completed: true
                }
              },
              completedAt: new Date().toISOString()
            }
          }
        };
      }),

      // Salah actions
      toggleSalah: (date, prayer) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const currentSalah = progress.habits.salah || {
          fajr: false,
          zuhr: false,
          asr: false,
          maghrib: false,
          isha: false
        };

        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                salah: {
                  ...currentSalah,
                  [prayer]: !currentSalah[prayer]
                }
              }
            }
          }
        };
      }),

      // Taraweeh actions
      toggleTaraweeh: (date) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        
        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                taraweeh: !progress.habits.taraweeh
              }
            }
          }
        };
      }),

      // Custom habit actions
      toggleCustomHabit: (date, habitId) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const customHabits = progress.habits.custom || {};

        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                custom: {
                  ...customHabits,
                  [habitId]: !customHabits[habitId]
                }
              }
            }
          }
        };
      }),

      // Dhikr actions
      incrementDhikr: (date, count = 1) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const currentDhikr = progress.habits.dhikr || { completed: false, count: 0 };
        const newCount = currentDhikr.count + count;
        
        // Check if goal is met
        const dhikrGoal = state.goals.find(g => g.type === 'dhikr');
        const dailyTarget = dhikrGoal?.dailyTarget || 100;
        
        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...progress,
              habits: {
                ...progress.habits,
                dhikr: {
                  count: newCount,
                  completed: newCount >= dailyTarget
                }
              }
            }
          },
          dhikrProgress: {
            ...state.dhikrProgress,
            [date]: newCount
          }
        };
      }),

      resetDhikr: (date) => set((state) => ({
        dhikrProgress: {
          ...state.dhikrProgress,
          [date]: 0
        }
      })),

      // Settings actions
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),

      // Utility actions
      getTodayProgress: () => {
        const state = get();
        const today = getTodayDate();
        return state.dailyProgress[today] || { date: today, habits: {} };
      },

      getRamadanDay: () => {
        const state = get();
        return calculateRamadanDay(state.settings.startDate);
      },

      getOverallProgress: () => {
        const state = get();
        const ramadanDay = calculateRamadanDay(state.settings.startDate);
        return calculateOverallProgress(
          state.dailyProgress,
          state.goals,
          ramadanDay
        );
      },

      syncToAccount: async (userId) => {
        // This would sync localStorage data to backend
        set({ userMode: 'loggedIn', userId });
        
        // TODO: Implement actual API call
        console.log('Syncing to account:', userId);
      },

      reset: () => set(initialState)
    }),
    {
      name: 'ramadan-storage',
      // Only persist for guest users, logged-in users sync with backend
      partialize: (state) => ({
        userMode: state.userMode,
        onboardingComplete: state.onboardingComplete,
        goals: state.goals,
        quranPlan: state.quranPlan,
        dailyProgress: state.dailyProgress,
        dhikrProgress: state.dhikrProgress,
        settings: state.settings
      })
    }
  )
);