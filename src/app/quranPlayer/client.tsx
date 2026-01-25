'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChapters, useChapterAudio } from '../hooks/useQuran';
import { useQuranProgressStore } from '../../store/quranProgressStore';
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic,
    Loader2, Mic2, BookOpen
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { useRouter } from 'next/navigation';
import { Autocomplete } from '../../../components/ui/auto-complete';

// Hardcoded popular reciters
const RECITERS = [
    { id: '7', name: 'Mishari Rashid Al-Afasy' },
    { id: '2', name: 'AbdulBaset AbdulSamad' },
    { id: '5', name: 'Abu Bakr Al-Shatri' },
    { id: '3', name: 'Saad Al-Ghamdi' },
    { id: '1', name: 'Abdul Rahman Al-Sudais' },
    { id: '4', name: 'Mahmoud Khalil Al-Hussary' },
];

export default function QuranPlayerClient() {
    const router = useRouter();

    // -- State --
    const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
    const [selectedReciterId, setSelectedReciterId] = useState<string>('7');

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // -- Hooks --
    const { data: chapters, loading: chaptersLoading } = useChapters();
    const { data: audioData, loading: audioLoading } = useChapterAudio(selectedSurahId, selectedReciterId, { segments: false });
    const { surahProgress, getProgress, updateProgress } = useQuranProgressStore();

    // -- Effects --

    // Handle Audio Events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioData]);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Auto-play when source changes
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [audioData]);

    // -- Handlers --
    const togglePlay = () => {
        if (!audioRef.current || !audioData?.audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const skipSurah = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            if (selectedSurahId < 114) setSelectedSurahId(prev => prev + 1);
        } else {
            if (selectedSurahId > 1) setSelectedSurahId(prev => prev - 1);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Get most played / recently played
    const recentSurahs = Object.values(surahProgress || {})
        .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
        .slice(0, 5);

    const currentSurah = chapters?.find((c: any) => c.id === selectedSurahId);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Decorative Background */}
            <div className="absolute inset-0 pattern-bg opacity-50 pointer-events-none -z-10" />

            <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">

                {/* Header / SEO Headline */}
                <div className="text-center mb-10 space-y-4">
                    <h1 className="font-amiri text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600 animate-in fade-in slide-in-from-bottom-4">
                        Online Quran Player - Listen to Top Reciters
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Listen to the Holy Quran recited by world-renowned Qaris.
                        Immerse yourself in the divine words with our beautiful, distraction-free player.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Player Section */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Player Card */}
                        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden group">
                            {/* Card Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                            {/* Surah Info */}
                            <div className="relative z-10 text-center space-y-2 mb-8">
                                <span className="text-sm font-medium uppercase tracking-widest text-primary/80">Now Playing</span>
                                <h2 className="text-3xl md:text-5xl font-amiri font-bold">
                                    {currentSurah?.nameSimple ?? 'Loading...'}
                                </h2>
                                <p className="text-xl text-muted-foreground quran-text-small" dir="rtl">
                                    {currentSurah?.nameArabic}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                                    <span className="bg-primary/10 px-2 py-0.5 rounded-full">{currentSurah?.revelationPlace}</span>
                                    <span>•</span>
                                    <span>{currentSurah?.versesCount} Verses</span>
                                </div>
                            </div>

                            {/* Visualizer Placeholder / Art */}
                            <div className="relative h-4 md:h-48 flex items-center justify-center mb-8">
                                {/* Simulated Waveform */}
                                <div className="flex items-end gap-1 h-full w-full justify-center opacity-80">
                                    {isPlaying ? (
                                        Array.from({ length: 40 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 bg-primary/60 rounded-t-full animate-pulse"
                                                style={{
                                                    height: `${Math.max(20, Math.random() * 100)}%`,
                                                    animationDelay: `${i * 0.05}s`,
                                                    animationDuration: '0.8s'
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <Play className="w-20 h-20 text-muted/20" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="relative z-10 space-y-6">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <input
                                        id="seek-slider"
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center justify-center gap-6 md:gap-10">
                                    <button
                                        id="prev-surah-btn"
                                        onClick={() => skipSurah('prev')}
                                        disabled={selectedSurahId <= 1}
                                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition hover:scale-110"
                                        aria-label="Previous Surah"
                                    >
                                        <SkipBack className="w-8 h-8" />

                                    </button>

                                    <button
                                        id="play-pause-btn"
                                        onClick={togglePlay}
                                        disabled={!audioData?.audioUrl}
                                        className="w-20 h-20 md:w-24 md:h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-primary/20"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {audioLoading ? (
                                            <Loader2 className="w-10 h-10 animate-spin" />
                                        ) : isPlaying ? (
                                            <Pause className="w-10 h-10 fill-current" />
                                        ) : (
                                            <Play className="w-10 h-10 fill-current ml-1" />
                                        )}
                                    </button>

                                    <button
                                        id="next-surah-btn"
                                        onClick={() => skipSurah('next')}
                                        disabled={selectedSurahId >= 114}
                                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition hover:scale-110"
                                        aria-label="Next Surah"
                                    >
                                        <SkipForward className="w-8 h-8" />

                                    </button>
                                </div>
                            </div>

                            {/* Audio Element */}
                            <audio
                                id="quran-audio-player"
                                ref={audioRef}
                                src={audioData?.audioUrl}
                                preload="metadata"
                                className="hidden"
                            />
                        </div>

                        {/* Quick Stats / Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Current Surah</p>
                                    <p className="font-semibold">{selectedSurahId} / 114</p>
                                </div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Mic2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Reciter</p>
                                    <p className="font-semibold">{RECITERS.find(r => r.id === selectedReciterId)?.name.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Selection & History */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Settings Card */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <ListMusic className="w-5 h-5 text-primary" />
                                Playback Settings
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="surah-select-trigger" className="text-sm font-medium text-muted-foreground">Select Surah</label>
                                    <Select
                                        value={selectedSurahId.toString()}
                                        onValueChange={(val) => setSelectedSurahId(parseInt(val))}
                                    >
                                        <SelectTrigger id="surah-select-trigger" className="w-full h-12">
                                            <SelectValue placeholder="Select Surah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chaptersLoading ? (
                                                <div className="p-2 text-center text-sm">Loading Surahs...</div>
                                            ) : (
                                                chapters?.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>
                                                        <div className="flex justify-between w-full min-w-[200px]">
                                                            <span>{s.id}. {s.nameSimple}</span>
                                                            <span className="quran-text-small">{s.nameArabic}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="reciter-select-trigger" className="text-sm font-medium text-muted-foreground">Select Reciter</label>
                                    <Select
                                        value={selectedReciterId}
                                        onValueChange={setSelectedReciterId}
                                    >
                                        <SelectTrigger id="reciter-select-trigger" className="w-full h-12">
                                            <SelectValue placeholder="Select Reciter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RECITERS.map((r) => (
                                                <SelectItem key={r.id} value={r.id}>
                                                    {r.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Most Played / History */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Recently Played
                            </h3>

                            {recentSurahs.length > 0 ? (
                                <div className="space-y-3">
                                    {recentSurahs.map((progress: any) => {
                                        const ch = chapters?.find((c: any) => c.id === progress.surahId);
                                        if (!ch) return null;
                                        return (
                                            <button
                                                key={progress.surahId}
                                                onClick={() => setSelectedSurahId(progress.surahId)}
                                                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between group ${selectedSurahId === progress.surahId ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                                            >
                                                <div>
                                                    <p className="font-bold text-sm">{ch.nameSimple}</p>
                                                    <p className={`text-xs ${selectedSurahId === progress.surahId ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                                        Last read {new Date(progress.lastReadAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Play className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition ${selectedSurahId === progress.surahId ? 'fill-white' : 'fill-primary'}`} />
                                            </button>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    History will appear here once you start listening.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
