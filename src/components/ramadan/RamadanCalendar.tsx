// components/ramadan/RamadanCalendar.tsx

'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '../../store/ramadanStore';
import { getTodayDate, isSalahComplete } from '../../utils/ramadanCalculation';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { DailyProgress } from '../../types/ramadan';

export default function RamadanCalendar() {
  const { dailyProgress, settings, getRamadanDay } = useRamadanStore();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const today = getTodayDate();
  const currentRamadanDay = getRamadanDay();

  // Generate 30 days of Ramadan
  const ramadanDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(settings.startDate);
    date.setDate(date.getDate() + i);
    return {
      dayNumber: i + 1,
      date: date.toISOString().split('T')[0],
      isPast: i + 1 < currentRamadanDay,
      isToday: i + 1 === currentRamadanDay,
      isFuture: i + 1 > currentRamadanDay
    };
  });

  const getDayStatus = (date: string) => {
    const progress = dailyProgress[date];
    if (!progress) return 'none';

    const habits = progress.habits;
    const hasActivity =
      habits.salah ||
      habits.quran?.completed ||
      habits.taraweeh ||
      habits.dhikr?.completed ||
      (habits.custom && Object.values(habits.custom).some(Boolean));

    return hasActivity ? 'active' : 'none';
  };

  const selectedDayProgress = selectedDay ? dailyProgress[selectedDay] : null;

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Ramadan Calendar</h1>
          <p className="text-muted-foreground">
            Track your journey through the blessed month
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for alignment */}
            {Array.from({ length: new Date(settings.startDate).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {ramadanDays.map((day) => {
              const status = getDayStatus(day.date);

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day.date)}
                  disabled={day.isFuture}
                  className={`aspect-square p-2 rounded-lg border-2 transition ${day.isToday
                      ? 'border-primary bg-primary/10'
                      : status === 'active'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-muted'
                    } ${day.isFuture ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${selectedDay === day.date ? 'ring-2 ring-primary' : ''
                    }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-lg font-bold">{day.dayNumber}</span>
                    {status === 'active' && !day.isFuture && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary bg-primary/10 rounded" />
            <span className="text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/50 bg-primary/5 rounded flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
            <span className="text-muted-foreground">Active day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-border rounded" />
            <span className="text-muted-foreground">No activity</span>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay && selectedDayProgress && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Day {ramadanDays.find(d => d.date === selectedDay)?.dayNumber}
              </h2>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Salah */}
              {selectedDayProgress.habits.salah && (
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-muted-foreground">Salah</p>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(selectedDayProgress.habits.salah).map(([prayer, completed]) => (
                      <div
                        key={prayer}
                        className={`p-2 rounded text-center text-xs ${completed
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quran */}
              {selectedDayProgress.habits.quran?.completed && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">Quran reading completed</span>
                </div>
              )}

              {/* Taraweeh */}
              {selectedDayProgress.habits.taraweeh && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">Taraweeh prayed</span>
                </div>
              )}

              {/* Dhikr */}
              {selectedDayProgress.habits.dhikr && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    Dhikr: {selectedDayProgress.habits.dhikr.totalCount} times
                  </span>
                </div>
              )}

              {/* Custom Habits */}
              {selectedDayProgress.habits.custom &&
                Object.entries(selectedDayProgress.habits.custom).map(([id, completed]) => {
                  if (!completed) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">Custom goal completed</span>
                    </div>
                  );
                })}
            </div>

            {Object.keys(selectedDayProgress.habits).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No activities recorded for this day
              </p>
            )}
          </div>
        )}

        {!selectedDay && (
          <div className="text-center text-muted-foreground py-8">
            Tap on a day to view details
          </div>
        )}
      </div>
    </div>
  );
}