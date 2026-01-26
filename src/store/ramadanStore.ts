// store/ramadanStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  RamadanStore,
  DailyProgress,
  Goal,
  QuranPlan,
  SalahProgress,
  DhikrType
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
    startDate: '2026-02-28' // Updated for 2025 Ramadan
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

      updateQuranProgress: (date, value) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const currentQuran = progress.habits.quran || { completed: false };
        const unit = state.quranPlan?.unit || 'pages';

        const newProgress = { ...currentQuran };
        if (unit === 'pages') newProgress.pagesRead = (newProgress.pagesRead || 0) + value;
        else if (unit === 'juz') newProgress.juzRead = (newProgress.juzRead || 0) + value;
        else if (unit === 'verses') newProgress.versesRead = (newProgress.versesRead || 0) + value;

        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: { ...progress, habits: { ...progress.habits, quran: newProgress } }
          },
          quranPlan: state.quranPlan ? {
            ...state.quranPlan,
            totalCompleted: state.quranPlan.totalCompleted + value
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
      addDhikrType: (type) => set((state) => {
        console.log('Adding Dhikr Type:', type);
        const DEFAULT_DHIKR_TYPES = [
          { id: 'subhanallah', name: 'SubhanAllah', target: 33 },
          { id: 'alhamdulillah', name: 'Alhamdulillah', target: 33 },
          { id: 'allahuakbar', name: 'Allahu Akbar', target: 34 }
        ];

        const dhikrGoalExists = state.goals.some(g => g.type === 'dhikr');
        let newGoals;

        if (dhikrGoalExists) {
          newGoals = state.goals.map(g => {
            if (g.type === 'dhikr') {
              const currentTypes = g.dhikrTypes || DEFAULT_DHIKR_TYPES;
              const newTypes = [...currentTypes, type];
              return {
                ...g,
                dhikrTypes: newTypes,
                dailyTarget: newTypes.reduce((acc, t) => acc + t.target, 0)
              };
            }
            return g;
          });
        } else {
          console.log('Creating new Dhikr goal');
          // Create new goal if missing
          const newGoal: Goal = {
            id: 'dhikr',
            type: 'dhikr',
            name: 'Daily Dhikr',
            enabled: true,
            dailyTarget: 100 + type.target,
            dhikrTypes: [...DEFAULT_DHIKR_TYPES, type]
          };
          newGoals = [...state.goals, newGoal];
        }

        return { goals: newGoals };
      }),

      incrementDhikr: (date, dhikrTypeId, count = 1) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };
        const currentDhikr = progress.habits.dhikr || { completed: false, totalCount: 0, counts: {} };

        const newCounts = { ...currentDhikr.counts };
        newCounts[dhikrTypeId] = (newCounts[dhikrTypeId] || 0) + count;

        const newTotalCount = currentDhikr.totalCount + count;

        // Find dhikr goal to check completion
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
                  ...currentDhikr,
                  counts: newCounts,
                  totalCount: newTotalCount,
                  completed: newTotalCount >= dailyTarget
                }
              }
            }
          },
          dhikrProgress: {
            ...state.dhikrProgress,
            [date]: newTotalCount
          }
        };
      }),

      resetDhikr: (date) => set((state) => {
        const progress = state.dailyProgress[date] || { date, habits: {} };

        const newDailyProgress = {
          ...state.dailyProgress,
          [date]: {
            ...progress,
            habits: {
              ...progress.habits,
              dhikr: {
                completed: false,
                totalCount: 0,
                counts: {}
              }
            }
          }
        };

        return {
          dailyProgress: newDailyProgress,
          dhikrProgress: {
            ...state.dhikrProgress,
            [date]: 0
          }
        };
      }),

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

      syncQuranProgress: (ayahsRead) => {
        const state = get();
        if (state.quranPlan?.unit === 'verses') {
          const today = getTodayDate();
          state.updateQuranProgress(today, ayahsRead);
        }
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