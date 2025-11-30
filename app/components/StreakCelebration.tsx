'use client';

import { useEffect, useState } from 'react';
import { FlameIcon, SparklesIcon } from './Icons';

interface StreakCelebrationProps {
  streak: number;
  isVisible: boolean;
  onClose: () => void;
}

const motivationalMessages = [
  { min: 1, max: 1, messages: [
    "You've started your wellness journey! 🌱",
    "Day 1 complete! Every journey begins with a single step.",
    "You showed up for yourself today. That's powerful!",
  ]},
  { min: 2, max: 3, messages: [
    "You're building momentum! Keep going! 💪",
    "Consistency is key, and you're nailing it!",
    "Two days strong! You're creating a habit.",
  ]},
  { min: 4, max: 6, messages: [
    "Almost a week! You're unstoppable! 🔥",
    "Your dedication is inspiring!",
    "Look at you go! Wellness warrior mode activated.",
  ]},
  { min: 7, max: 13, messages: [
    "A FULL WEEK! You're officially crushing it! 🏆",
    "7+ days of self-care! You should be so proud!",
    "One week down! Your future self thanks you.",
  ]},
  { min: 14, max: 20, messages: [
    "Two weeks of wellness! You're a natural! ⭐",
    "14 days! This is becoming second nature to you.",
    "Half a month of growth! Incredible!",
  ]},
  { min: 21, max: 29, messages: [
    "Three weeks! You've built a real habit! 🌟",
    "21 days - scientists say that's habit territory!",
    "You're proving what's possible with consistency!",
  ]},
  { min: 30, max: Infinity, messages: [
    "A MONTH OR MORE! You're absolutely legendary! 👑",
    "30+ days! You're an inspiration to everyone!",
    "This isn't a streak anymore, it's a lifestyle! 🌿",
  ]},
];

function getMotivationalMessage(streak: number): string {
  const category = motivationalMessages.find(
    cat => streak >= cat.min && streak <= cat.max
  );
  if (!category) return "Amazing work! Keep it up!";
  return category.messages[Math.floor(Math.random() * category.messages.length)];
}

function getMilestoneEmoji(streak: number): string {
  if (streak >= 30) return '👑';
  if (streak >= 21) return '🌟';
  if (streak >= 14) return '⭐';
  if (streak >= 7) return '🏆';
  if (streak >= 3) return '🔥';
  return '✨';
}

export function StreakCelebration({ streak, isVisible, onClose }: StreakCelebrationProps) {
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setMessage(getMotivationalMessage(streak));
      setShowConfetti(true);
      
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isVisible, streak, onClose]);

  if (!isVisible) return null;

  const emoji = getMilestoneEmoji(streak);
  const isMilestone = [7, 14, 21, 30, 50, 100].includes(streak);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Confetti particles */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '⭐', '🌟', '💫', '🔥'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div 
          className="bg-[var(--card)] rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto animate-celebration-pop"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Streak badge */}
          <div className="flex justify-center mb-4">
            <div className={`relative ${isMilestone ? 'animate-pulse-glow' : ''}`}>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--gratitude)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                <FlameIcon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold shadow-md">
                {streak}
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-2xl font-bold text-center text-[var(--foreground)] mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isMilestone ? `${emoji} Milestone Reached!` : `${emoji} Streak Extended!`}
          </h2>

          {/* Streak count */}
          <div className="text-center mb-4">
            <span className="text-5xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {streak}
            </span>
            <span className="text-lg text-[var(--muted)] ml-2">
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Motivational message */}
          <p className="text-center text-[var(--foreground)] mb-6 leading-relaxed">
            {message}
          </p>

          {/* Sparkles decoration */}
          <div className="flex justify-center gap-2 mb-6">
            <SparklesIcon className="w-5 h-5 text-[var(--gratitude)] animate-float" />
            <SparklesIcon className="w-5 h-5 text-[var(--primary)] animate-float delay-100" />
            <SparklesIcon className="w-5 h-5 text-[var(--accent)] animate-float delay-200" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold shadow-md hover:shadow-lg transition-all btn-press"
          >
            Keep Going! 💪
          </button>
        </div>
      </div>
    </>
  );
}

