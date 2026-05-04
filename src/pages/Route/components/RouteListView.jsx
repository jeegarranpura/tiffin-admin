import React, { useState, useMemo } from 'react';
import RouteCard from './RouteCard';
import MapMock from './MapMock';
import StopCard from './StopCard';

const Button = React.lazy(() => import('../../../components/Common/Button'));
const Collapse = React.lazy(() => import('../../../components/Common/Collapse'));
const Modal = React.lazy(() => import('../../../components/Common/Modal'));

const RouteListView = ({ routeList = [], onCreateNew, onEditInfo, deliveryAgents, fetchRouteListReq }) => {
  const [selectedRouteId, setSelectedRouteId] = useState(routeList[0]?.id || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeInfo, setRouteInfo] = useState({});
  const [dateQuery, setDateQuery] = useState(new Date().toISOString().split('T')[0]);
  const [proofOrder, setProofOrder] = useState(null);
  const [mealTime, setMealTime] = useState("Lunch");

  const handleViewProof = (order) => {
    setProofOrder(order);
  };

  const onHandleChangeDate = async (e) => {
    if (e.target.value) {
      setDateQuery(e.target.value);
      const dateQuery = e.target.value;
      // const mealTime = "Lunch";
      console.log("🚀 ~ onHandleChangeDate ~ fetchRouteListReq:", e.target.value)
      await fetchRouteListReq({ dateQuery, mealTime });
    } else {
      setDateQuery(new Date().toISOString().split('T')[0]);
    }
  }
  const onHandleChangeMealTime = async (e) => {
    if (e.target.value) {
      setMealTime(e.target.value);
      const mealTime = e.target.value;
      // const dateQuery = e.target.value;
      console.log("🚀 ~ onHandleChangeMealTime ~ fetchRouteListReq:", e.target.value)
      await fetchRouteListReq({ dateQuery, mealTime });
    } else {
      setMealTime("Lunch");
    }
  }

  // Mock data if routeList is empty (for development based on HTML)
  const displayRoutes = routeList.length > 0 ? routeList : [
    { id: 1, name: 'Route A - Downtown', status: 'Active', stops: 12, distance: '8.4 km', time: '45 mins' },
    { id: 2, name: 'Route B - North Side', status: 'Scheduled', stops: 8, distance: '12.1 km', time: '60 mins' },
    { id: 3, name: 'Route C - West Suburbs', status: 'Scheduled', stops: 15, distance: '18.2 km', time: '90 mins' },
  ];

  const selectedRoute = displayRoutes.find(r => r.id === selectedRouteId) || displayRoutes[0];
  const selectedAgent = deliveryAgents?.find(agent => agent.id === selectedRoute?.assignedTo);
  const [stopsList, setStopsList] = useState(selectedRoute?.Orders || []);

  React.useEffect(() => {
    setStopsList(selectedRoute?.Orders || []);
  }, [selectedRoute]);

  const filteredRoutes = displayRoutes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const location = useMemo(() => {
    return stopsList?.map((order, index) => {
      const lat = order.Customer.latitude;
      const lng = order.Customer.longitude;
      const name = order.Customer.name;
      const id = index + 1;
      return {
        id, name, lat, lng
      };
    });
  }, [stopsList]);

  const callback = React.useCallback((data) => {
    console.log('MapMock callback data:', data);
    setRouteInfo(data);
  }, []);


  return (
    <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full">
      {/* Left Panel: Route List */}
      <aside className="w-80 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 space-y-4 border-b border-slate-100">
          <Button
            className="w-full"
            icon="add"
            onClick={onCreateNew}
          >
            Create New Route
          </Button>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Search routes..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_month</span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              type="date"
              value={dateQuery}
              onChange={(e) => onHandleChangeDate(e)}
            />
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">meal_lunch</span>
            <select
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              value={mealTime}
              onChange={(e) => onHandleChangeMealTime(e)}
            >
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll p-4 space-y-3 max-h-[40rem]">
          {filteredRoutes.map(route => (
            <RouteCard
              key={route.id}
              route={route}
              isActive={selectedRouteId === route.id}
              onClick={() => setSelectedRouteId(route.id)}
            />
          ))}
        </div>
      </aside>

      {/* Main Panel: Map View */}
      <MapMock className="flex-1" locations={location} callback={callback} />

      {/* Right Panel: Route Details */}
      <aside className="w-96 border-l border-slate-200 flex flex-col shrink-0">
        <Collapse
          header={
            <div className="flex items-center justify-between flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate">{selectedRoute?.name}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditInfo(selectedRoute);
                }}
                disabled={['in-progress', 'completed', 'ready'].includes(selectedRoute?.status)}
                className={`text-primary text-sm font-bold shrink-0 ml-2 ${['in-progress', 'completed', 'ready'].includes(selectedRoute?.status) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'
                  }`}
              >
                Edit route
              </button>
            </div>
          }
          className="bg-white border-b border-slate-200"
          headerClassName="!p-6"
          contentClassName="!px-6 !pb-6"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Delivery Agent</p>
              <p className="font-bold text-sm">{selectedAgent?.name || 'Unassigned'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Total Distance</p>
                <p className="font-bold text-lg">{routeInfo?.totalDistance?.toFixed(2)} KM</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Total Time</p>
                <p className="font-bold text-lg">{routeInfo?.estimatedTime?.toFixed(2)} MINS</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg mt-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Description</p>
              <p className="font-bold text-sm">{selectedRoute?.description ? selectedRoute?.description : '-'}</p>
            </div>
          </div>
        </Collapse>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-600">Sequence Stops ({stopsList.length})</h3>
            <span className="text-xs text-slate-400">Fixed sequence</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {stopsList?.map((stop, index) => (
              <div key={`${stop.id}-${index}`}>
                <StopCard
                  order={stop}
                  index={index}
                  isReorderable={false}
                  onViewProof={handleViewProof}
                />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Proof of Delivery Modal */}
      <Modal
        isOpen={!!proofOrder}
        onClose={() => setProofOrder(null)}
        title="Proof of Delivery"
        maxWidth="max-w-4xl"
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Customer Details</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900 text-lg">{proofOrder?.Customer?.name}</p>
                <p className="text-sm text-slate-500 mt-1">{proofOrder?.Customer?.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="font-bold text-green-600 text-sm uppercase">{proofOrder?.status}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Time</p>
                  <p className="font-bold text-slate-900 text-sm">
                    {proofOrder?.deliveryTime ? new Date(proofOrder.deliveryTime).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Route & Agent</p>
                <p className="text-sm font-bold text-slate-800">{selectedRoute?.name}</p>
                <p className="text-xs text-slate-500 mt-1">Handled by: <span className="font-semibold">{selectedAgent?.name || 'Unknown'}</span></p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Delivery Photos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 text-center uppercase">House/Location</p>
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                    {proofOrder?.Delivery?.homePhoto ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${proofOrder.Delivery.homePhoto}`}
                        alt="House"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300 text-4xl">no_photography</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 text-center uppercase">Tiffin/Meal</p>
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                    {proofOrder?.Delivery?.tiffinPhoto ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${proofOrder.Delivery.tiffinPhoto}`}
                        alt="Tiffin"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300 text-4xl">no_photography</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Button variant="primary" onClick={() => setProofOrder(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RouteListView;
