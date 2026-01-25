'use client';

import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Moon, BookOpen, Headphones, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function RamadanCTA() {
    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 opacity-95" />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-white"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">New Feature</span>
                        </div>

                        <h2 className="font-amiri text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Your Ultimate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
                                Ramadan Companion
                            </span>
                        </h2>

                        <p className="text-lg text-indigo-100 max-w-xl leading-relaxed">
                            Make the most of this blessed month. Track your daily Ibadat, follow a personalized Quran reading plan, and listen to beautiful recitations - all in one place.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none font-semibold text-lg px-8 h-12 shadow-lg shadow-indigo-900/20">
                                <Link href="/ramadan">
                                    Start Your Journey
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none font-semibold text-lg px-8 h-12 shadow-lg shadow-indigo-900/20">
                                <Link href="/quran">
                                    Read Quran
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none font-semibold text-lg px-8 h-12 shadow-lg shadow-indigo-900/20">
                                <Link href="/quranPlayer">
                                    Listen Quran
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Decorative circles */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-colors">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Moon className="w-6 h-6 text-indigo-200" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Track Ibadat</h3>
                                <p className="text-indigo-200 text-sm">Log your prayers, fasting, and good deeds daily.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-colors sm:mt-8">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <BookOpen className="w-6 h-6 text-purple-200" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Quran Planner</h3>
                                <p className="text-indigo-200 text-sm">Personalized reading goals to complete the Quran.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-colors">
                                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Headphones className="w-6 h-6 text-pink-200" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Listen & Learn</h3>
                                <p className="text-indigo-200 text-sm">Beautiful recitations to accompany your worship.</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-colors sm:mt-8">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-amber-200" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Stay Consistent</h3>
                                <p className="text-indigo-200 text-sm">Visual progress tracking to keep you motivated.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
