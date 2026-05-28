export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
}
