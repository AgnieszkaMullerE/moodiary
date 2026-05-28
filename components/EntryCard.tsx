'use client';

import { Trash2 } from 'lucide-react';
import type { Entry } from '@/lib/types';
import { MOODS } from './MoodSelector';
import MoodFace from './MoodFace';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
  });
}

interface Props {
  entry: Entry;
  isToday?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  confirming?: boolean;
  onRequestDelete?: () => void;
}

export default function EntryCard({ entry, isToday, onClick, onDelete, onCancel, confirming = false, onRequestDelete }: Props) {
  const mood = MOODS.find((m) => m.value === entry.mood);
  const preview = entry.title || `${stripHtml(entry.content).slice(0, 80)}${stripHtml(entry.content).length > 80 ? '…' : ''}`;

  return (
    <div
      onClick={() => !confirming && onClick?.()}
      className="w-full text-left rounded-2xl px-4 py-4 cursor-pointer bg-[#FDFAF9] transition-[box-shadow] duration-300 [box-shadow:inset_0_0_0_0px_transparent,0_1px_3px_rgba(0,0,0,0.04)] hover:[box-shadow:inset_0_0_0_1px_#E5E7EB,0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]"
    >
      {confirming ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-700">Czy na pewno chcesz usunąć wpis?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="flex-1 h-9 rounded-full bg-[#1C1C1E] text-white text-xs font-semibold hover:bg-[#1C1C1E]/90 transition-colors"
            >
              Tak
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCancel?.(); }}
              className="flex-1 h-9 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Nie
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 mb-1">{formatDate(entry.date)}</p>
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
              {preview || <span className="italic text-gray-400">Brak treści</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {mood && <MoodFace mood={entry.mood} size={31} />}
            {onRequestDelete && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRequestDelete(); }}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                aria-label="Usuń wpis"
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
