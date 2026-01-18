// components/ramadan/HabitChecklist.tsx

'use client';

import React from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getTodayDate } from '../../utils/ramadanCalculation';
import { CheckCircle2, Circle } from 'lucide-react';
import { SalahProgress } from '../../types/ramadan';

export default function HabitChecklist() {
  const {
    goals,
    dailyProgress,
    toggleSalah,
    toggleTaraweeh,
    toggleCustomHabit
  } = useRamadanStore();

  const today = getTodayDate();
  const todayProgress = dailyProgress[today] || { date: today, habits: {} };

  const salahGoal = goals.find(g => g.type === 'salah' && g.enabled);
  const taraweehGoal = goals.find(g => g.type === 'taraweeh' && g.enabled);
  const customGoals = goals.filter(g => g.type === 'custom' && g.enabled);

  const salahPrayers: Array<keyof SalahProgress> = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'];
  
  const salahNames = {
    fajr: 'Fajr',
    zuhr: 'Zuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  };

  const handleSalahToggle = (prayer: keyof SalahProgress) => {
    toggleSalah(today, prayer);
  };

  const handleTaraweehToggle = () => {
    toggleTaraweeh(today);
  };

  const handleCustomToggle = (habitId: string) => {
    toggleCustomHabit(today, habitId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <span>📋</span>
        Daily Habits
      </h2>

      <div className="space-y-2">
        {/* Salah Checklist */}
        {salahGoal && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Salah</p>
            {salahPrayers.map((prayer) => {
              const isCompleted = todayProgress.habits.salah?.[prayer] || false;
              
              return (
                <button
                  key={prayer}
                  onClick={() => handleSalahToggle(prayer)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                    isCompleted
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted border border-transparent'
                  }`}
                >
                  <span className={`font-medium ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                    {salahNames[prayer]}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Taraweeh */}
        {taraweehGoal && (
          <div className="pt-2">
            <button
              onClick={handleTaraweehToggle}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                todayProgress.habits.taraweeh
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/50 hover:bg-muted border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🌙</span>
                <span className={`font-medium ${todayProgress.habits.taraweeh ? 'text-primary' : 'text-foreground'}`}>
                  Taraweeh
                </span>
              </div>
              {todayProgress.habits.taraweeh ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        )}

        {/* Custom Goals */}
        {customGoals.length > 0 && (
          <div className="pt-2 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Custom</p>
            {customGoals.map((goal) => {
              const isCompleted = todayProgress.habits.custom?.[goal.id] || false;
              
              return (
                <button
                  key={goal.id}
                  onClick={() => handleCustomToggle(goal.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                    isCompleted
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span className={`font-medium ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                      {goal.name}
                    </span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Completion Message */}
      {todayProgress.habits.salah && 
       Object.values(todayProgress.habits.salah).every(Boolean) && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
          <p className="text-sm text-primary font-semibold">
            ✨ All Salah completed! May Allah accept your prayers.
          </p>
        </div>
      )}
    </div>
  );
}