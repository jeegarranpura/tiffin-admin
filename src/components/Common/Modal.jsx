import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[10000] animate-in fade-in duration-200">
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
