import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: 'blue' | 'teal' | 'emerald' | 'amber' | 'rose';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
  accentColor = 'blue',
  className,
  onClick,
}) => {
  const accentIconStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={clsx(
        'relative bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between overflow-hidden cursor-pointer group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-lg border shadow-2xs transition-transform group-hover:scale-105', accentIconStyles[accentColor])}>
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded',
                changeType === 'positive' && 'bg-emerald-50 text-emerald-700',
                changeType === 'negative' && 'bg-rose-50 text-rose-700',
                changeType === 'neutral' && 'bg-slate-100 text-slate-600'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-medium truncate">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};
