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
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border shadow-2xs transition-colors',
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
