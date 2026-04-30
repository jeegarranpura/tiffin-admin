import React from 'react';

const SlideOver = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md', className }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end animate-in fade-in duration-300 ${className}`}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideOver;
