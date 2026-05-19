import React from 'react';
// import Button from '../../../components/Common/Button';

const Button = React.lazy(() => import('../../../components/Common/Button'));

const PackingFilters = (props) => {
  const { packingList, selectedRoute, handleSelectRoute, updateRouteStatusReq } = props;

  const routes = [
    { name: 'Downtown Route', count: 42, active: true },
    { name: 'Suburban East', count: 38 },
    { name: 'North Campus', count: 55 },
    { name: 'Industrial Park', count: 65 },
  ];

  const handleOnClickRouteComplete = async (routeId) => {
    const res = await updateRouteStatusReq({ id: routeId, status: 'ready' })
    if (res?.payload) {
      selectedRoute.status = 'ready'

    }
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 max-w-5xl">
          {packingList?.map((route) => (
            <button
              key={route.name}
              onClick={() => handleSelectRoute(route)}
              className={`px-1 pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-1 ${selectedRoute?.id === route.id
                ? 'text-primary border-primary'
                : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
            >
              {route.name} ({route?.Orders?.length})
              {(route?.status || selectedRoute.status) === 'ready' && <span className="text-green-500 material-symbols-outlined"> check_circle </span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Pending: {selectedRoute?.Orders?.filter((order) => order.status === 'pending').length}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Packed: {selectedRoute?.Orders?.filter((order) => order.status === 'packed').length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" icon="print">
            Print All Labels
          </Button> */}
          <Button
            icon="done_all"
            onClick={() => handleOnClickRouteComplete(selectedRoute?.id)}
            disabled={selectedRoute?.Orders?.filter((order) => order?.status === 'pending').length > 0 || selectedRoute?.status === 'ready'}
          >
            {selectedRoute?.status === 'ready' ? 'Completed' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackingFilters;
