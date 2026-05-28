'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TipTapEditor from '@/components/TipTapEditor';
import MoodFace from '@/components/MoodFace';
import { getEntryById } from '@/lib/storage';
import { MOODS } from '@/components/MoodSelector';
import type { Entry } from '@/lib/types';

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<Entry | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getEntryById(id);
    if (found) {
      setEntry(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    if (notFound) router.replace('/entries');
  }, [notFound, router]);

  if (!entry) return null;

  const mood = MOODS.find((m) => m.value === entry.mood);

  return (
    <div className="min-h-full px-5 pt-6 pb-8 flex flex-col gap-5">

      {/* Przycisk powrotu — strzałka na czarnym kółku */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center justify-center size-8 rounded-full bg-[#1C1C1E] hover:bg-[#1C1C1E]/80 transition-colors"
        aria-label="Wróć"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Nagłówek */}
      <div>
        <p className="text-xs text-gray-500 mb-2 capitalize italic tracking-wide">{formatFullDate(entry.date)}</p>
        {entry.title && (
          <h1 className="text-2xl font-bold text-gray-900 leading-snug font-[family-name:var(--font-display)] tracking-tight">{entry.title}</h1>
        )}
      </div>

      {/* Sekcja wpisu na zaokrąglonym tle */}
      <div className="bg-[#ECE7E5] rounded-3xl px-5 py-5 flex flex-col gap-4">
        <TipTapEditor content={entry.content} editable={false} />

        {/* Nastrój — pod treścią */}
        {mood && (
          <div className="flex items-center gap-2 pt-1">
            <MoodFace mood={entry.mood} size={28} />
            <span className="text-xs text-gray-400 font-medium">{mood.label}</span>
          </div>
        )}
      </div>

    </div>
  );
}
