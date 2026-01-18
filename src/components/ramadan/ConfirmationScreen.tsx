// components/ramadan/ConfirmationScreen.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRamadanStore } from '../../store/ramadanStore';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { goals, quranPlan, completeOnboarding } = useRamadanStore();

  const enabledGoals = goals.filter(g => g.enabled);

  const handleStart = () => {
    completeOnboarding();
    router.push('/ramadan/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">You're All Set!</h1>
          <p className="text-lg text-muted-foreground">
            Your Ramadan goals are ready
          </p>
        </div>

        {/* Goals Summary */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Your Ramadan Goals</h2>

          <div className="space-y-3">
            {/* Quran Plan */}
            {quranPlan && (
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Quran Reading</h3>
                  <p className="text-sm text-muted-foreground">
                    {quranPlan.dailyTarget} {quranPlan.unit} per day • Complete Quran {quranPlan.completionTarget}x
                  </p>
                </div>
              </div>
            )}

            {/* Other Goals */}
            {enabledGoals
              .filter(g => g.type !== 'quran')
              .map((goal) => (
                <div key={goal.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    {goal.dailyTarget && (
                      <p className="text-sm text-muted-foreground">
                        Target: {goal.dailyTarget} per day
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 text-center space-y-2">
          <p className="text-lg font-semibold">
            "Consistency matters more than perfection"
          </p>
          <p className="text-sm text-muted-foreground">
            Take it one day at a time. We're here to support you throughout Ramadan.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg"
        >
          Start Ramadan Dashboard
        </button>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>You can modify your goals anytime from settings</p>
          <p>Gentle reminders will help you stay on track</p>
        </div>
      </div>
    </div>
  );
}