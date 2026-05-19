import React, { useState, useMemo } from 'react';
import StopCard from './StopCard';
import MapMock from './MapMock';
import Button from '../../../components/Common/Button';
import Badge from '../../../components/Common/Badge';
import Collapse from '../../../components/Common/Collapse';

const RouteUpdateView = ({ initialRoute = null, onSave, onDiscard, deliveryAgents = [], customerList }) => {
  const [routeName, setRouteName] = useState(initialRoute?.name || '');
  const [selectedAgent, setSelectedAgent] = useState(initialRoute?.assignedTo || '');
  const [notes, setNotes] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const orders = initialRoute?.Orders || [];
  const customers = initialRoute?.Customers || [];
  const [routeInfo, setRouteInfo] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  const [stopsList, setStopsList] = useState(initialRoute?.Orders || []);
  const [availableCustomers, setAvailableCustomers] = useState(customerList?.filter(customer => !stopsList.some(order => order.Customer.id === customer.id) && customer.routeId === null));
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedOverIndex !== index) {
      setDraggedOverIndex(index);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    setDraggedIndex(null);
    setDraggedOverIndex(null);

    if (isNaN(sourceIndex) || sourceIndex === index) return;

    const newStopsList = [...stopsList];
    const [draggedItem] = newStopsList.splice(sourceIndex, 1);
    newStopsList.splice(index, 0, draggedItem);
    setStopsList(newStopsList);
  };

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

  const addCustomerinRoute = (customer) => {
    const stopListing = [...stopsList, { ...customer, Customer: customer, customerId: customer.id }];
    setStopsList(stopListing);
    setAvailableCustomers(customerList?.filter(customer => !stopListing.some(order => order.Customer.id === customer.id) && customer.routeId === null));
  };
  const removeCustomerinRoute = (customerId) => {
    const stopListing = stopsList.filter(stop => stop.customerId !== customerId);
    setStopsList(stopListing);
    setAvailableCustomers([...availableCustomers, customerList.find(customer => customer.id === customerId && customer.routeId === null)]);
  };

  const handleSaveRoute = () => {
    const routeData = {
      name: routeName,
      assignedTo: selectedAgent,
      description: notes,
      type: 'daily',
      customerIds: stopsList.map(stop => stop.customerId)
    };
    console.log('routeData', routeData)
    onSave(routeData);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
    setDraggedIndex(index);
    // Use a small delay to make the element semi-transparent only AFTER the drag has started
    setTimeout(() => {
      if (e.target && e.target.style) {
        e.target.style.opacity = '0.4';
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target && e.target.style) {
      e.target.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleSearchedCustomer = (val) => {
    if (val === '') {
      setAvailableCustomers(customerList?.filter(customer => !stopsList.some(order => order.Customer.id === customer.id)));
    } else {
      const filteredCustomers = customerList?.filter((customer) => customer.name.toLowerCase().includes(val.toLowerCase()) && !stopsList.some(order => order.Customer.id === customer.id));
      setAvailableCustomers(filteredCustomers);
    }
    setSearchCustomer(val)
  }


  return (
    <div className="flex flex-col gap-6">
      {/* Page Title Section */}
      <div className="flex justify-between items-center shrink-0 bg-white p-6 rounded-xl">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {initialRoute ? 'Edit Route Sequence' : 'Create New Route'}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Adjust delivery order and assigned personnel for optimal efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={initialRoute?.status === 'Active' ? 'emerald' : 'slate'} className="">{initialRoute?.status}</Badge>
          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
          <Button variant="outline" onClick={onDiscard}>Discard</Button>
          <Button onClick={() => handleSaveRoute()}>Save Changes</Button>
        </div>
      </div>

      <div className="flex-1 flex  min-h-0 w-full">
        {/* Left Column (40%) */}
        {/* <div className="w-[40%] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"> */}
        <aside className="w-80 border-r border-slate-200 flex flex-col shrink-0">

          {/* Route Details Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <h4 className="text-lg font-bold">Route Details</h4>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Route Name</label>
                <input
                  className="w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none px-4 py-2.5 text-sm font-medium"
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Route A - Downtown"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Assigned Delivery Agent</label>
                <select
                  className="w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none px-4 py-2.5 text-sm font-medium appearance-none"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">Select an agent</option>
                  {deliveryAgents.length > 0 ? (
                    deliveryAgents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.username}</option>
                    ))
                  ) : (
                    <>
                      <option value="1">John Smith</option>
                      <option value="2">Sarah Jenkins</option>
                      <option value="3">Michael Chen</option>
                    </>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Route Notes</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none px-4 py-2.5 text-sm font-medium resize-none"
                  placeholder="Enter special instructions for this route..."
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Add Customers Card */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col !h-[40rem] max-h-[40rem]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <h4 className="text-lg font-bold">Add Customers</h4>
              </div>
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">{availableCustomers.length} Available</span>
            </div>
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                className="w-full border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Search by name or address..."
                type="text"
                value={searchCustomer}
                onChange={(e) => handleSearchedCustomer(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {availableCustomers.map(customer => (
                <div key={customer.id} className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-3">
                    <span className='material-symbols-outlined text-primary'>person</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.address}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-primary bg-white border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                    onClick={() => addCustomerinRoute(customer)}>
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
        {/* </div> */}
        <MapMock className="flex-1" locations={location} isMini={false} callback={callback} />

        {/* Right Column (60%) */}
        {/* <div className="w-[60%] min-h-0"> */}
        <aside className="w-96 border-l border-slate-200 flex flex-col shrink-0">
          <Collapse
            className="bg-white  rounded-xl shadow-sm border border-slate-200 flex flex-col relative h-auto mb-2"
            header={<div className="flex items-center !p-0 justify-between">
              <div>
                <h4 className="text-lg font-bold">Route Sequence ({orders?.length} Stops)</h4>
                <p className="text-xs text-slate-400">
                  Total distance: <span className="font-bold text-slate-600">{routeInfo?.totalDistance?.toFixed(2)} KM</span> •
                  Estimated time: <span className="font-bold text-slate-600"> {routeInfo?.estimatedTime?.toFixed(2)} MINS</span>
                </p>
              </div>
              {/* <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary hover:text-white" icon="auto_fix_high">
              Optimize Route
            </Button> */}
            </div>}
          >
            {/* <section className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden relative"> */}
            {/* Card Header */}
            {/* <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white z-10">
              <div>
                <h4 className="text-lg font-bold">Route Sequence ({orders?.length} Stops)</h4>
                <p className="text-xs text-slate-400">
                  Total distance: <span className="font-bold text-slate-600">{routeInfo?.totalDistance?.toFixed(2)} KM</span> •
                  Estimated time: <span className="font-bold text-slate-600"> {routeInfo?.estimatedTime?.toFixed(2)} MINS</span>
                </p>
              </div>
              {/* <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary hover:text-white" icon="auto_fix_high">
                Optimize Route
              </Button> */}
            {/* </div> */}

            {/* Mini-Map Preview */}
            {/* <MapMock className="h-48 border-b border-slate-200" locations={location} isMini={true} /> */}

            {/* Sequence List */}
            <div
              className="flex-1 overflow-y-auto  space-y-3 custom-scrollbar bg-slate-50/50"
              onDragOver={(e) => {
                // Allow dropping at the end of the list
                if (e.target === e.currentTarget) {
                  handleDragOver(e, stopsList.length);
                }
              }}
              onDrop={(e) => {
                if (e.target === e.currentTarget) {
                  handleDrop(e, stopsList.length);
                }
              }}
            >
              {stopsList.map((stop, index) => (
                <div
                  key={stop.id}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={() => { }}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  draggable
                  className={`relative transition-all duration-300 ${draggedIndex === index ? 'opacity-40 scale-95 select-none' : 'opacity-100'
                    }`}
                >
                  {draggedOverIndex === index && draggedIndex !== index && (
                    <div className="absolute -top-1.5 left-0 right-0 h-1 bg-primary rounded-full z-10 animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  )}
                  <StopCard
                    customer={stop?.Customer}
                    index={index}
                    isReorderable={true}
                  // onRemove={() => removeCustomerinRoute(stop.customerId)}
                  />
                  {draggedOverIndex === index + 1 && index === stopsList.length - 1 && draggedIndex !== index && (
                    <div className="absolute -bottom-1.5 left-0 right-0 h-1 bg-primary rounded-full z-10 animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  )}
                </div>
              ))}
              {stopsList.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-xl p-8">
                  <span className="material-symbols-outlined text-4xl">route</span>
                  <p className="text-sm font-medium">Add customers from the left to build your route</p>
                </div>
              )}
            </div>
            {/* </section> */}
          </Collapse>

          <Collapse
            className="bg-white  rounded-xl border border-slate-200 flex flex-col relative h-auto mb-2"
            initialCollapsed={false}

            header={<div className="p-0 flex items-center justify-between">
              <h4 className="text-lg font-bold">Customer Details</h4>

              {/* <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary hover:text-white" icon="auto_fix_high">
              Optimize Route
            </Button> */}
            </div>}
          >

            {/* Sequence List */}
            <div
              className="flex-1 overflow-y-auto  space-y-3 custom-scrollbar bg-slate-50/50"
              onDragOver={(e) => {
                // Allow dropping at the end of the list
                if (e.target === e.currentTarget) {
                  handleDragOver(e, stopsList.length);
                }
              }}
              onDrop={(e) => {
                if (e.target === e.currentTarget) {
                  handleDrop(e, stopsList.length);
                }
              }}
            >
              {customers.map((stop, index) => (
                <div
                  key={stop.id}
                  className={`relative transition-all duration-300 ${draggedIndex === index ? 'opacity-40 scale-95 select-none' : 'opacity-100'
                    }`}
                >
                  <StopCard
                    customer={stop}
                    index={index}
                    isReorderable={true}
                    onRemove={() => removeCustomerinRoute(stop.id)}
                  />
                </div>
              ))}
            </div>
          </Collapse>

        </aside>
        {/* </div> */}
      </div>
    </div>
  );
};

export default RouteUpdateView;
