'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TabType } from './types';
import { useWellnessData } from './hooks/useWellnessData';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { SleepCard } from './components/SleepCard';
import { GratitudeCard } from './components/GratitudeCard';
import { MovementCard } from './components/MovementCard';
import { ReflectionCard } from './components/ReflectionCard';
import { ProgressView } from './components/ProgressView';
import { HistoryView } from './components/HistoryView';
import { StreakCelebration } from './components/StreakCelebration';
import { CheckIcon } from './components/Icons';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('log');
  const [showSaved, setShowSaved] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const previousStreakRef = useRef<number | null>(null);
  const hadEntryTodayRef = useRef<boolean>(false);
  
  const { 
    entries,
    todayEntry, 
    stats, 
    getTodayDate,
    saveEntry, 
    deleteEntry,
    getWeeklyData 
  } = useWellnessData();

  // Form state
  const [sleep, setSleep] = useState(7);
  const [gratitude, setGratitude] = useState<string[]>(['', '', '']);
  const [movement, setMovement] = useState(0);
  const [reflection, setReflection] = useState('');

  // Create a snapshot of current form state for comparison
  const getCurrentSnapshot = useCallback(() => {
    return JSON.stringify({ sleep, gratitude, movement, reflection });
  }, [sleep, gratitude, movement, reflection]);

  // Hydrate form from today's entry
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Track if user already had an entry today when page loaded
  useEffect(() => {
    if (isHydrated && previousStreakRef.current === null) {
      previousStreakRef.current = stats.currentStreak;
      hadEntryTodayRef.current = !!todayEntry;
    }
  }, [isHydrated, stats.currentStreak, todayEntry]);

  useEffect(() => {
    if (todayEntry) {
      setSleep(todayEntry.sleep);
      setGratitude(todayEntry.gratitude);
      setMovement(todayEntry.movement);
      setReflection(todayEntry.reflection || '');
      // Set the last saved snapshot to prevent immediate auto-save
      lastSavedRef.current = JSON.stringify({
        sleep: todayEntry.sleep,
        gratitude: todayEntry.gratitude,
        movement: todayEntry.movement,
        reflection: todayEntry.reflection || '',
      });
    }
  }, [todayEntry]);

  // Check for streak increase after stats update
  useEffect(() => {
    if (!isHydrated || previousStreakRef.current === null) return;
    
    const prevStreak = previousStreakRef.current;
    const currentStreak = stats.currentStreak;
    const hadEntryBefore = hadEntryTodayRef.current;
    
    // Show celebration if:
    // 1. Streak increased, OR
    // 2. User didn't have entry today before, and now they do (first entry of the day)
    if (currentStreak > prevStreak || (!hadEntryBefore && todayEntry)) {
      setCelebrationStreak(currentStreak);
      setShowCelebration(true);
      hadEntryTodayRef.current = true;
    }
    
    previousStreakRef.current = currentStreak;
  }, [stats.currentStreak, isHydrated, todayEntry]);

  // Manual save function
  const handleSave = useCallback(() => {
    const currentSnapshot = getCurrentSnapshot();
    
    saveEntry({
      date: getTodayDate(),
      sleep,
      gratitude,
      movement,
      reflection: reflection.trim() || undefined,
    });
    
    lastSavedRef.current = currentSnapshot;
    setHasUnsavedChanges(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, [saveEntry, getTodayDate, sleep, gratitude, movement, reflection, getCurrentSnapshot]);

  // Debounced auto-save - only triggers after changes and 2 seconds of inactivity
  useEffect(() => {
    if (!isHydrated) return;
    
    const currentSnapshot = getCurrentSnapshot();
    
    // Check if there are actual changes from the last saved state
    if (currentSnapshot === lastSavedRef.current) {
      setHasUnsavedChanges(false);
      return;
    }
    
    // Check if there's any content worth saving
    const hasContent = gratitude.some(g => g.trim()) || movement > 0 || reflection.trim();
    if (!hasContent && sleep === 7) {
      // Default state with no meaningful content, don't save
      return;
    }
    
    setHasUnsavedChanges(true);
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (2 seconds of no changes)
    saveTimeoutRef.current = setTimeout(() => {
      // Double-check we still have changes before saving
      if (getCurrentSnapshot() !== lastSavedRef.current) {
        handleSave();
      }
    }, 2000);
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sleep, gratitude, movement, reflection, isHydrated, getCurrentSnapshot, handleSave]);

  const weeklyData = getWeeklyData();
  const todayDate = getTodayDate();

  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center animate-pulse">
            <span className="text-3xl">🌿</span>
          </div>
          <p className="text-[var(--muted)]">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--primary-light)]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--secondary-light)]/20 blur-3xl" />
      </div>

      {/* Main content */}
      <main className="relative max-w-lg mx-auto px-4 pt-6">
        <Header todayDate={todayDate} hasEntryToday={!!todayEntry} />

        {/* Tab Content */}
        {activeTab === 'log' && (
          <div className="space-y-4">
            {/* 3x3 explanation banner */}
            <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl p-4 border border-[var(--primary)]/20">
              <h2 className="font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                The 3x3 Routine
              </h2>
              <p className="text-sm text-[var(--muted)]">
                <strong className="text-[var(--accent)]">Sleep</strong> 7-8hrs • 
                <strong className="text-[var(--gratitude)]"> Gratitude</strong> 3 things • 
                <strong className="text-[var(--primary)]"> Movement</strong> 30min
              </p>
            </div>

            <SleepCard value={sleep} onChange={setSleep} />
            <GratitudeCard values={gratitude} onChange={setGratitude} />
            <MovementCard value={movement} onChange={setMovement} />
            <ReflectionCard value={reflection} onChange={setReflection} />

            {/* Manual save button */}
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 btn-press flex items-center justify-center gap-2"
            >
              {showSaved ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Today&apos;s Entry</span>
              )}
            </button>

            {/* Auto-save indicator */}
            <p className="text-center text-xs text-[var(--muted)]">
              {hasUnsavedChanges ? '⏳ Saving...' : '✨ Your progress auto-saves as you go'}
            </p>
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressView stats={stats} weeklyData={weeklyData} />
        )}

        {activeTab === 'history' && (
          <HistoryView entries={entries} onDeleteEntry={deleteEntry} />
        )}
      </main>

      {/* Save toast */}
      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium shadow-lg transition-all duration-300 flex items-center gap-2 ${
          showSaved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <CheckIcon className="w-4 h-4" />
        Entry saved!
      </div>

      {/* Streak celebration modal */}
      <StreakCelebration 
        streak={celebrationStreak}
        isVisible={showCelebration}
        onClose={handleCloseCelebration}
      />

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
