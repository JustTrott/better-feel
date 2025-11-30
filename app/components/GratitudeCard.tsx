'use client';

import { useState } from 'react';
import { HeartIcon, CheckIcon } from './Icons';

interface GratitudeCardProps {
  values: string[];
  onChange: (values: string[]) => void;
}

const placeholders = [
  "Something that made you smile today...",
  "A person you're grateful for...",
  "A small moment of joy...",
];

export function GratitudeCard({ values, onChange }: GratitudeCardProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const filledCount = values.filter(v => v.trim()).length;

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] card-hover animate-fade-in-up delay-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-gratitude flex items-center justify-center">
          <HeartIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>Gratitude</h3>
          <p className="text-xs text-[var(--muted)]">Write 3 things you&apos;re grateful for</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < filledCount ? 'bg-[var(--gratitude)]' : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              values[index]?.trim() 
                ? 'bg-[var(--gratitude)] text-white' 
                : 'bg-[var(--border)] text-[var(--muted)]'
            }`}>
              {values[index]?.trim() ? (
                <CheckIcon className="w-3.5 h-3.5" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <input
              type="text"
              value={values[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              placeholder={placeholders[index]}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)]/50 ${
                focusedIndex === index 
                  ? 'border-[var(--gratitude)] ring-2 ring-[var(--gratitude)]/20' 
                  : 'border-[var(--border)] hover:border-[var(--gratitude)]/50'
              }`}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] leading-relaxed mt-4">
        💡 Gratitude increases life satisfaction (Emmons & McCullough, 2003)
      </p>
    </div>
  );
}

