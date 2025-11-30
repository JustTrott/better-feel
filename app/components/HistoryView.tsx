'use client';

import { DailyEntry } from '../types';
import { MoonIcon, HeartIcon, ActivityIcon, ChevronRightIcon, TrashIcon } from './Icons';
import { useState } from 'react';

interface HistoryViewProps {
  entries: DailyEntry[];
  onDeleteEntry: (date: string) => void;
}

export function HistoryView({ entries, onDeleteEntry }: HistoryViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    }
    if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCompletionScore = (entry: DailyEntry) => {
    let score = 0;
    if (entry.sleep >= 7) score++;
    if (entry.gratitude.filter(g => g.trim()).length >= 3) score++;
    if (entry.movement >= 30) score++;
    return score;
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
        <div className="w-24 h-24 rounded-full bg-[var(--border)]/50 flex items-center justify-center mb-6">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          No entries yet
        </h3>
        <p className="text-[var(--muted)] text-center max-w-xs">
          Start logging your daily wellness to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
          Your Journey
        </h3>
        <span className="text-sm text-[var(--muted)]">{entries.length} entries</span>
      </div>

      {entries.map((entry) => {
        const isExpanded = expandedId === entry.id;
        const completionScore = getCompletionScore(entry);
        const gratitudeCount = entry.gratitude.filter(g => g.trim()).length;

        return (
          <div 
            key={entry.id}
            className="bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden transition-all duration-300"
          >
            {/* Header - Always visible */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-[var(--background)]/50 transition-colors"
            >
              {/* Date & Score */}
              <div className="flex-1">
                <div className="font-medium text-[var(--foreground)]">
                  {formatDate(entry.date)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < completionScore ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[var(--muted)] ml-1">
                    {completionScore}/3 goals
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-[var(--accent)]">
                  <MoonIcon className="w-4 h-4" />
                  <span>{entry.sleep}h</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--gratitude)]">
                  <HeartIcon className="w-4 h-4" />
                  <span>{gratitudeCount}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--primary)]">
                  <ActivityIcon className="w-4 h-4" />
                  <span>{entry.movement}m</span>
                </div>
              </div>

              <ChevronRightIcon 
                className={`w-5 h-5 text-[var(--muted)] transition-transform duration-300 ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] animate-scale-in">
                <div className="pt-4 space-y-4">
                  {/* Sleep */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-1">
                      <MoonIcon className="w-4 h-4" />
                      <span>Sleep</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--accent)] rounded-full"
                          style={{ width: `${Math.min((entry.sleep / 8) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {entry.sleep} hrs
                      </span>
                    </div>
                  </div>

                  {/* Movement */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-1">
                      <ActivityIcon className="w-4 h-4" />
                      <span>Movement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--primary)] rounded-full"
                          style={{ width: `${Math.min((entry.movement / 30) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {entry.movement} min
                      </span>
                    </div>
                  </div>

                  {/* Gratitude */}
                  {gratitudeCount > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
                        <HeartIcon className="w-4 h-4" />
                        <span>Gratitude</span>
                      </div>
                      <ul className="space-y-1.5">
                        {entry.gratitude.filter(g => g.trim()).map((item, i) => (
                          <li 
                            key={i}
                            className="text-sm text-[var(--foreground)] pl-4 border-l-2 border-[var(--gratitude)]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reflection */}
                  {entry.reflection && (
                    <div>
                      <div className="text-sm text-[var(--muted)] mb-1">Reflection</div>
                      <p className="text-sm text-[var(--foreground)] italic bg-[var(--background)] p-3 rounded-lg">
                        &ldquo;{entry.reflection}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Delete button */}
                  <div className="pt-2 border-t border-[var(--border)]">
                    {deleteConfirm === entry.id ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--muted)]">Delete this entry?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              onDeleteEntry(entry.date);
                              setDeleteConfirm(null);
                              setExpandedId(null);
                            }}
                            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(entry.id)}
                        className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete entry</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

