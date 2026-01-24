'use client';

import React from 'react';
import { useQuranProgressStore } from '../../store/quranProgressStore';
import { BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ProgressStats() {
  const { totalAyahsRead, completedSurahs, getOverallProgress } =
    useQuranProgressStore();

  const overallProgress = getOverallProgress();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Overall Progress Bar */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Your Quran Journey</h3>
          <span className="text-2xl font-bold text-primary">
            {overallProgress}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {overallProgress === 0
            ? 'Start your journey today'
            : overallProgress === 100
            ? 'Alhamdulillah! You have completed the Quran'
            : `Keep going! You're ${overallProgress}% through the Quran`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completed Surahs */}
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {completedSurahs}
            </p>
            <p className="text-sm text-muted-foreground">
              Surahs Completed
            </p>
          </div>
        </div>

        {/* Total Ayahs Read */}
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {totalAyahsRead.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Ayahs Read
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {completedSurahs > 0
                ? `${Math.round((completedSurahs / 114) * 100)}%`
                : '0%'}
            </p>
            <p className="text-sm text-muted-foreground">
              of 114 Surahs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}