'use client';

import { SparklesIcon } from './Icons';

interface ReflectionCardProps {
  value: string;
  onChange: (value: string) => void;
}

const prompts = [
  "How are you feeling today?",
  "What's on your mind?",
  "Any wins or challenges?",
  "What would make tomorrow better?",
];

export function ReflectionCard({ value, onChange }: ReflectionCardProps) {
  const randomPrompt = prompts[new Date().getDay() % prompts.length];

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] card-hover animate-fade-in-up delay-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--accent-light)] flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>Daily Reflection</h3>
          <p className="text-xs text-[var(--muted)]">Optional thoughts & notes</p>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={randomPrompt}
        rows={3}
        className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
      />

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-[var(--muted)]">
          {value.length} characters
        </p>
        {value.length > 0 && (
          <button
            onClick={() => onChange('')}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

