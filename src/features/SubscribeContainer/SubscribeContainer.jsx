import React from 'react'
import { connect } from 'react-redux'
import { fetchSubscribeList, fetchCreateSubscribe, fetchUpdateSubscribe, fetchDeleteSubscribe, fetchCustomerHistory, fetchAddSubscriptionSkip, fetchGetSubscriptionSkips, clearMessage } from './SubscribeSlice'
import { fetchCustomerList } from '../CustomerContainer/CustomerSlice'
import { fetchPlanList } from '../PlanContainer/PlanSlice'

const Subscriptions = React.lazy(() => import('../../pages/Subscriptions/Subscriptions'))

const SubscribeContainer = (props) => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Subscriptions
                {...props}
            />
        </React.Suspense>
    )
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    subscribeList: state.subscribe.subscribeList,
    history: state.subscribe.history,
    isLoading: state.subscribe.isLoading,
    error: state.subscribe.error,
    message: state.subscribe.message,
    skips: state.subscribe.skips,
    customerList: state.customer.customerList,
    planList: state.plan.planList,
})

const mapDispatchToProps = {
    fetchSubscribeList,
    fetchCreateSubscribe,
    fetchUpdateSubscribe,
    fetchDeleteSubscribe,
    fetchCustomerList,
    fetchPlanList,
    fetchAddSubscriptionSkip,
    fetchGetSubscriptionSkips,
    clearMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeContainer)