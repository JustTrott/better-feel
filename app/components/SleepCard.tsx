'use client';

import { MoonIcon } from './Icons';

interface SleepCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function SleepCard({ value, onChange }: SleepCardProps) {
  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { label: 'Optimal', bgColor: 'bg-[var(--primary)]/15', textColor: 'text-[var(--primary)]' };
    if (hours >= 6 && hours < 7) return { label: 'Fair', bgColor: 'bg-[var(--gratitude)]/15', textColor: 'text-[var(--gratitude)]' };
    if (hours > 9) return { label: 'Oversleep', bgColor: 'bg-[var(--secondary)]/15', textColor: 'text-[var(--secondary-dark)]' };
    return { label: 'Low', bgColor: 'bg-[var(--accent)]/15', textColor: 'text-[var(--accent-dark)]' };
  };

  const quality = getSleepQuality(value);

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] card-hover animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-sleep flex items-center justify-center">
          <MoonIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>Sleep</h3>
          <p className="text-xs text-[var(--muted)]">Target: 7-8 hours</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-4xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
            {value}
            <span className="text-lg font-normal text-[var(--muted)] ml-1">hrs</span>
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${quality.bgColor} ${quality.textColor}`}>
            {quality.label}
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(value / 12) * 100}%, var(--border) ${(value / 12) * 100}%, var(--border) 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          💡 Sleep boosts mood & memory (Walker, 2017)
        </p>
      </div>
    </div>
  );
}
