// components/ramadan/GoalSelector.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRamadanStore } from '../../store/ramadanStore';
import { Check, Plus, X, ArrowLeft, Settings2, Target } from 'lucide-react';
import { Goal, DhikrType } from '../../types/ramadan';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_DHIKR: DhikrType[] = [
  { id: 'subhanallah', name: 'SubhanAllah', target: 100 },
  { id: 'alhamdulillah', name: 'Alhamdulillah', target: 100 },
  { id: 'allahuakbar', name: 'Allahu Akbar', target: 100 },
  { id: 'lailahaillallah', name: 'La ilaha illallah', target: 100 },
];

export default function GoalSelector() {
  const router = useRouter();
  const { goals, toggleGoal, addGoal, removeGoal, setGoals } = useRamadanStore();
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [customGoalName, setCustomGoalName] = useState('');
  const [editingDhikr, setEditingDhikr] = useState(false);

  const handleAddCustomGoal = () => {
    if (!customGoalName.trim()) return;

    const newGoal: Goal = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      name: customGoalName,
      enabled: true
    };

    addGoal(newGoal);
    setCustomGoalName('');
    setShowCustomGoal(false);
  };

  const handleToggleDhikrType = (type: DhikrType) => {
    const dhikrGoal = goals.find(g => g.type === 'dhikr');
    if (!dhikrGoal) return;

    const currentTypes = dhikrGoal.dhikrTypes || [];
    const exists = currentTypes.find(t => t.id === type.id);

    let newTypes;
    if (exists) {
      newTypes = currentTypes.filter(t => t.id !== type.id);
    } else {
      newTypes = [...currentTypes, type];
    }

    const newGoals = goals.map(g =>
      g.type === 'dhikr' ? {
        ...g,
        dhikrTypes: newTypes,
        dailyTarget: newTypes.reduce((acc, t) => acc + t.target, 0)
      } : g
    );
    setGoals(newGoals);
  };

  const handleUpdateDhikrTarget = (id: string, target: number) => {
    const dhikrGoal = goals.find(g => g.type === 'dhikr');
    if (!dhikrGoal) return;

    const newTypes = (dhikrGoal.dhikrTypes || []).map(t =>
      t.id === id ? { ...t, target } : t
    );

    const newGoals = goals.map(g =>
      g.type === 'dhikr' ? {
        ...g,
        dhikrTypes: newTypes,
        dailyTarget: newTypes.reduce((acc, t) => acc + t.target, 0)
      } : g
    );
    setGoals(newGoals);
  };

  const handleContinue = () => {
    const hasQuranGoal = goals.find(g => g.type === 'quran' && g.enabled);
    if (hasQuranGoal) {
      router.push('/ramadan/setup/quran');
    } else {
      router.push('/ramadan/setup/configure');
    }
  };

  const getGoalIcon = (type: string) => {
    const icons: Record<string, string> = {
      salah: '🤲',
      quran: '📖',
      dhikr: '📿',
      taraweeh: '🌙',
      custom: '⭐'
    };
    return icons[type] || '✨';
  };

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Focus</h1>
          <p className="text-muted-foreground text-lg">
            Select the habits you'd like to track this Ramadan.
          </p>
        </div>

        <div className="grid gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <motion.div
                layout
                onClick={() => toggleGoal(goal.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${goal.enabled
                  ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                  : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${goal.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                      {getGoalIcon(goal.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{goal.name}</h3>
                      {goal.enabled && goal.type === 'dhikr' && (
                        <p className="text-sm text-primary font-medium">
                          {(goal.dhikrTypes?.length || 0)} types configured
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {goal.enabled && goal.type === 'dhikr' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDhikr(!editingDhikr);
                        }}
                        className="p-2 hover:bg-primary/20 rounded-lg transition"
                      >
                        <Settings2 className="w-5 h-5 text-primary" />
                      </button>
                    )}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${goal.enabled ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      }`}>
                      {goal.enabled && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Dhikr Granular Configuration */}
              <AnimatePresence>
                {goal.enabled && goal.type === 'dhikr' && editingDhikr && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-muted/30 rounded-2xl border border-dashed border-primary/30 p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Configure Dhikr Types
                      </h4>
                    </div>
                    <div className="grid gap-3">
                      {PRESET_DHIKR.map((preset) => {
                        const isSelected = goal.dhikrTypes?.some(t => t.id === preset.id);
                        return (
                          <div key={preset.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
                            <button
                              onClick={() => handleToggleDhikrType(preset)}
                              className={`flex-grow text-left font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                              {preset.name}
                            </button>
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Target:</span>
                                <input
                                  type="number"
                                  value={goal.dhikrTypes?.find(t => t.id === preset.id)?.target}
                                  onChange={(e) => handleUpdateDhikrTarget(preset.id, parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 bg-background border border-border rounded-lg text-sm text-center focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            )}
                            <button
                              onClick={() => handleToggleDhikrType(preset)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30 hover:border-primary'
                                }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          </div>
                        );
                      })}

                      {/* User-defined dhikr types */}
                      {goal.dhikrTypes?.filter(t => !PRESET_DHIKR.some(p => p.id === t.id)).map((custom) => (
                        <div key={custom.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-primary/30 shadow-sm">
                          <span className="flex-grow font-medium text-primary">{custom.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Target:</span>
                            <input
                              type="number"
                              value={custom.target}
                              onChange={(e) => handleUpdateDhikrTarget(custom.id, parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-background border border-border rounded-lg text-sm text-center focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <button
                            onClick={() => handleToggleDhikrType(custom)}
                            className="w-5 h-5 rounded-md bg-primary border border-primary flex items-center justify-center text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Custom Dhikr Inline */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const name = prompt('Enter Dhikr Name:');
                          const target = parseInt(prompt('Enter Daily Target:', '100') || '100');
                          if (name) {
                            handleToggleDhikrType({ id: `dhikr-${Date.now()}`, name, target });
                          }
                        }}
                        className="w-full py-3 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Other Dhikr
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {!showCustomGoal ? (
          <button
            onClick={() => setShowCustomGoal(true)}
            className="w-full p-5 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Custom Focus</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-card border-2 border-primary rounded-2xl shadow-xl space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold">Goal Name</label>
              <input
                type="text"
                value={customGoalName}
                onChange={(e) => setCustomGoalName(e.target.value)}
                placeholder="e.g. Read Tafsir for 15 mins"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddCustomGoal}
                disabled={!customGoalName.trim()}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowCustomGoal(false)}
                className="px-6 py-3 bg-muted rounded-xl hover:bg-muted/80 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        <div className="pt-8">
          <button
            onClick={handleContinue}
            disabled={!goals.some(g => g.enabled)}
            className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Configure Details
          </button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            You can modify these goals anytime in the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}