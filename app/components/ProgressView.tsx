'use client';

import { FlameIcon, MoonIcon, HeartIcon, ActivityIcon, StarIcon } from './Icons';
import { WellnessStats } from '../types';

interface ProgressViewProps {
  stats: WellnessStats;
  weeklyData: {
    date: string;
    dayName: string;
    sleep: number;
    movement: number;
    gratitude: number;
    hasEntry: boolean;
  }[];
}

export function ProgressView({ stats, weeklyData }: ProgressViewProps) {
  const completionRate = stats.totalEntries > 0 
    ? Math.round((weeklyData.filter(d => d.hasEntry).length / 7) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Streak Card */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <FlameIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white/90">Current Streak</h3>
              <p className="text-sm text-white/60">Keep it going!</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {stats.currentStreak}
          </span>
          <span className="text-xl text-white/70 mb-2">days</span>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
          <div>
            <p className="text-sm text-white/60">Longest Streak</p>
            <p className="text-lg font-semibold">{stats.longestStreak} days</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Total Entries</p>
            <p className="text-lg font-semibold">{stats.totalEntries}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">This Week</p>
            <p className="text-lg font-semibold">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)]">
        <h3 className="font-semibold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          This Week
        </h3>
        
        <div className="flex justify-between gap-1">
          {weeklyData.map((day, index) => (
            <div key={day.date} className="flex-1 text-center">
              <div className="text-xs text-[var(--muted)] mb-2">{day.dayName}</div>
              <div 
                className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ${
                  day.hasEntry 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-[var(--border)]/50'
                } ${index === 6 ? 'ring-2 ring-[var(--primary)] ring-offset-2' : ''}`}
              >
                {day.hasEntry ? (
                  <StarIcon className="w-4 h-4" filled />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[var(--muted)]/30" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Averages */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-sleep flex items-center justify-center">
              <MoonIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-[var(--muted)]">Avg Sleep</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
              {stats.averageSleep.toFixed(1)}
            </span>
            <span className="text-sm text-[var(--muted)] mb-1">hrs</span>
          </div>
          <div className="mt-2 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.averageSleep / 8) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-movement flex items-center justify-center">
              <ActivityIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-[var(--muted)]">Avg Movement</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
              {Math.round(stats.averageMovement)}
            </span>
            <span className="text-sm text-[var(--muted)] mb-1">min</span>
          </div>
          <div className="mt-2 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.averageMovement / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gratitude Stats */}
      <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-gratitude flex items-center justify-center">
              <HeartIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-[var(--foreground)]">Gratitude Journey</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[var(--background)] rounded-xl">
            <div className="text-3xl font-bold text-[var(--gratitude)]" style={{ fontFamily: 'var(--font-display)' }}>
              {stats.totalGratitudeItems}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">Total blessings counted</div>
          </div>
          <div className="text-center p-4 bg-[var(--background)] rounded-xl">
            <div className="text-3xl font-bold text-[var(--gratitude)]" style={{ fontFamily: 'var(--font-display)' }}>
              {stats.totalEntries > 0 ? (stats.totalGratitudeItems / stats.totalEntries).toFixed(1) : 0}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">Avg per day</div>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-br from-[var(--gratitude-light)] to-[var(--secondary-light)] rounded-2xl p-6 text-center">
        <p className="text-lg text-[var(--foreground)]/80 italic" style={{ fontFamily: 'var(--font-display)' }}>
          &ldquo;Small daily improvements over time lead to stunning results.&rdquo;
        </p>
        <p className="text-sm text-[var(--foreground)]/60 mt-2">— Robin Sharma</p>
      </div>
    </div>
  );
}

