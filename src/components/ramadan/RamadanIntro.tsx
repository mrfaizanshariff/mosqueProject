// components/ramadan/RamadanIntro.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Heart, BookOpen } from 'lucide-react';

export default function RamadanIntro() {
  const router = useRouter();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleStart = () => {
    router.push('/ramadan/setup');
  };

  const handleContinueAsGuest = () => {
    // Same flow, just visual confirmation
    router.push('/ramadan/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <Moon className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Ramadan Companion
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            This Ramadan, build habits that bring you closer to Allah.
          </p>
          <p className="text-lg text-muted-foreground">
            Set goals. Stay consistent. Reflect with intention.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Quran Plans</h3>
            <p className="text-sm text-muted-foreground">
              Auto-calculated daily reading
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">No Guilt</h3>
            <p className="text-sm text-muted-foreground">
              Gentle reminders, not pressure
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">Local Mosques</h3>
            <p className="text-sm text-muted-foreground">
              Find Taraweeh near you
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleStart}
            className="w-full max-w-md mx-auto block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            Start Ramadan Goals
          </button>

          <button
            onClick={handleContinueAsGuest}
            className="w-full max-w-md mx-auto block text-muted-foreground hover:text-foreground transition text-sm"
          >
            Continue as Guest
          </button>
        </div>

        {/* How it Works Link */}
        <button
          onClick={() => setShowHowItWorks(true)}
          className="text-primary hover:underline text-sm"
        >
          How it works
        </button>
      </div>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold">How It Works</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Choose Your Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Select from default habits or add your own
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track Daily</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple one-tap tracking. No complicated forms.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Reflect & Grow</h3>
                  <p className="text-sm text-muted-foreground">
                    View your progress and end with meaningful reflection
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}