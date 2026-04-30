import React, { useState } from 'react';

/**
 * A common Collapse component that can be used to hide/show content.
 * 
 * @param {Object} props
 * @param {string} props.title - The title to display in the header (if header is not provided)
 * @param {React.ReactNode} props.header - Custom header content
 * @param {React.ReactNode} props.children - Content to be collapsed
 * @param {boolean} props.initialCollapsed - Initial state of the collapse
 * @param {string} props.className - Additional class names for the container
 * @param {string} props.headerClassName - Additional class names for the header
 * @param {string} props.contentClassName - Additional class names for the content
 */
const Collapse = ({ 
  title, 
  header, 
  children, 
  initialCollapsed = false, 
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  return (
    <div className={`border-b border-slate-200 transition-all ${className}`}>
      <div className={`flex items-center gap-3 p-6 ${headerClassName}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          <span className={`material-symbols-outlined text-slate-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}>
            expand_more
          </span>
        </button>
        <div className="flex-1 min-w-0">
          {header ? header : (
            <h2 
              className="text-lg font-bold text-slate-900 truncate cursor-pointer select-none"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {title}
            </h2>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className={`px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapse;
