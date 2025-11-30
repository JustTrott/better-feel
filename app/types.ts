export interface DailyEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  sleep: number; // hours (0-12)
  gratitude: string[]; // 3 items
  movement: number; // minutes (0-120)
  reflection?: string; // optional daily note
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface WellnessStats {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  averageSleep: number;
  averageMovement: number;
  totalGratitudeItems: number;
}

export type TabType = 'log' | 'progress' | 'history';

