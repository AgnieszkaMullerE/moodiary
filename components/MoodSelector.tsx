'use client';

import type { Mood } from '@/lib/types';
import MoodFace from './MoodFace';

const MOODS: { value: Mood; label: string }[] = [
  { value: 'great', label: 'Świetnie' },
  { value: 'good', label: 'Dobrze' },
  { value: 'neutral', label: 'Neutralnie' },
  { value: 'bad', label: 'Źle' },
  { value: 'terrible', label: 'Bardzo źle' },
];

interface Props {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-3">Nastrój</p>
      <div className="flex gap-2">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className={`flex flex-col items-center flex-1 gap-1.5 rounded-2xl py-3 px-1 text-[10px] font-medium transition-all ${
              value === m.value
                ? 'bg-white [outline:1px_solid_#E5E7EB] [outline-offset:-1px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                : 'bg-white/50 text-gray-400 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`}
          >
            <MoodFace mood={m.value} size={31} />
            <span className="leading-tight text-center text-[9px]">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { MOODS };
