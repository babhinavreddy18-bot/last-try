import React, { useState, useRef, useEffect } from 'react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

export const ThemeToggle: React.FC<{ variant?: 'navbar' | 'pill' | 'minimal' }> = ({ variant = 'navbar' }) => {
  const { themeMode, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: 'light',
      label: 'Light Mode',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      desc: 'Clean & bright appearance',
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      icon: <Moon className="w-4 h-4 text-purple-400" />,
      desc: 'Sleek dark command center',
    },
    {
      mode: 'system',
      label: 'System Default',
      icon: <Laptop className="w-4 h-4 text-blue-500" />,
      desc: 'Auto-sync with OS settings',
    },
  ];

  const currentOption = options.find((o) => o.mode === themeMode) || options[2];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs',
          variant === 'navbar'
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
        )}
        title="Change Theme Mode"
      >
        {currentOption.icon}
        <span className="hidden sm:inline font-semibold">{currentOption.label}</span>
        <ChevronDown className={clsx('w-3 h-3 transition-transform text-slate-500', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
            Theme Preference
          </div>
          {options.map((opt) => {
            const isSelected = themeMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => {
                  setThemeMode(opt.mode);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={clsx('p-1 rounded-lg', isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800')}>
                    {opt.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold leading-none">{opt.label}</p>
                    <p className={clsx('text-[10px] font-medium mt-0.5', isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500')}>
                      {opt.desc}
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
