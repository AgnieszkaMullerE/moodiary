'use client';

import { useMemo } from 'react';
import { getEntries } from '@/lib/storage';

const DAY_LETTERS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

function getWeekDates(today: Date): Date[] {
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function WeekBar() {
  const today = useMemo(() => new Date(), []);
  const todayStr = toDateStr(today);
  const week = useMemo(() => getWeekDates(today), [today]);
  const entryDates = useMemo(
    () => new Set(getEntries().map((e) => e.date)),
    []
  );

  return (
    <div className="pb-5 border-b border-gray-200">
      <div className="flex justify-between gap-1">
        {week.map((day, i) => {
          const str = toDateStr(day);
          const isToday = str === todayStr;
          const hasEntry = entryDates.has(str);
          return (
            <div key={str} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">{DAY_LETTERS[i]}</span>
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isToday
                    ? 'bg-[#1C1C1E] text-white'
                    : 'text-gray-500'
                }`}
              >
                {day.getDate()}
              </div>
              <div className={`size-1 rounded-full ${hasEntry ? 'bg-gray-400' : 'bg-transparent'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
