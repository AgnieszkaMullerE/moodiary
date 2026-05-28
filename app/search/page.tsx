'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import EntryCard from '@/components/EntryCard';
import { getEntries } from '@/lib/storage';
import type { Entry } from '@/lib/types';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').toLowerCase();
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SearchPage() {
  const router = useRouter();
  const today = todayStr();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  const isActive = query.length > 0 || focused;

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        stripHtml(e.content).includes(q)
    );
  }, [query, entries]);

  const showEmpty = query.trim().length > 0 && results.length === 0;

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Input — przesuwa się z centrum na górę */}
      <div className="px-5 pt-8 flex-shrink-0">
        <div
          className={`transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isActive ? 'translate-y-0' : 'translate-y-[28vh]'
          }`}
        >
          <div className="relative">
            <Search
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Szukaj wpisów..."
              className="w-full bg-gray-100 rounded-2xl border-0 pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-gray-150 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Wyniki — pojawiają się po animacji */}
      <div
        className={`flex-1 overflow-y-auto px-5 pb-4 transition-opacity duration-300 ${
          isActive ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'
        }`}
      >
        {results.length > 0 && (
          <div className="flex flex-col gap-3 pt-5">
            <p className="text-xs text-gray-400">
              {results.length} {results.length === 1 ? 'wynik' : results.length < 5 ? 'wyniki' : 'wyników'}
            </p>
            {results.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                isToday={entry.date === today}
                onClick={() => router.push(`/entries/${entry.id}`)}
              />
            ))}
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <Search size={36} strokeWidth={1.5} className="text-gray-900 opacity-40" />
            <p className="text-gray-500 text-sm leading-relaxed">
              Brak wyników dla<br />
              <span className="font-medium text-gray-700">„{query.trim()}"</span>
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
