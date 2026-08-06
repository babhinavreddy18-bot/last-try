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
  accentColor?: 'purple' | 'orange' | 'blue' | 'teal' | 'emerald' | 'amber' | 'rose';
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
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={clsx(
        'relative rounded-3xl p-6 bg-white border border-[#E5E7EB] overflow-hidden cursor-pointer group',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_4px_12px_rgba(109,74,255,0.04)]',
        'hover:border-[#DDD6FE] hover:shadow-[0_8px_28px_-4px_rgba(109,74,255,0.12),_0_2px_8px_rgba(0,0,0,0.04)]',
        'transition-all duration-200',
        className
      )}
    >
      {/* Top purple accent line on hover */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-3xl" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">{title}</span>
          <div className="mt-2">
            <h3 className="text-3xl font-black tracking-tight text-[#111827]">{value}</h3>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] text-[#6D4AFF] transition-all group-hover:scale-110 duration-200 shrink-0">
          {icon}
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-5 pt-4 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full',
                changeType === 'positive' && 'bg-[#DCFCE7] text-[#22C55E]',
                changeType === 'negative' && 'bg-[#FEE2E2] text-[#EF4444]',
                changeType === 'neutral' && 'bg-[#F3F4F6] text-[#6B7280]'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-[#6B7280] font-medium truncate">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};
