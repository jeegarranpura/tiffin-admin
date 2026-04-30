import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    fetchRouteListReq,
    fetchDeliveryAgentListReq,
    fetchCreateRouteReq,
    fetchUpdateRouteReq,
    fetchDeleteRouteReq
} from './RouteSlice'
import { fetchCustomerList } from '../CustomerContainer/CustomerSlice'


const Route = React.lazy(() => import('../../pages/Route/RouteManagement'));

const RouteContainer = ({
    fetchRouteListReq,
    fetchDeliveryAgentListReq,
    fetchCreateRouteReq,
    fetchUpdateRouteReq,
    fetchDeleteRouteReq,
    fetchCustomerList,
    routeList,
    isLoading,
    deliveryAgentList,
    error,

    customerList,
    customerIsLoading,
    customerError,
    props
}) => {

    useEffect(() => {
        fetchRouteListReq();
        fetchDeliveryAgentListReq();
        fetchCustomerList();
    }, [fetchRouteListReq, fetchDeliveryAgentListReq, fetchCustomerList]);
    return (
        <Route
            fetchRouteListReq={fetchRouteListReq}
            fetchDeliveryAgentListReq={fetchDeliveryAgentListReq}
            fetchCreateRouteReq={fetchCreateRouteReq}
            fetchUpdateRouteReq={fetchUpdateRouteReq}
            fetchDeleteRouteReq={fetchDeleteRouteReq}
            routeList={routeList}
            isLoading={isLoading}
            deliveryAgentList={deliveryAgentList}
            error={error}

            customerList={customerList}
            customerIsLoading={customerIsLoading}
            customerError={customerError}
            {...props}
        />

    )
}

const selectRouteList = (state) => state.route.routeList;
const selectDeliveryAgentList = (state) => state.route.deliveryAgentList;
const selectIsLoading = (state) => state.route.isLoading;
const selectError = (state) => state.route.error;

const selectCustomerList = (state) => state.customer.customerList;
const selectCustomerIsLoading = (state) => state.customer.isLoading;
const selectCustomerError = (state) => state.customer.error;


const mapStateToProps = (state) => ({
    routeList: selectRouteList(state),
    deliveryAgentList: selectDeliveryAgentList(state),
    isLoading: selectIsLoading(state),
    error: selectError(state),

    customerList: selectCustomerList(state),
    customerIsLoading: selectCustomerIsLoading(state),
    customerError: selectCustomerError(state),
})

const mapDispatchToProps = {
    fetchRouteListReq,
    fetchDeliveryAgentListReq,
    fetchCreateRouteReq,
    fetchUpdateRouteReq,
    fetchDeleteRouteReq,
    fetchCustomerList
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteContainer)