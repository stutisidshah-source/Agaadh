import React from 'react';

type StatusType = 'known' | 'uncertain' | 'novel' | 'artifact';

interface StatusChipProps {
  status: StatusType;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  let colorClasses = '';
  
  switch (status) {
    case 'known':
      colorClasses = 'bg-mid-teal-light/20 text-mid-teal-light border-mid-teal-light/50';
      break;
    case 'uncertain':
      colorClasses = 'bg-gold/20 text-gold border-gold/50';
      break;
    case 'novel':
      colorClasses = 'bg-cyan-bright/20 text-cyan-bright border-cyan-bright/50';
      break;
    case 'artifact':
      colorClasses = 'bg-red-400/20 text-red-400 border-red-400/50';
      break;
  }

  return (
    <span className={`px-2 py-1 text-xs font-mono border rounded ${colorClasses}`}>
      {status.toUpperCase()}
    </span>
  );
};
