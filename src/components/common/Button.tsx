import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-xl font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30',
    secondary: 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700',
    outline: 'bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 border border-rose-400/30',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-4 py-3 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
