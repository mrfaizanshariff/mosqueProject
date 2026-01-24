'use client';

import React from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';
import { useQuranProgressStore } from '../../store/quranProgressStore';

interface SurahCardProps {
  surah: {
    id: number;
    nameSimple: string;
    nameArabic: string;
    versesCount: number;
    revelationPlace?: string;
  };
  onClick: () => void;
  featured?: boolean;
}

export default function SurahCard({ surah, onClick, featured = false }: SurahCardProps) {
  const { favorites, toggleFavorite, getProgress } = useQuranProgressStore();
  
  const isFavorite = favorites.includes(surah.id);
  const progress = getProgress(surah.id);
  
  const progressPercentage = progress
    ? Math.round((progress.lastAyahRead / progress.totalAyahs) * 100)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(surah.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-card border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
        featured
          ? 'border-secondary hover:border-secondary/80 bg-gradient-to-br from-secondary/5 to-transparent'
          : 'border-border hover:border-primary'
      } ${progress?.status === 'completed' ? 'border-primary/50' : ''}`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
          isFavorite
            ? 'text-destructive bg-destructive/10'
            : 'text-muted-foreground hover:text-destructive hover:bg-muted'
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Completed Badge */}
      {progress?.status === 'completed' && (
        <div className="absolute top-4 left-4">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
      )}

      {/* Surah Number */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            featured
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {surah.id}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">
            {surah.nameSimple}
          </h3>
          <p className="text-sm text-muted-foreground">
            {surah.versesCount} Ayahs
          </p>
        </div>
      </div>

      {/* Arabic Name */}
      <div className="mb-4 text-right" dir="rtl">
        <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
          {surah.nameArabic}
        </p>
      </div>

      {/* Progress Bar */}
      {progress && progress.status !== 'not-started' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progress.status === 'completed'
                  ? 'bg-primary'
                  : 'bg-secondary'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progress.status === 'in-progress' && (
            <p className="text-xs text-muted-foreground">
              Last read: Ayah {progress.lastAyahRead}
            </p>
          )}
        </div>
      )}

      {/* Status Badge */}
      {!progress && (
        <div className="pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Not started</span>
        </div>
      )}
    </div>
  );
}