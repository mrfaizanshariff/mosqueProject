// components/ramadan/DailyDashboard.tsx

'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getTodayDate, formatRamadanDate } from '../../utils/ramadanCalculation';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Menu
} from 'lucide-react';
import HabitChecklist from './HabitCheckList';
import DhikrCounter from './DhikrCounter';
import Link from 'next/link';

export default function DailyDashboard() {
  const [showDhikrCounter, setShowDhikrCounter] = useState(false);
  
  const {
    quranPlan,
    dailyProgress,
    goals,
    getRamadanDay,
    getOverallProgress,
    markQuranComplete
  } = useRamadanStore();

  const today = getTodayDate();
  const ramadanDay = getRamadanDay();
  const overallProgress = getOverallProgress();
  const todayProgress = dailyProgress[today] || { date: today, habits: {} };
  const quranCompleted = todayProgress.habits.quran?.completed || false;

  // Calculate progress ring
  const progressPercent = overallProgress;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleMarkQuranDone = () => {
    markQuranComplete(today);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Ramadan Day {ramadanDay}</h1>
              <p className="text-sm opacity-90">{formatRamadanDate(today)}</p>
            </div>
            <button className="p-2 hover:bg-primary-foreground/10 rounded-lg transition">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Overall Progress Ring */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-primary-foreground/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-secondary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{progressPercent}%</div>
                  <div className="text-xs opacity-75">Overall</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-4">
        {/* Today's Quran Plan */}
        {quranPlan && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Today's Quran</h2>
                  <p className="text-sm text-muted-foreground">
                    {quranPlan.dailyTarget} {quranPlan.unit} target
                  </p>
                </div>
              </div>
              {quranCompleted && (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              )}
            </div>

            {!quranCompleted ? (
              <div className="flex gap-2">
                <button
                  onClick={handleMarkQuranDone}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Mark as Done
                </button>
                <button
                  onClick={() => {/* Navigate to Quran reader */}}
                  className="px-4 py-3 border border-border rounded-lg hover:bg-muted transition"
                >
                  Read Now
                </button>
              </div>
            ) : (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                <p className="text-primary font-semibold">✓ Completed Today</p>
                <p className="text-sm text-muted-foreground mt-1">
                  May Allah accept your recitation
                </p>
              </div>
            )}
          </div>
        )}

        {/* Daily Habits Checklist */}
        <HabitChecklist />

        {/* Dhikr Counter Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <button
            onClick={() => setShowDhikrCounter(!showDhikrCounter)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">📿</span>
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-lg">Dhikr Counter</h2>
                <p className="text-sm text-muted-foreground">
                  {todayProgress.habits.dhikr?.count || 0} today
                </p>
              </div>
            </div>
            <div className="text-muted-foreground">
              {showDhikrCounter ? '▼' : '▶'}
            </div>
          </button>

          {showDhikrCounter && (
            <div className="mt-4 pt-4 border-t border-border">
              <DhikrCounter compact />
            </div>
          )}
        </div>

        {/* Nearby Taraweeh Mosques */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Taraweeh Near You</h2>
              <p className="text-sm text-muted-foreground">
                Find prayer times tonight
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {/* This would be populated from your mosque data */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Islamic Center</h3>
                  <p className="text-xs text-muted-foreground">0.8 km away</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">8:30 PM</p>
                  <p className="text-xs text-muted-foreground">Taraweeh</p>
                </div>
              </div>
            </div>

            <button className="w-full p-3 border border-border rounded-lg hover:bg-muted transition text-sm">
              View All Nearby Mosques
            </button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">You're Not Alone</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-bold text-foreground">2,184</span> people completed today's Quran goal
            </p>
            <p className="text-muted-foreground">
              <span className="font-bold text-foreground">68%</span> stayed consistent today
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/ramadan/calendar"
            onClick={() => {/* Navigate to calendar */}}
            className="p-4 bg-card border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold">Calendar</span>
          </Link>

          <Link
            href="/ramadan/setup"
            onClick={() => {/* Navigate to settings */}}
            className="p-4 bg-card border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2"
          >
            <Menu className="w-5 h-5 text-primary" />
            <span className="font-semibold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}