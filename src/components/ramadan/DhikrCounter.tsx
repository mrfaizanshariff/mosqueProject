// components/ramadan/DhikrCounter.tsx

'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getTodayDate } from '../../utils/ramadanCalculation';
import { RotateCcw, Target, ChevronRight, Check, Plus, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DhikrCounterProps {
  compact?: boolean;
}

export default function DhikrCounter({ compact = false }: DhikrCounterProps) {
  const { goals, dailyProgress, incrementDhikr, resetDhikr } = useRamadanStore();

  const today = getTodayDate();
  const todayProgress = dailyProgress[today] || { date: today, habits: {} };
  const dhikrProgress = todayProgress.habits.dhikr || { completed: false, totalCount: 0, counts: {} };

  const dhikrGoal = goals.find(g => (g.type as string) === 'dhikr' && g.enabled);
  const configuredTypes = dhikrGoal?.dhikrTypes || [
    { id: 'subhanallah', name: 'SubhanAllah', target: 33 },
    { id: 'alhamdulillah', name: 'Alhamdulillah', target: 33 },
    { id: 'allahuakbar', name: 'Allahu Akbar', target: 34 }
  ];

  const [selectedTypeId, setSelectedTypeId] = useState<string>(configuredTypes[0]?.id || 'subhanallah');
  const selectedType = configuredTypes.find(t => t.id === selectedTypeId) || configuredTypes[0];

  const handleIncrement = (typeId: string, amount: number = 1) => {
    incrementDhikr(today, typeId, amount);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset today\'s count?')) {
      resetDhikr(today);
    }
  };

  const currentCount = dhikrProgress.counts[selectedTypeId] || 0;
  const target = selectedType?.target || 100;
  const progress = Math.min((currentCount / target) * 100, 100);

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {configuredTypes.map((type) => {
            const count = dhikrProgress.counts[type.id] || 0;
            const typeProgress = Math.min((count / type.target) * 100, 100);
            return (
              <div key={type.id} className="bg-muted/30 p-3 rounded-xl border border-border/50">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-foreground/80">{type.name}</span>
                  <span className="text-muted-foreground">{count} / {type.target}</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${typeProgress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleIncrement(selectedTypeId)}
          className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-black text-3xl shadow-lg ring-offset-background active:scale-95 transition-all"
        >
          {dhikrProgress.totalCount}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Dhikr Counter</h1>
          <p className="text-muted-foreground text-lg italic">
            "Verily, in the remembrance of Allah do hearts find rest."
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar items-center">
          {configuredTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeId(type.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl border-2 transition-all font-bold ${selectedTypeId === type.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                }`}
            >
              {type.name}
            </button>
          ))}
          {/* Add Custom Dhikr Inline */}
          <button
            onClick={() => {
              const name = prompt('Enter Dhikr Name:');
              const targetStr = prompt('Enter Daily Target:', '100');
              const target = parseInt(targetStr || '100');
              if (name && !isNaN(target)) {
                const { goals, setGoals } = useRamadanStore.getState();
                const dhikrGoal = goals.find(g => g.type === 'dhikr');
                if (dhikrGoal) {
                  const newTypes = [...(dhikrGoal.dhikrTypes || []), { id: `dhikr-${Date.now()}`, name, target }];
                  const newGoals = goals.map(g =>
                    g.type === 'dhikr' ? {
                      ...g,
                      dhikrTypes: newTypes,
                      dailyTarget: newTypes.reduce((acc, t) => acc + t.target, 0)
                    } : g
                  );
                  setGoals(newGoals);
                  setSelectedTypeId(newTypes[newTypes.length - 1].id);
                }
              }
            }}
            className="flex-shrink-0 w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Main Interface */}
        <div className="bg-card border-border border-2 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          {/* Background progress */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            className="absolute bottom-0 left-0 right-0 bg-primary/5 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Visual Circle */}
            <div className="relative w-64 h-64">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 110}
                  animate={{ strokeDashoffset: 2 * Math.PI * 110 - (progress / 100) * (2 * Math.PI * 110) }}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={currentCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-black text-foreground"
                >
                  {currentCount}
                </motion.span>
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                  Target {target}
                </span>
              </div>
            </div>

            {/* Big Button */}
            <button
              onClick={() => handleIncrement(selectedTypeId)}
              className="w-full bg-primary text-primary-foreground py-16 rounded-[2rem] font-black text-4xl shadow-xl shadow-primary/20 ring-offset-background active:scale-[0.98] transition-all hover:scale-[1.01]"
            >
              TAP
            </button>

            {/* Sub-counters Summary */}
            <div className="w-full grid grid-cols-2 gap-4">
              {configuredTypes.map((type) => (
                <div key={type.id} className={`p-4 rounded-3xl border-2 transition-all ${selectedTypeId === type.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-tighter truncate">{type.name}</div>
                  <div className="text-2xl font-black">{dhikrProgress.counts[type.id] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-4 gap-3">
          {[10, 33, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => handleIncrement(selectedTypeId, amount)}
              className="p-5 bg-card border-2 border-border rounded-2xl hover:border-primary/50 transition-all font-black text-xl flex items-center justify-center"
            >
              +{amount}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="p-5 bg-destructive/10 text-destructive rounded-2xl border-2 border-destructive/20 hover:bg-destructive/20 transition-all flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Global Stats */}
        <div className="bg-primary/10 p-6 rounded-3xl flex items-center justify-between border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold">Total Dhikr</h4>
              <p className="text-sm text-muted-foreground">Across all types today</p>
            </div>
          </div>
          <div className="text-3xl font-black text-primary">
            {dhikrProgress.totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}