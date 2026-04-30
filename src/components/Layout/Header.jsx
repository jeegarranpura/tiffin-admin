import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full ml-auto">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">{title || 'Management'}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
