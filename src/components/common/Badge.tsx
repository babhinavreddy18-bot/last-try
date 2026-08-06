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
  size = 'md',
  icon,
  className,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-bold',
    md: 'px-2.5 py-1 text-xs font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] shadow-2xs transition-all',
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 inline-flex items-center justify-center text-[#2563EB]">{icon}</span>}
      {children}
    </span>
  );
};
