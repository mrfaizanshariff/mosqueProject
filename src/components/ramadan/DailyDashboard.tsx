// components/ramadan/DailyDashboard.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { useQuranProgressStore } from '../../store/quranProgressStore';
import { getTodayDate, formatRamadanDate } from '../../utils/ramadanCalculation';
import {
  BookOpen,
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Settings,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Clock
} from 'lucide-react';
import HabitChecklist from './HabitCheckList';
import DhikrCounter from './DhikrCounter';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'dhikr'>('overview');

  const {
    quranPlan,
    dailyProgress,
    getRamadanDay,
    getOverallProgress,
    markQuranComplete,
    syncQuranProgress
  } = useRamadanStore();

  const { totalAyahsRead } = useQuranProgressStore();

  // Sync Quran progress on mount and when totalAyahsRead changes
  useEffect(() => {
    if (quranPlan?.unit === 'verses') {
      syncQuranProgress(totalAyahsRead);
    }
  }, [totalAyahsRead, quranPlan?.unit, syncQuranProgress]);

  const today = getTodayDate();
  const ramadanDay = getRamadanDay();
  const overallProgress = getOverallProgress();
  const todayProgress = dailyProgress[today] || { date: today, habits: {} };
  const quranCompleted = todayProgress.habits.quran?.completed || false;

  const progressPercent = overallProgress;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0A0A0A] pb-32">
      {/* Dynamic Header */}
      <header className="relative overflow-hidden bg-primary px-6 pt-16 pb-24 text-primary-foreground">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-black tracking-tight">Ramadan Day {ramadanDay}</h1>
              <p className="text-primary-foreground/70 font-medium">{formatRamadanDate(today)}</p>
            </motion.div>
            <Link href="/ramadan/setup" className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition">
              <Settings className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="88" cy="88" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/10" />
                <motion.circle
                  cx="88" cy="88" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-white"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{progressPercent}%</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">Complete</span>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md">
              Keep up the spiritual momentum! 🚀
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-card border border-border/50 p-1.5 rounded-2xl flex shadow-xl shadow-black/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('dhikr')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'dhikr' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'}`}
          >
            <Sparkles className="w-4 h-4" /> Dhikr
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quran Card */}
              {quranPlan && (
                <div className="group bg-card border-none rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all border border-border/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-tighter text-sm">
                        <BookOpen className="w-4 h-4" /> Quran Goal
                      </div>
                      <h2 className="text-2xl font-black">Daily Recitation</h2>
                      <p className="text-muted-foreground font-medium">Target: {quranPlan.dailyTarget} {quranPlan.unit}</p>
                    </div>
                    {quranCompleted ? (
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!quranCompleted ? (
                      <>
                        <button onClick={() => markQuranComplete(today)} className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/20 active:scale-[0.98]">
                          Mark Finished
                        </button>
                        <Link href="/quran" className="px-6 bg-muted text-foreground py-4 rounded-2xl font-bold hover:bg-muted/80 transition flex items-center gap-2 whitespace-nowrap">
                          Read Now <ChevronRight className="w-4 h-4" />
                        </Link>
                      </>
                    ) : (
                      <div className="w-full py-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-2xl font-black text-center border border-emerald-100 dark:border-emerald-500/20">
                        ✨ Alhamdulillah, Goal Met!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Habits List */}
              <div className="bg-card rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-border/20">
                <h2 className="text-2xl font-black mb-6">Daily Habits</h2>
                <HabitChecklist />
              </div>

              {/* Taraweeh Card */}
              <div className="bg-card rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-border/20 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Taraweeh Near You</h3>
                    <p className="text-muted-foreground font-medium text-sm">Find mosques in your area</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </div>

              {/* Community Stats */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-[2.5rem] p-8 border border-indigo-100 dark:border-indigo-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Community Synergy</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-3xl">
                    <div className="text-2xl font-black">2,412</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase opacity-70">Finished Quran Today</div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-3xl">
                    <div className="text-2xl font-black">72%</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase opacity-70">Average Consistency</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dhikr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DhikrCounter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav for Settings/Calendar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border/50 px-8 py-4 rounded-full shadow-2xl flex items-center gap-12 border-t border-border/20 z-50">
        <Link href="/ramadan/calendar" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition">
          <CalendarIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Calendar</span>
        </Link>
        <Link href="/ramadan/summary" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Summary</span>
        </Link>
        <Link href="/ramadan/setup" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
        </Link>
      </nav>
    </div>
  );
}