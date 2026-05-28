import type { Entry } from './types';

const STORAGE_KEY = 'moj-dzienniczek-entries';

function loadEntries(): Entry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function persistEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntries(): Entry[] {
  return loadEntries().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEntryByDate(date: string): Entry | null {
  return loadEntries().find((e) => e.date === date) ?? null;
}

export function getEntryById(id: string): Entry | null {
  return loadEntries().find((e) => e.id === id) ?? null;
}

export function saveEntry(entry: Entry): void {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  persistEntries(entries);
}

export function deleteEntry(id: string): void {
  persistEntries(loadEntries().filter((e) => e.id !== id));
}
