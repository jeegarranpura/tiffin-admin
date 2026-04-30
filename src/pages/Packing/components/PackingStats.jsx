import React from 'react';

const PackingStats = ({ progress = 71, total = 200, ready = 142 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Overall Packing Progress</p>
            <p className="text-xs text-slate-500">{ready} of {total} tiffins ready for dispatch</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary">{progress}%</span>
        </div>
      </div>
      <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PackingStats;
