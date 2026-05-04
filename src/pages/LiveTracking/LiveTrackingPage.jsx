import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MapMock from '../Route/components/MapMock';
import Button from '../../components/Common/Button';
import { fetchGetRouteMapData } from '../../utils/route-utils';
import { initiateSocketConnection, disconnectSocket, subscribeToRouteTracking } from '../../utils/socket';
import { updateLiveLocation } from '../../features/RouteContainer/RouteSlice';

const LiveTrackingPage = () => {
    const { routeId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeSummary, setRouteSummary] = useState({ totalDistance: 0, estimatedTime: 0 });

    const token = localStorage.getItem('token')
    const liveLocations = useSelector(state => state.route.liveLocations);
    // Robust lookup for agent location handling string/number ID mismatch
    const agentLocation = useMemo(() => {
        const key = Object.keys(liveLocations).find(k => String(k) === String(routeId));
        return key ? liveLocations[key] : null;
    }, [liveLocations, routeId]);

    const getRouteData = async () => {
        try {
            setLoading(true);
            const data = await fetchGetRouteMapData({ id: routeId });
            // Flexible matching for string/number IDs from params
            const route = Array.isArray(data)
                ? data.find((item) => String(item.id) === String(routeId))
                : data;

            setRouteData(route);
            setError(null);
        } catch (err) {
            console.error("Error fetching route map data:", err);
            setError("Failed to load route data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (routeId) {
            getRouteData();
        }
    }, [routeId]);

    useEffect(() => {
        console.log('Socket :: ', token, routeId)
        if (token && routeId) {
            initiateSocketConnection(token);
            // const socketInterval = setInterval(() => {

            subscribeToRouteTracking(routeId, (err, data) => {
                console.log('LiveTracking: Socket callback received', { err, data });
                if (!err) {
                    if (data.type === 'update-location') {
                        console.log('LiveTracking: Received location update', data);
                        dispatch(updateLiveLocation(data));
                    } else if (data.type === 'stop-reached') {
                        console.log('LiveTracking: Stop reached, refreshing data...', data);
                        getRouteData(); // Refresh to get updated order statuses
                    }
                } else {
                    console.error('LiveTracking: Socket subscription error', err);
                }
            });
            // }, 2000)

            return () => {
                // clearInterval(socketInterval);
                disconnectSocket();
            };
        }
    }, [token, routeId, dispatch]);

    const stops =
        useMemo(() => {
            // Primary source: Today's Orders
            if (routeData?.Orders && routeData.Orders.length > 0) {
                return routeData.Orders.map((order, index) => ({
                    id: index + 1,
                    name: order.Customer?.name || 'Unknown',
                    lat: parseFloat(order.Customer?.latitude || 0),
                    lng: parseFloat(order.Customer?.longitude || 0),
                    status: order.status,
                    priority: index + 1
                }));

            }

            // Fallback: Assigned Customer
            if (routeData?.Customer && routeData.Customer.length > 0) {
                return routeData.Customer.map((customer, index) => ({
                    id: index + 1,
                    name: customer.name,
                    lat: parseFloat(customer.latitude || 0),
                    lng: parseFloat(customer.longitude || 0),
                    status: 'pending',
                    priority: customer.priority || (index + 1)
                }));
            }
            return [];
        }, [routeData]);

    const locations = useMemo(() => stops, [stops]);
    console.log('stops', locations)

    const handleMapSummary = React.useCallback((summary) => {
        setRouteSummary(prev => {
            // Only update if values are different to avoid unnecessary renders
            if (prev.totalDistance === summary.totalDistance && prev.estimatedTime === summary.estimatedTime) {
                return prev;
            }
            return summary;
        });
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center">Loading live tracking...</div>;
    if (error) return <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>;

    return (
        <div className="h-full flex flex-col p-6 gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/dashboard')}>Back</Button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{routeData?.name}</h1>
                        <p className="text-sm text-slate-500">Live Delivery Tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${agentLocation ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                        <span className={`size-2 rounded-full ${agentLocation ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                        {agentLocation ? 'Agent Online' : 'Agent Offline'}
                    </div>
                    <Button variant="primary" icon="refresh" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden shadow-sm relative border border-slate-200 flex flex-col">
                    <MapMock
                        locations={locations}
                        agentLocation={agentLocation}
                        callback={handleMapSummary}
                        className="flex-1 myMap"
                    />

                    {/* Agent Status Overlay */}
                    {agentLocation && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 z-10 flex items-center gap-3">
                            <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-inner">
                                <span className="material-symbols-outlined">delivery_dining</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Agent</p>
                                <p className="text-sm font-bold text-slate-900">{agentLocation.agentName}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Panel */}
                <div className="w-80 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Route Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Total Distance</span>
                                <span className="text-sm font-bold">{routeSummary.totalDistance.toFixed(2)} km</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Est. Time</span>
                                <span className="text-sm font-bold">{Math.round(routeSummary.estimatedTime)} mins</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Total Stops</span>
                                <span className="text-sm font-bold">{stops.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Agent</span>
                                <span className="text-sm font-bold">{routeData?.agent?.username || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Status</span>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{routeData?.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">Delivery Sequence</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {stops.map((stop, index) => (
                                <div key={stop.id} className="flex gap-3 items-start relative pb-4">
                                    {index !== stops.length - 1 && (
                                        <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-100"></div>
                                    )}
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${stop.status === 'delivered' ? 'bg-green-500 border-green-500 text-white' :
                                        stop.status === 'failed' ? 'bg-red-500 border-red-500 text-white' :
                                            'bg-white border-slate-300 text-slate-400'
                                        }`}>
                                        {stop.status === 'delivered' ? (
                                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                        ) : (
                                            <span className="text-[10px] font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold truncate ${stop.status === 'delivered' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                            {stop.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium">{stop.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTrackingPage;
