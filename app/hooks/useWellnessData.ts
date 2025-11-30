'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DailyEntry, WellnessStats } from '../types';

const STORAGE_KEY = 'wellness-3x3-entries';

export function useWellnessData() {
  const [entries, setEntries] = useLocalStorage<DailyEntry[]>(STORAGE_KEY, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  // Get entry for a specific date
  const getEntryByDate = useCallback((date: string): DailyEntry | undefined => {
    return entries.find(entry => entry.date === date);
  }, [entries]);

  // Get today's entry
  const todayEntry = useMemo(() => {
    return getEntryByDate(getTodayDate());
  }, [getEntryByDate, getTodayDate]);

  // Save or update an entry
  const saveEntry = useCallback((entryData: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const existingEntry = getEntryByDate(entryData.date);

    if (existingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.date === entryData.date 
          ? { ...entry, ...entryData, updatedAt: now }
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: DailyEntry = {
        ...entryData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setEntries(prev => [...prev, newEntry].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    }
  }, [getEntryByDate, setEntries]);

  // Delete an entry
  const deleteEntry = useCallback((date: string) => {
    setEntries(prev => prev.filter(entry => entry.date !== date));
  }, [setEntries]);

  // Calculate streak
  const calculateStreak = useCallback((): { current: number; longest: number } => {
    if (entries.length === 0) return { current: 0, longest: 0 };

    const sortedDates = entries
      .map(e => e.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = getTodayDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check if streak is active (today or yesterday has an entry)
    const hasToday = sortedDates.includes(today);
    const hasYesterday = sortedDates.includes(yesterdayStr);
    
    if (!hasToday && !hasYesterday) {
      // No active streak
      currentStreak = 0;
    } else {
      // Calculate current streak
      const startDate = hasToday ? today : yesterdayStr;
      let checkDate = new Date(startDate);
      
      while (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
  }, [entries, getTodayDate]);

  // Calculate statistics
  const stats = useMemo((): WellnessStats => {
    const { current, longest } = calculateStreak();
    
    if (entries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        averageSleep: 0,
        averageMovement: 0,
        totalGratitudeItems: 0,
      };
    }

    const totalSleep = entries.reduce((sum, e) => sum + e.sleep, 0);
    const totalMovement = entries.reduce((sum, e) => sum + e.movement, 0);
    const totalGratitude = entries.reduce((sum, e) => sum + e.gratitude.filter(g => g.trim()).length, 0);

    return {
      currentStreak: current,
      longestStreak: longest,
      totalEntries: entries.length,
      averageSleep: totalSleep / entries.length,
      averageMovement: totalMovement / entries.length,
      totalGratitudeItems: totalGratitude,
    };
  }, [entries, calculateStreak]);

  // Get entries for the last N days
  const getRecentEntries = useCallback((days: number): DailyEntry[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries]);

  // Get last 7 days data for chart
  const getWeeklyData = useCallback(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = getEntryByDate(dateStr);
      
      data.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sleep: entry?.sleep || 0,
        movement: entry?.movement || 0,
        gratitude: entry?.gratitude.filter(g => g.trim()).length || 0,
        hasEntry: !!entry,
      });
    }
    return data;
  }, [getEntryByDate]);

  return {
    entries,
    todayEntry,
    stats,
    getTodayDate,
    getEntryByDate,
    saveEntry,
    deleteEntry,
    getRecentEntries,
    getWeeklyData,
  };
}

