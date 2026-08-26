import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassPanel = ({ children, className = '', ...props }: GlassPanelProps) => {
  return (
    <div 
      className={`glass-panel rounded-2xl p-6 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
