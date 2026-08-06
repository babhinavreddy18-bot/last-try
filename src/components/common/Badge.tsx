import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'green' | 'amber' | 'red' | 'slate';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 dark:bg-indigo-950/70 text-blue-700 dark:text-indigo-300 border-blue-200/90 dark:border-indigo-800/90 font-bold',
    teal: 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200/90 dark:border-teal-800/90 font-bold',
    green: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800/90 font-bold',
    amber: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/90 font-bold',
    red: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200/90 dark:border-rose-800/90 font-bold',
    slate: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-bold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border shadow-2xs transition-all',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 inline-flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
};

