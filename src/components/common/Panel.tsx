import React from 'react';

interface PanelProps {
  className?: string;
  subtle?: boolean;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ className = '', subtle = false, children }) => {
  return (
    <div
      className={`${
        subtle ? 'glass-panel-subtle' : 'glass-panel'
      } rounded-xl p-3 border border-slate-700/60 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Panel;
