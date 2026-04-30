import React, { useState } from 'react'
import RouteListView from './components/RouteListView';
import RouteUpdateView from './components/RouteUpdateView';

function RouteManagement({ routeList, deliveryAgentList, fetchCreateRouteReq, fetchUpdateRouteReq, customerList }) {
    const [view, setView] = useState('list'); // 'list' or 'edit'
    const [editingRoute, setEditingRoute] = useState(null);

    const handleCreateNew = () => {
        setEditingRoute(null);
        setView('edit');
    };

    const handleEditRoute = (route) => {
        setEditingRoute(route);
        setView('edit');
    };

    const handleSave = (data) => {
        if (editingRoute) {
            fetchUpdateRouteReq({ id: editingRoute.id, ...data });
        } else {
            fetchCreateRouteReq(data);
        }
        setView('list');
    };

    const handleDiscard = () => {
        setView('list');
    };

    return (
        <div className="max-w-6xl mx-auto relative h-full flex flex-col p-6">
            {view === 'list' ? (
                <RouteListView
                    routeList={routeList}
                    onCreateNew={handleCreateNew}
                    onEditInfo={handleEditRoute}
                    customerList={customerList}
                    deliveryAgents={deliveryAgentList}
                />
            ) : (
                <RouteUpdateView
                    initialRoute={editingRoute}
                    deliveryAgents={deliveryAgentList}
                    onSave={handleSave}
                    onDiscard={handleDiscard}
                    customerList={customerList}
                />
            )}
        </div>
    )
}

export default RouteManagement