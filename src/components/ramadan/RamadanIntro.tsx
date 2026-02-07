// components/ramadan/RamadanIntro.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Heart, BookOpen, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRamadanStore } from '../../store/ramadanStore';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function RamadanIntro() {
  const router = useRouter();
  const { user, loading: authLoading, signInAnon, signInWithGoogle } = useFirebaseAuth();
  const { onboardingComplete, userMode, setUserMode } = useRamadanStore();
  const [isRedirecting, setIsRedirecting] = useState(true);

  // Check for auto-redirect
  useEffect(() => {
    if (onboardingComplete) {
      router.push('/ramadan/dashboard');
    } else {
      setIsRedirecting(false);
    }
  }, [onboardingComplete, router]);

  const handleStart = (mode: 'guest' | 'loggedIn') => {
    mode === 'loggedIn' ? signInWithGoogle() : signInAnon()
    setUserMode(mode);
    router.push('/ramadan/setup');
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Star className="w-4 h-4 fill-primary" />
            <span>Ramadan 1446 AH Companion</span>
          </motion.div>

          {/* Hero Section */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-amiri"
            >
              Elevate Your <span className="text-primary italic">Ramadan</span> Experience
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            >
              Build lasting habits, track your spiritual journey, and stay connected with your local community this blessed month.
            </motion.p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              onClick={() => handleStart('loggedIn')}
              className="group cursor-pointer p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Sign in with Google
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-muted-foreground">Sync your progress across all devices and join the community leaderboards.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              onClick={() => handleStart('guest')}
              className="group cursor-pointer p-8 rounded-3xl bg-card border border-border hover:border-foreground/20 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-foreground/70" />
              </div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Continue as Guest
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-muted-foreground">Start instantly without an account. All data stays local to your browser.</p>
            </motion.div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-border/50">
            {[
              { icon: BookOpen, label: 'Spiritual Plan', color: 'text-emerald-500' },
              { icon: Heart, label: 'Habit Tracker', color: 'text-rose-500' },
              { icon: Moon, label: 'Prayer Times', color: 'text-amber-500' },
              { icon: Star, label: 'Community', color: 'text-indigo-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Decorative SVG Patterns */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" className="text-primary" />
        </svg>
      </div>
    </div>
  );
}