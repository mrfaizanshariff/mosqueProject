import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

type Word = {
  id: string | number;
  code_v1?: string;
  transliteration?: { text?: string } | null;
};

type Verse = {
  id: string | number;
  verse_key: string;
  verse_number: number;
  words?: Word[];
  translations?: Array<{ text?: string }>;
};

type VerseTimingSegment = [number, number, number];

type VerseTiming = {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  segments?: VerseTimingSegment[];
};

type AudioFile = {
  audio_url: string;
  verse_timings?: VerseTiming[];
};

const QuranReaderPage: React.FC = () => {
  const [surahNumber] = useState<number>(36); // In Next.js, get from useRouter() or params
  const [verses, setVerses] = useState<Verse[]>([]);
  const [audioData, setAudioData] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // milliseconds
  const [duration, setDuration] = useState<number>(0); // seconds
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [surahInfo, setSurahInfo] = useState<{ number: number; totalVerses: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch verses data
  useEffect(() => {
    const fetchVerses = async () => {
      try {
        const response = await fetch(
          `https://apis-prelive.quran.foundation/content/api/v4/verses/by_chapter/${surahNumber}?language=english&translations=131`
        );
        const data = await response.json();
        setVerses(data.verses);
        
        // Extract surah info from first verse
        if (data.verses.length > 0) {
          setSurahInfo({
            number: surahNumber,
            totalVerses: data.pagination.total_records
          });
        }
      } catch (error) {
        console.error('Error fetching verses:', error);
      }
    };

    fetchVerses();
  }, [surahNumber]);

  // Fetch audio data
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const reciterId = 7; // Mishari Al-Afasy
        const response = await fetch(
          `https://apis-prelive.quran.foundation/content/api/v4/chapter_recitations/${reciterId}/${surahNumber}`
        );
        const data = await response.json();
        if (data.audio_files && data.audio_files.length > 0) {
          setAudioData(data.audio_files[0]);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudio();
  }, [surahNumber]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime * 1000); // Convert to milliseconds
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioData]);

  // Track current verse and word based on time
  useEffect(() => {
    if (!audioData?.verse_timings) return;

    const currentVerse = audioData.verse_timings.find(
      (timing:any) =>
        currentTime >= timing.timestamp_from &&
        currentTime <= timing.timestamp_to
    );

    if (currentVerse) {
      setCurrentVerseKey(currentVerse.verse_key);

      // Find current word
      if (currentVerse.segments) {
        const currentWord = currentVerse.segments.find(
          (segment:any) =>
            currentTime >= segment[1] &&
            currentTime <= segment[1] + segment[2]
        );
        
        if (currentWord) {
          setCurrentWordIndex(currentWord[0] - 1); // Adjust for 0-based index
        }
      }

      // Auto-scroll to current verse
      if (verseRefs.current[currentVerse.verse_key]) {
        verseRefs.current[currentVerse.verse_key]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentTime, audioData]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * (audio.duration || 0);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, Math.min(audio.duration || 0, (audio.currentTime || 0) + seconds));
    audio.currentTime = newTime;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">
            Surah {surahInfo?.number}
          </h1>
          {surahInfo && (
            <p className="text-lg opacity-90">
              {surahInfo.totalVerses} Ayahs
            </p>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {audioData && (
        <div className="sticky top-0 z-10 bg-card border-b border-border shadow-lg">
          <div className="max-w-4xl mx-auto p-4">
            <audio
              ref={audioRef}
              src={audioData.audio_url}
              preload="metadata"
            />
            
            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-muted rounded-full cursor-pointer mb-4"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${duration ? (currentTime / 1000 / duration) * 100 : 0}%`
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime / 1000)}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 hover:bg-muted rounded-full transition"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="p-2 hover:bg-muted rounded-full transition"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <span className="text-sm text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Verses */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {verses.map((verse) => (
          <div
            key={verse.id}
            ref={(el) => (verseRefs.current[verse.verse_key] = el)}
            className={`p-6 rounded-lg border transition-all ${
              currentVerseKey === verse.verse_key
                ? 'bg-primary/10 border-primary shadow-md'
                : 'bg-card border-border'
            }`}
          >
            {/* Verse Number */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {verse.verse_number}
              </div>
              <span className="text-sm text-muted-foreground">
                {verse.verse_key}
              </span>
            </div>

            {/* Arabic Text with Word Highlighting */}
            <div className="text-right mb-6 leading-loose text-3xl" dir="rtl">
              {verse.words?.map((word, index) => (
                <span
                  key={word.id}
                  className={`inline-block mx-1 transition-all ${
                    currentVerseKey === verse.verse_key &&
                    currentWordIndex === index
                      ? 'text-primary font-bold scale-110'
                      : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: word.code_v1 ?? '' }}
                />
              ))}
            </div>

            {/* Transliteration */}
            <div className="mb-4 text-muted-foreground italic">
              {verse.words?.map((word, index) => (
                <span key={word.id} className="mr-2">
                  {word.transliteration?.text}
                </span>
              ))}
            </div>

            {/* Translation */}
            {verse.translations?.[0] && (
              <div className="text-lg leading-relaxed">
                {verse.translations[0].text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuranReaderPage;