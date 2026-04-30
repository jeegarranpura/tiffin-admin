import React from 'react';

const Badge = ({ children, variant = 'slate', className = '' }) => {
  const variants = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full whitespace-nowrap ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
