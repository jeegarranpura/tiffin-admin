import React from 'react';

const MealSummaryCard = ({ title, meal, units, packed, pending, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-slate-900">{meal}</h4>
        <span className={`px-2 py-1 text-sm font-black rounded-lg ${variants[variant]}`}>
          {units} Units
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {packed} Packed | {pending} Pending
      </p>
    </div>
  );
};

const MealSummary = () => {
  const summaries = [
    {
      title: 'Menu Component A (Non-Veg)',
      meal: 'Chicken Curry',
      units: 85,
      packed: 60,
      pending: 25,
      variant: 'primary',
    },
    {
      title: 'Menu Component B (Veg)',
      meal: 'Paneer Tikka',
      units: 115,
      packed: 82,
      pending: 33,
      variant: 'emerald',
    },
    {
      title: 'Sides / Add-ons',
      meal: 'Dal Tadka',
      units: 200,
      packed: 142,
      pending: 58,
      variant: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaries.map((s, index) => (
        <MealSummaryCard key={index} {...s} />
      ))}
    </div>
  );
};

export default MealSummary;
