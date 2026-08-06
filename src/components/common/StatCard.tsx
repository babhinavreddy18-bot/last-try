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
  className,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl p-5 bg-white border border-[#E2E8F0] shadow-card flex flex-col justify-between overflow-hidden cursor-pointer group transition-all',
        className
      )}
    >
      {/* Top Electric Blue Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">{title}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">{value}</h3>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-2xs transition-all group-hover:scale-105">
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg border',
                changeType === 'positive' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                changeType === 'negative' && 'bg-rose-50 text-rose-700 border-rose-200',
                changeType === 'neutral' && 'bg-slate-100 text-slate-700 border-slate-200'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-[#64748B] font-semibold truncate">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};
