import React, { useEffect, Suspense } from 'react';
import { connect } from 'react-redux';
import { fetchDashboardOverview } from './DashboardSlice';
import { fetchRouteListReq, updateLiveLocation } from '../RouteContainer/RouteSlice';
import { initiateSocketConnection, disconnectSocket, subscribeToGlobalTracking } from '../../utils/socket';

const DashboardOverview = React.lazy(() => import('../../pages/Dashboard/DashboardOverview'));

const DashboardContainer = (props) => {
    const { 
        fetchDashboardOverview, 
        fetchRouteListReq, 
        updateLiveLocation,
        dashboardData, 
        routeList,
        liveLocations,
        token 
    } = props;

    useEffect(() => {
        fetchDashboardOverview();
        fetchRouteListReq();
    }, [fetchDashboardOverview, fetchRouteListReq]);

    useEffect(() => {
        if (token) {
            initiateSocketConnection(token);
            subscribeToGlobalTracking((err, data) => {
                if (!err) {
                    updateLiveLocation(data);
                }
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [token, updateLiveLocation]);

    return (
        <Suspense fallback={<div>Loading Dashboard...</div>}>
            <DashboardOverview 
                {...props}
                {...dashboardData}
                routeList={routeList}
                liveLocations={liveLocations}
            />
        </Suspense>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated,
    routeList: state.route.routeList,
    liveLocations: state.route.liveLocations,
    dashboardData: {
        stats: state.dashboard.stats,
        recentActivity: state.dashboard.recentActivity,
        deliveryTrend: state.dashboard.deliveryTrend,
        revenueOverview: state.dashboard.revenueOverview,
        isLoading: state.dashboard.isLoading,
        error: state.dashboard.error
    }
});

const mapDispatchToProps = {
    fetchDashboardOverview,
    fetchRouteListReq,
    updateLiveLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
