import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    fetchCustomerList,
    fetchCreateCustomer,
    fetchUpdateCustomer
} from './CustomerSlice'
import { fetchPlanList } from '../PlanContainer/PlanSlice'

const Customer = React.lazy(() => import('../../pages/Customers/CustomerManagement'));

const CustomerContainer = ({
    fetchCustomerList,
    fetchCreateCustomer,
    fetchUpdateCustomer,
    fetchPlanList,
    customerList,
    isLoading,
    error,
    planList,
    props
}) => {

    useEffect(() => {
        fetchCustomerList();
        fetchPlanList();
    }, [fetchCustomerList]);
    return (
        <Customer
            fetchCustomerList={fetchCustomerList}
            fetchCreateCustomer={fetchCreateCustomer}
            fetchUpdateCustomer={fetchUpdateCustomer}
            customerList={customerList}
            isLoading={isLoading}
            error={error}
            planList={planList}
            {...props}
        />

    )
}

const selectCustomerList = (state) => state.customer.customerList;
const selectIsLoading = (state) => state.customer.isLoading;
const selectError = (state) => state.customer.error;

const selectPlanList = (state) => state.plan.planList;


const mapStateToProps = (state) => ({
    customerList: selectCustomerList(state),
    isLoading: selectIsLoading(state),
    error: selectError(state),
    planList: selectPlanList(state),
})

const mapDispatchToProps = {
    fetchCustomerList,
    fetchCreateCustomer,
    fetchUpdateCustomer,
    fetchPlanList
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerContainer)