// components/QuranDebugPanel.tsx
/**
 * Debug panel to troubleshoot word-by-word highlighting
 * Add this to your Quran reader page temporarily to see what's happening
 */

'use client';

import React from 'react';

interface QuranDebugPanelProps {
  currentTime: number;
  currentVerseKey: string | null;
  currentWordIndex: number | null;
  audio: any;
  verses: any;
  currentVerseData: any;
}

export default function QuranDebugPanel({
  currentTime,
  currentVerseKey,
  currentWordIndex,
  audio,
  verses,
  currentVerseData,
}: QuranDebugPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Find current verse timing
  const currentVerseTiming = audio?.verseTimings?.find(
    (t: any) => t.verseKey === currentVerseKey
  );

  // Find current segment
  let currentSegment = null;
  if (currentVerseTiming?.segments) {
    for (const segment of currentVerseTiming.segments) {
      if (segment.length >= 3) {
        const [pos, start, duration] = segment;
        if (currentTime >= start && currentTime < start + duration) {
          currentSegment = { position: pos, start, duration };
          break;
        }
      }
    }
  }

  // Get current word data
  const currentWord = currentVerseData?.words?.filter(
    (w: any) => w.char_type_name === 'word'
  )?.[currentWordIndex || 0];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50"
      >
        🐛 Debug Panel
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-96 max-h-96 overflow-auto bg-card border-2 border-destructive rounded-tl-lg shadow-2xl z-50 p-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-destructive">Debug Info</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Time Info */}
        <div className="bg-muted p-2 rounded">
          <div className="font-semibold mb-1">⏱️ Time</div>
          <div>Current: {Math.round(currentTime)}ms</div>
          <div>Audio loaded: {audio ? '✅' : '❌'}</div>
          <div>Verses loaded: {verses?.verses?.length || 0}</div>
        </div>

        {/* Current Verse */}
        <div className="bg-muted p-2 rounded">
          <div className="font-semibold mb-1">📖 Current Verse</div>
          <div>Key: {currentVerseKey || 'None'}</div>
          {currentVerseTiming && (
            <div className="mt-1 text-primary">
              <div>From: {currentVerseTiming.timestampFrom}ms</div>
              <div>To: {currentVerseTiming.timestampTo}ms</div>
              <div>Segments: {currentVerseTiming.segments?.length || 0}</div>
            </div>
          )}
        </div>

        {/* Current Segment */}
        {currentSegment && (
          <div className="bg-muted p-2 rounded">
            <div className="font-semibold mb-1">🎯 Current Segment</div>
            <div>Position: {currentSegment.position}</div>
            <div>Start: {currentSegment.start}ms</div>
            <div>Duration: {currentSegment.duration}ms</div>
            <div>End: {currentSegment.start + currentSegment.duration}ms</div>
          </div>
        )}

        {/* Current Word */}
        <div className="bg-muted p-2 rounded">
          <div className="font-semibold mb-1">💬 Current Word</div>
          <div>Index: {currentWordIndex ?? 'None'}</div>
          {currentWord && (
            <div className="mt-1 text-primary">
              <div>Position: {currentWord.position}</div>
              <div>Text: {currentWord.text}</div>
              <div>Transliteration: {currentWord.transliteration?.text}</div>
              <div>Type: {currentWord.char_type_name}</div>
            </div>
          )}
        </div>

        {/* All Words in Verse */}
        {currentVerseData?.words && (
          <div className="bg-muted p-2 rounded">
            <div className="font-semibold mb-1">📝 All Words ({currentVerseData.words.length})</div>
            <div className="max-h-32 overflow-auto space-y-1 mt-1">
              {currentVerseData.words
                .filter((w: any) => w.char_type_name === 'word')
                .map((word: any, idx: number) => (
                  <div
                    key={word.id}
                    className={`p-1 rounded text-xs ${
                      idx === currentWordIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background'
                    }`}
                  >
                    #{idx} Pos:{word.position} - {word.text} ({word.transliteration?.text})
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Segments in Current Verse */}
        {currentVerseTiming?.segments && (
          <div className="bg-muted p-2 rounded">
            <div className="font-semibold mb-1">
              🎵 Segments ({currentVerseTiming.segments.length})
            </div>
            <div className="max-h-32 overflow-auto space-y-1 mt-1">
              {currentVerseTiming.segments.map((seg: any, idx: number) => {
                if (seg.length < 3) {
                  return (
                    <div key={idx} className="p-1 bg-destructive/10 rounded text-xs">
                      Invalid segment: {JSON.stringify(seg)}
                    </div>
                  );
                }
                const [pos, start, dur] = seg;
                const isActive = currentTime >= start && currentTime < start + dur;
                return (
                  <div
                    key={idx}
                    className={`p-1 rounded text-xs ${
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}
                  >
                    Pos:{pos} {start}ms-{start + dur}ms ({dur}ms)
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}