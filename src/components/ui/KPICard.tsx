import React from 'react';
import { GlassPanel } from './GlassPanel';

interface KPICardProps {
  label: string;
  value: string | number;
  colorClass: string;
}

export const KPICard = ({ label, value, colorClass }: KPICardProps) => {
  return (
    <GlassPanel className={`border-t-4 border-t-${colorClass.replace('text-', '')} text-center`}>
      <p className="text-xs uppercase tracking-widest text-foam-white/60 mb-2">{label}</p>
      <p className={`text-4xl font-mono ${colorClass}`}>{value}</p>
    </GlassPanel>
  );
};
