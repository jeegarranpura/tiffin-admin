import React from 'react';

const StopCard = ({ customer, index, isReorderable = false, onRemove, onDragStart }) => {
  const { name, address, type, eta } = customer;

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(index);
    }
    e.dataTransfer.setData("draggedIndex", index);
  };

  return (
    <div
      draggable={isReorderable}
      onDragStart={handleDragStart}
      className={`group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow ${isReorderable ? 'cursor-move' : ''
        }`}
    >
      {isReorderable && (
        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
          drag_indicator
        </span>
      )}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${index === 0 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
        }`}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold truncate">{name}</p>
          {type && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
              {type}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate">{address}</p>
      </div>

      {eta && (
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold uppercase text-slate-400">ETA</p>
          <p className="text-sm font-bold text-slate-900">{eta}</p>
        </div>
      )}

      {onRemove ? (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      ) : (
        <span className="material-symbols-outlined text-slate-300"></span>
      )}
    </div>
  );
};

export default StopCard;
