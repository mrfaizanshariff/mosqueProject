// components/ramadan/QuranPlanner.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRamadanStore } from '../../store/ramadanStore';
import { calculateDailyQuranTarget } from '../../utils/ramadanCalculation';
import { BookOpen, Plus, Hash, Layers, FileText, ChevronRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuranPlanner() {
  const router = useRouter();
  const { setQuranPlan, settings } = useRamadanStore();

  const [completionTarget, setCompletionTarget] = useState(1);
  const [unit, setUnit] = useState<'pages' | 'juz' | 'verses'>('pages');
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
    if (unit === 'pages') return Math.round(604 * target);
    if (unit === 'juz') return Math.round(30 * target);
    return Math.round(6236 * target);
  };

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <BookOpen className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">Quran Mastery Plan</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Design a reading schedule that fits your life and helps you finish the Quran this Ramadan.
          </p>
        </div>

        <div className="space-y-8">
          {/* Completion Target */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-primary" />
              <label className="text-lg font-bold">Completion Goal</label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((target) => (
                <button
                  key={target}
                  onClick={() => { setCompletionTarget(target); setShowCustom(false); }}
                  className={`p-5 rounded-2xl border-2 transition-all group ${completionTarget === target && !showCustom
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                    }`}
                >
                  <div className={`text-3xl font-black mb-1 transition-colors ${completionTarget === target && !showCustom ? 'text-primary' : 'text-foreground'}`}>
                    {target}x
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Quran
                  </div>
                </button>
              ))}
            </div>

            {showCustom ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted/30 rounded-2xl border border-border">
                <input
                  type="number"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  placeholder="Enter custom (e.g. 0.5 for half)"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  step="0.1"
                  min="0.1"
                  autoFocus
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setShowCustom(true)}
                className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline ml-1"
              >
                <Plus className="w-4 h-4" /> Custom Target
              </button>
            )}
          </section>

          {/* Reading Unit */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-primary" />
              <label className="text-lg font-bold">Track By</label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'juz', label: 'Juz', sub: '30 total', icon: Layers },
                { id: 'pages', label: 'Pages', sub: '604 total', icon: FileText },
                { id: 'verses', label: 'Ayahs', sub: '6k+ total', icon: Hash }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setUnit(item.id as any)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 ${unit === item.id
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                    }`}
                >
                  <item.icon className={`w-5 h-5 mb-1 ${unit === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{item.sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Preferred Time */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-primary" />
              <label className="text-lg font-bold">Planned Schedule</label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'fajr', label: 'After Fajr', icon: '🌅' },
                { value: 'night', label: 'Night/Taraweeh', icon: '🌙' },
                { value: 'anytime', label: 'Throughout Day', icon: '⏰' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPreferredTime(option.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${preferredTime === option.value
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                    }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs font-bold">{option.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Daily Plan Preview */}
          <motion.div
            layout
            className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-xl shadow-primary/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <BookOpen className="w-24 h-24 rotate-12" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Your Reading Strategy</h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">{dailyTarget}</span>
                <span className="text-xl font-medium text-muted-foreground">{unit === 'verses' ? 'Ayahs' : unit} / day</span>
              </div>

              <p className="text-muted-foreground font-medium leading-relaxed">
                Aim to complete <span className="text-foreground">{getTotalTarget()} {unit}</span> in total.
                Consistency is key—one step at a time!
              </p>
            </div>
          </motion.div>

          <div className="pt-6 space-y-4">
            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Generate My Plan
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/ramadan/setup/configure')}
              className="w-full py-4 text-muted-foreground font-medium hover:text-foreground transition flex items-center justify-center gap-2"
            >
              Skip setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}