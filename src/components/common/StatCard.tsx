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
    blue: 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 border-blue-200 dark:border-indigo-800/80 shadow-glow-blue',
    teal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800/80 shadow-glow-teal',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/80',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/80',
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: 'var(--shadow-float)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={clsx(
        'relative glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between overflow-hidden cursor-pointer group',
        className
      )}
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</h3>
          </div>
        </div>
        <div className={clsx('p-3 rounded-xl border shadow-xs transition-all group-hover:scale-110', accentIconStyles[accentColor])}>
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg border',
                changeType === 'positive' && 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
                changeType === 'negative' && 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
                changeType === 'neutral' && 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400 font-semibold truncate">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};

