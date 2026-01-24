// components/ramadan/DhikrCounter.tsx

'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getTodayDate } from '../../utils/ramadanCalculation';
import { RotateCcw } from 'lucide-react';

interface DhikrCounterProps {
  compact?: boolean;
}

export default function DhikrCounter({ compact = false }: DhikrCounterProps) {
  const { goals, dailyProgress, incrementDhikr, resetDhikr } = useRamadanStore();
  
  const today = getTodayDate();
  const todayProgress = dailyProgress[today] || { date: today, habits: {} };
  const dhikrCount = todayProgress.habits.dhikr?.count || 0;
  
  const dhikrGoal = goals.find(g => (g.type as string) === 'dhikr' && g.enabled);
  const dailyTarget = dhikrGoal?.dailyTarget || 100;
  const isComplete = dhikrCount >= dailyTarget;
  const progress = Math.min((dhikrCount / dailyTarget) * 100, 100);

  const [selectedPreset, setSelectedPreset] = useState<string>('subhanallah');

  const presets = [
    { id: 'subhanallah', text: 'SubhanAllah', icon: '✨' },
    { id: 'alhamdulillah', text: 'Alhamdulillah', icon: '🤲' },
    { id: 'allahuakbar', text: 'Allahu Akbar', icon: '🌟' },
    { id: 'lailahaillallah', text: 'La ilaha illallah', icon: '☝️' }
  ];

  const handleIncrement = () => {
    incrementDhikr(today, 1);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset today\'s count?')) {
      resetDhikr(today);
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {dhikrCount} / {dailyTarget}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Counter Button */}
        <button
          onClick={handleIncrement}
          className="w-full bg-primary text-primary-foreground p-8 rounded-lg font-bold text-4xl hover:opacity-90 transition active:scale-95"
        >
          {dhikrCount}
        </button>

        {isComplete && (
          <div className="text-center text-sm text-primary font-semibold">
            ✓ Daily target achieved!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Dhikr Counter</h1>
          <p className="text-muted-foreground">
            Remember Allah throughout your day
          </p>
        </div>

        {/* Preset Selection */}
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedPreset === preset.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="font-semibold text-sm">{preset.text}</div>
            </button>
          ))}
        </div>

        {/* Main Counter */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Progress Circle */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 - (progress / 100) * (2 * Math.PI * 88)}
                  className="text-primary transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">
                    {dhikrCount}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    of {dailyTarget}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tap Counter Button */}
          <button
            onClick={handleIncrement}
            className="w-full bg-primary text-primary-foreground py-12 rounded-lg font-bold text-2xl hover:opacity-90 transition active:scale-95 shadow-lg"
          >
            Tap to Count
          </button>

          {/* Target Status */}
          {isComplete ? (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-primary font-semibold">
                ✨ Daily target achieved! Keep going for extra rewards.
              </p>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {dailyTarget - dhikrCount} more to reach your daily target
            </div>
          )}
        </div>

        {/* Quick Increment Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 10, 33, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => incrementDhikr(today, amount)}
              className="p-3 bg-card border border-border rounded-lg hover:bg-muted transition text-sm font-semibold"
            >
              +{amount}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full p-3 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/5 transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Count
        </button>

        {/* Info */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground text-center">
          Your count resets automatically at midnight
        </div>
      </div>
    </div>
  );
}