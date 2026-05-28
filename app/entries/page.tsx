'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EntryCard from '@/components/EntryCard';
import { getEntries, deleteEntry } from '@/lib/storage';
import type { Entry } from '@/lib/types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function EntriesPage() {
  const router = useRouter();
  const today = todayStr();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const loadEntries = useCallback(() => setEntries(getEntries()), []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const sorted = sortAsc ? [...entries].reverse() : entries;
  const toggleSort = useCallback(() => setSortAsc((prev) => !prev), []);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    setConfirmingId(null);
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="px-5 pt-8 pb-4 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-display)] tracking-tight">Moje wpisy</h1>
        <button
          type="button"
          onClick={toggleSort}
          className="p-2 rounded-xl hover:bg-white transition-colors text-gray-500"
          aria-label="Sortowanie"
        >
          {sortAsc ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m10 4V4m0 0l-4 4m4-4 4 4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5M18 4v16m0 0-4-4m4 4 4-4" />
            </svg>
          )}
        </button>
      </div>

      <Button
        onClick={() => router.push('/')}
        className="w-full h-14 rounded-full bg-[#1C1C1E] text-white text-sm font-semibold hover:bg-[#1C1C1E]/90"
      >
        + Nowy wpis
      </Button>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <span className="text-5xl">📖</span>
          <p className="text-gray-500 text-sm leading-relaxed">
            Brak wpisów.<br />Zacznij od dziś!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isToday={entry.date === today}
              onClick={() => confirmingId === null && router.push(`/entries/${entry.id}`)}
              confirming={confirmingId === entry.id}
              onRequestDelete={() => setConfirmingId(entry.id)}
              onCancel={() => setConfirmingId(null)}
              onDelete={() => handleDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
