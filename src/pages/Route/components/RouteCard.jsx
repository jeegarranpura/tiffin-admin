import React from 'react';
import Badge from '../../../components/Common/Badge';

const RouteCard = ({ route, isActive, onClick }) => {
  const { name, status, Orders, distance, time, Customers } = route;

  const statusVariants = {
    'Active': 'green',
    'Scheduled': 'slate',
    'Completed': 'blue',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isActive
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-slate-200 hover:border-slate-300 bg-white'
        }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
          {name}
        </h3>
        <Badge variant={statusVariants[status] || 'slate'} className='bg-white'>
          {status}
        </Badge>
      </div>
      <div className="text-sm text-slate-500 space-y-1 flex gap-3">
        <p className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {Orders?.length} {Orders?.length > 1 ? 'Stops' : 'Stop'}
        </p>
        <p className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">person</span>
          {Customers?.length} {Customers?.length > 1 ? 'Customers' : 'Customer'}
        </p>
        {/* <p className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Est. {time}
        </p> */}
      </div>
    </div>
  );
};

export default RouteCard;
