import React, { useState, useEffect } from 'react';
// import Header from '../../components/Layout/Header';
// import Button from '../../components/Common/Button';
// import PackingStats from './components/PackingStats';
// import PackingFilters from './components/PackingFilters';
// import PackingTable from './components/PackingTable';
// import MealSummary from './components/MealSummary';

const Button = React.lazy(() => import('../../components/Common/Button'));
const Header = React.lazy(() => import('../../components/Layout/Header'));
const PackingStats = React.lazy(() => import('./components/PackingStats'));
const PackingFilters = React.lazy(() => import('./components/PackingFilters'));
const PackingTable = React.lazy(() => import('./components/PackingTable'));
const MealSummary = React.lazy(() => import('./components/MealSummary'));

const PackingPage = (props) => {
  console.log('props', props)
  const { packingList, updateOrderStatusReq, isLoading, error, message, updateRouteStatusReq } = props;
  const [selectedRoute, setSelectedRoute] = useState(null);


  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
  }

  useEffect(() => {
    if (packingList?.length > 0) {
      setSelectedRoute(packingList[0])
    }
  }, [packingList?.length])

  return (
    <>
      {/* <Header title="Tiffin Packing" /> */}

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Page Title & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Packing Management</h2>
              <p className="text-slate-500 font-medium">Prepare and verify tiffins for delivery</p>
            </div>
            <div className="flex gap-2">
              {/* <Button variant="outline" icon="print">
                Print All Labels
              </Button>
              <Button icon="done_all">
                Complete Route
              </Button> */}
            </div>
          </div>

          <PackingStats />

          <PackingFilters
            packingList={packingList}
            selectedRoute={selectedRoute}
            handleSelectRoute={handleSelectRoute}
            updateRouteStatusReq={updateRouteStatusReq}
          />

          <PackingTable
            selectedRoute={selectedRoute}
            handleSelectRoute={handleSelectRoute}
            updateOrderStatusReq={updateOrderStatusReq}
            isLoading={isLoading}
            error={error}
            message={message}
          />

          {/* <MealSummary /> */}
        </div>
      </main>
    </>
  );
};

export default PackingPage;
