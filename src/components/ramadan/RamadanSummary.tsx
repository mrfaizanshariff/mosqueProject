// components/ramadan/RamadanSummary.tsx

'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getStreak, isSalahComplete } from '../../utils/ramadanCalculation';
import { Download, Heart, BookOpen, CheckCircle2 } from 'lucide-react';

export default function RamadanSummary() {
  const { dailyProgress, quranPlan, goals } = useRamadanStore();
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);

  // Calculate stats
  const totalDays = Object.keys(dailyProgress).length;
  const streak = getStreak(dailyProgress);
  
  let totalQuranPages = 0;
  let salahConsistency = 0;
  let totalDhikr = 0;
  let taraweehCount = 0;

  Object.values(dailyProgress).forEach((day) => {
    if (day.habits.quran?.pagesRead) {
      totalQuranPages += day.habits.quran.pagesRead;
    }
    if (day.habits.salah && isSalahComplete(day.habits.salah)) {
      salahConsistency++;
    }
    if (day.habits.dhikr?.count) {
      totalDhikr += day.habits.dhikr.count;
    }
    if (day.habits.taraweeh) {
      taraweehCount++;
    }
  });

  const salahPercent = totalDays > 0 ? Math.round((salahConsistency / totalDays) * 100) : 0;

  const handleDownload = () => {
    // Create downloadable summary
    const summaryText = `
🌙 My Ramadan 2025 Journey

📊 Summary:
- Active Days: ${totalDays}/30
- Longest Streak: ${streak} days
- Quran Pages Read: ${totalQuranPages}
- Salah Consistency: ${salahPercent}%
- Total Dhikr: ${totalDhikr}
- Taraweeh Prayers: ${taraweehCount}

💭 Reflection:
${reflection || 'No reflection written'}

Generated from Mosque of India - Ramadan Companion
    `.trim();

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ramadan-2025-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold">Your Ramadan Reflection</h1>
          <p className="text-xl text-muted-foreground">
            Alhamdulillah, you've completed this blessed month
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Active Days */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalDays}
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
            <div className="text-xs text-muted-foreground mt-1">out of 30</div>
          </div>

          {/* Streak */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">
              {streak}
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
            <div className="text-xs text-muted-foreground mt-1">longest</div>
          </div>

          {/* Quran */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <div className="text-4xl font-bold text-primary">
                {totalQuranPages}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Quran Pages Read</div>
            {quranPlan && (
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((totalQuranPages / (604 * quranPlan.completionTarget)) * 100)}% of goal
              </div>
            )}
          </div>

          {/* Salah */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">
              {salahPercent}%
            </div>
            <div className="text-sm text-muted-foreground">Salah Consistency</div>
            <div className="text-xs text-muted-foreground mt-1">
              {salahConsistency} complete days
            </div>
          </div>

          {/* Dhikr */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalDhikr.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Dhikr</div>
            <div className="text-xs text-muted-foreground mt-1">throughout Ramadan</div>
          </div>

          {/* Taraweeh */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">
              {taraweehCount}
            </div>
            <div className="text-sm text-muted-foreground">Taraweeh Prayers</div>
            <div className="text-xs text-muted-foreground mt-1">nights attended</div>
          </div>
        </div>

        {/* Reflection Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Personal Reflection</h2>
          <p className="text-muted-foreground">
            What's one thing you're grateful for this Ramadan?
          </p>

          {!showReflection ? (
            <button
              onClick={() => setShowReflection(true)}
              className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition"
            >
              Write your reflection
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full min-h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                autoFocus
              />
              {reflection && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reflection saved</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Summary
          </button>

          <button
            onClick={() => {/* Navigate to continue habits */}}
            className="w-full border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/5 transition"
          >
            Continue These Habits
          </button>
        </div>

        {/* Closing Message */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center space-y-2">
          <p className="text-lg font-semibold text-primary">
            May Allah accept your efforts and grant you His mercy.
          </p>
          <p className="text-sm text-muted-foreground">
            "The best of you are those who learn the Quran and teach it." - Prophet Muhammad ﷺ
          </p>
        </div>
      </div>
    </div>
  );
}