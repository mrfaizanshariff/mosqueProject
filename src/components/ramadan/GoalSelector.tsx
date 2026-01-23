// components/ramadan/GoalSelector.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRamadanStore } from '../../store/ramadanStore';
import { Check, Plus, X, ArrowLeft } from 'lucide-react';
import { Goal } from '../../types/ramadan';

export default function GoalSelector() {
  const router = useRouter();
  const { goals, toggleGoal, addGoal, removeGoal } = useRamadanStore();
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [customGoalName, setCustomGoalName] = useState('');

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
        {/* Header */}
        <div className='flex cursor-pointer' onClick={()=>router.back()}>
            <ArrowLeft></ArrowLeft>
            <span>
                Back
                
                </span> 
        </div>
         <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Choose Your Focus
          </h1>
          <p className="text-muted-foreground">
            Select the habits you'd like to track this Ramadan
          </p>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                goal.enabled
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getGoalIcon(goal.type)}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {goal.name}
                    </h3>
                    {goal.dailyTarget && (
                      <p className="text-sm text-muted-foreground">
                        Target: {goal.dailyTarget} per day
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {goal.type === 'custom' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGoal(goal.id);
                      }}
                      className="p-1 hover:bg-destructive/10 rounded"
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </button>
                  )}
                  
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      goal.enabled
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    }`}
                  >
                    {goal.enabled && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Goal */}
        {!showCustomGoal ? (
          <button
            onClick={() => setShowCustomGoal(true)}
            className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-5 h-5" />
            <span>Add Custom Goal</span>
          </button>
        ) : (
          <div className="p-4 border-2 border-primary rounded-lg space-y-3">
            <input
              type="text"
              value={customGoalName}
              onChange={(e) => setCustomGoalName(e.target.value)}
              placeholder="Enter custom goal name..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustomGoal}
                disabled={!customGoalName.trim()}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Add Goal
              </button>
              <button
                onClick={() => {
                  setShowCustomGoal(false);
                  setCustomGoalName('');
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!goals.some(g => g.enabled)}
          className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>

        {/* Skip Option */}
        <p className="text-center text-sm text-muted-foreground">
          You can always modify your goals later
        </p>
      </div>
    </div>
  );
}