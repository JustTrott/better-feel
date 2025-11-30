'use client';

import { SunIcon } from './Icons';

interface HeaderProps {
  todayDate: string;
  hasEntryToday: boolean;
}

export function Header({ todayDate, hasEntryToday }: HeaderProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="pt-safe mb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
            <SunIcon className="w-4 h-4" />
            <span className="text-sm">{formatDate(todayDate)}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
            {getGreeting()} ✨
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {hasEntryToday 
              ? "You've logged today. Great job!" 
              : "Ready to log your 3x3?"}
          </p>
        </div>
        
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center shadow-md">
          <span className="text-2xl">🌿</span>
        </div>
      </div>
    </header>
  );
}

