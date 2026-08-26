import { GlassPanel } from './GlassPanel';

interface KPICardProps {
  label: string;
  value: string | number;
  colorClass: string;
}

export const KPICard = ({ label, value, colorClass }: KPICardProps) => {
  return (
    <GlassPanel className="text-center rounded-3xl p-6 glass-panel border-t-2 border-t-white/40 shadow-xl">
      <p className="text-xs uppercase tracking-widest text-white/80 font-medium mb-2">{label}</p>
      <p className={`text-4xl font-mono font-bold drop-shadow ${colorClass}`}>{value}</p>
    </GlassPanel>
  );
};
