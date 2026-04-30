import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-slate-500 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 !cursor-not-allowed' : ''}
      `}
      {...props}
      disabled={disabled}
    >
      {Icon && <span className="material-symbols-outlined text-lg">{Icon}</span>}
      {children}
    </button>
  );
};

export default Button;
