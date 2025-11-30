'use client';

import { ActivityIcon } from './Icons';

interface MovementCardProps {
  value: number;
  onChange: (value: number) => void;
}

const presets = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

export function MovementCard({ value, onChange }: MovementCardProps) {
  const getMovementStatus = (minutes: number) => {
    if (minutes >= 30) return { label: 'Goal Met! 🎉', color: 'text-[var(--primary)]' };
    if (minutes >= 15) return { label: 'Good Start', color: 'text-[var(--gratitude)]' };
    if (minutes > 0) return { label: 'Keep Going', color: 'text-[var(--secondary)]' };
    return { label: 'Not Yet', color: 'text-[var(--muted)]' };
  };

  const status = getMovementStatus(value);
  const progressPercent = Math.min((value / 30) * 100, 100);

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] card-hover animate-fade-in-up delay-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-movement flex items-center justify-center">
          <ActivityIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>Movement</h3>
          <p className="text-xs text-[var(--muted)]">Target: 30 minutes</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 progress-ring" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="var(--border)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - progressPercent / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[var(--foreground)]">{value}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-[var(--foreground)] mb-1">minutes</div>
            <div className={`text-sm font-medium ${status.color}`}>{status.label}</div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onChange(preset.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 btn-press ${
                value === preset.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--border)]/50 text-[var(--foreground)] hover:bg-[var(--primary)]/20'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(Math.max(0, value - 5))}
            className="w-10 h-10 rounded-full bg-[var(--border)]/50 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--border)] transition-colors btn-press"
          >
            −
          </button>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(value / 120) * 100}%, var(--border) ${(value / 120) * 100}%, var(--border) 100%)`
            }}
          />
          <button
            onClick={() => onChange(Math.min(120, value + 5))}
            className="w-10 h-10 rounded-full bg-[var(--border)]/50 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--border)] transition-colors btn-press"
          >
            +
          </button>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          💡 Movement reduces anxiety (Biddle & Asare, 2011)
        </p>
      </div>
    </div>
  );
}

