'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import MoodSelector from '@/components/MoodSelector';
import WeekBar from '@/components/WeekBar';
import TipTapEditor from '@/components/TipTapEditor';
import { saveEntry } from '@/lib/storage';
import type { Mood } from '@/lib/types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Dobranoc.';
  if (h < 12) return 'Dzień dobry.';
  if (h < 18) return 'Miłego dnia.';
  if (h < 22) return 'Dobry wieczór.';
  return 'Dobranoc.';
}

function formatTodayLabel(): string {
  return new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TodayPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  // editorKey wymusza pełny remount TipTap po zapisie → czyste pola
  const [editorKey, setEditorKey] = useState(0);

  const handleSave = useCallback(() => {
    const now = new Date().toISOString();
    saveEntry({
      id: uuidv4(),
      date: todayStr(),
      title: title.trim(),
      content,
      mood,
      createdAt: now,
      updatedAt: now,
    });
    toast.success('Wpis zapisany');
    // wyczyść formularz
    setTitle('');
    setContent('');
    setMood('neutral');
    setEditorKey((k) => k + 1);
  }, [title, content, mood]);

  return (
    <div className="px-5 pt-8 pb-4 flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-display)] tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{formatTodayLabel()}</p>
      </div>

      <WeekBar />

      <div className="flex flex-col gap-4 mt-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nadaj tytuł..."
          className="w-full bg-white rounded-xl border border-gray-200 px-3 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />

        <TipTapEditor
          key={editorKey}
          content={content}
          onChange={setContent}
          placeholder="Co dzisiaj przeżyłaś?"
        />

        <MoodSelector value={mood} onChange={setMood} />
      </div>

      <Button
        onClick={handleSave}
        className="w-full h-14 rounded-full bg-[#1C1C1E] text-white text-sm font-semibold hover:bg-[#1C1C1E]/90"
      >
        Zapisz wpis
      </Button>
    </div>
  );
}
