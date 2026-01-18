// components/ramadan/QuranPlanner.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRamadanStore } from '../../store/ramadanStore';
import { calculateDailyQuranTarget } from '../../utils/ramadanCalculation';
import { BookOpen } from 'lucide-react';

export default function QuranPlanner() {
  const router = useRouter();
  const { setQuranPlan, settings } = useRamadanStore();
  
  const [completionTarget, setCompletionTarget] = useState(1);
  const [unit, setUnit] = useState<'pages' | 'juz'>('pages');
  const [preferredTime, setPreferredTime] = useState<'fajr' | 'night' | 'anytime'>('anytime');
  const [customTarget, setCustomTarget] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const dailyTarget = calculateDailyQuranTarget(
    showCustom ? parseFloat(customTarget) || 1 : completionTarget,
    unit,
    30
  );

  const handleSave = () => {
    const plan = {
      completionTarget: showCustom ? parseFloat(customTarget) || 1 : completionTarget,
      unit,
      dailyTarget,
      totalCompleted: 0,
      preferredTime
    };

    setQuranPlan(plan);
    router.push('/ramadan/setup/configure');
  };

  const getTotalTarget = () => {
    const target = showCustom ? parseFloat(customTarget) || 1 : completionTarget;
    if (unit === 'pages') {
      return Math.round(604 * target);
    } else {
      return Math.round(30 * target);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Quran Reading Plan
          </h1>
          <p className="text-muted-foreground">
            Let's create your personalized reading schedule
          </p>
        </div>

        {/* Completion Target */}
        <div className="space-y-4">
          <label className="block font-semibold text-foreground">
            Completion Target
          </label>
          
          {!showCustom ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((target) => (
                <button
                  key={target}
                  onClick={() => setCompletionTarget(target)}
                  className={`p-4 rounded-lg border-2 transition ${
                    completionTarget === target
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <div className="text-2xl font-bold text-foreground">
                    {target}x
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Complete Quran
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                placeholder="Enter custom target (e.g., 0.5 for half)"
                className="w-full px-4 py-3 bg-background border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.1"
                min="0.1"
                autoFocus
              />
            </div>
          )}

          <button
            onClick={() => {
              setShowCustom(!showCustom);
              if (showCustom) setCustomTarget('');
            }}
            className="text-sm text-primary hover:underline"
          >
            {showCustom ? 'Choose preset target' : 'Set custom target'}
          </button>
        </div>

        {/* Reading Unit */}
        <div className="space-y-4">
          <label className="block font-semibold text-foreground">
            Reading Unit
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUnit('pages')}
              className={`p-4 rounded-lg border-2 transition ${
                unit === 'pages'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted'
              }`}
            >
              <div className="font-semibold text-foreground">Pages</div>
              <div className="text-xs text-muted-foreground mt-1">
                604 pages total
              </div>
            </button>

            <button
              onClick={() => setUnit('juz')}
              className={`p-4 rounded-lg border-2 transition ${
                unit === 'juz'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted'
              }`}
            >
              <div className="font-semibold text-foreground">Juz</div>
              <div className="text-xs text-muted-foreground mt-1">
                30 juz total
              </div>
            </button>
          </div>
        </div>

        {/* Preferred Time */}
        <div className="space-y-4">
          <label className="block font-semibold text-foreground">
            Preferred Reading Time <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'fajr', label: 'After Fajr', icon: '🌅' },
              { value: 'night', label: 'At Night', icon: '🌙' },
              { value: 'anytime', label: 'Anytime', icon: '⏰' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPreferredTime(option.value as any)}
                className={`p-4 rounded-lg border-2 transition ${
                  preferredTime === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted'
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-semibold text-foreground">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Plan Preview */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Daily Plan
          </h3>
          <p className="text-2xl font-bold text-primary">
            {dailyTarget} {unit === 'pages' ? 'pages' : 'juz'} per day
          </p>
          <p className="text-sm text-muted-foreground">
            Total target: {getTotalTarget()} {unit} over 30 days
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            Save & Continue
          </button>

          <button
            onClick={() => router.push('/ramadan/setup/configure')}
            className="w-full text-muted-foreground hover:text-foreground transition"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}