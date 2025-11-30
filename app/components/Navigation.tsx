'use client';

import { TabType } from '../types';
import { PlusIcon, TrendingUpIcon, CalendarIcon } from './Icons';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'log' as TabType, label: 'Log', icon: PlusIcon },
    { id: 'progress' as TabType, label: 'Progress', icon: TrendingUpIcon },
    { id: 'history' as TabType, label: 'History', icon: CalendarIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)]">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 btn-press ${
                  isActive 
                    ? 'text-[var(--primary)] bg-[var(--primary)]/10' 
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area padding for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

