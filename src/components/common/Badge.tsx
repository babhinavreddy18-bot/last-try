import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'orange' | 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'teal';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  icon,
  className,
}) => {
  const variantStyles: Record<string, string> = {
    purple: 'bg-[#EDE9FE] text-[#6D4AFF] border-[#DDD6FE]',
    orange: 'bg-[#FFEDD5] text-[#F97316] border-[#FED7AA]',
    green:  'bg-[#DCFCE7] text-[#22C55E] border-[#BBF7D0]',
    amber:  'bg-[#FEF3C7] text-[#F59E0B] border-[#FDE68A]',
    red:    'bg-[#FEE2E2] text-[#EF4444] border-[#FECACA]',
    gray:   'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
    // Legacy aliases
    blue:   'bg-[#EDE9FE] text-[#6D4AFF] border-[#DDD6FE]',
    teal:   'bg-[#DCFCE7] text-[#22C55E] border-[#BBF7D0]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-bold',
    md: 'px-2.5 py-1 text-[11px] font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border transition-all',
        variantStyles[variant] || variantStyles.purple,
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
};
