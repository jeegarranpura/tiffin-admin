import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    fetchPlanList,
    fetchPlanById,
    fetchCreatePlan,
    fetchUpdatePlan,
    fetchDeletePlan
} from './PlanSlice'

const Plan = React.lazy(() => import('../../pages/Plans/PlanManagement'));

const PlanContainer = ({
    fetchPlanList,
    fetchPlanById,
    fetchCreatePlan,
    fetchUpdatePlan,
    fetchDeletePlan,
    planList,
    isLoading,
    error,
    props
}) => {

    useEffect(() => {
        fetchPlanList();
    }, [fetchPlanList]);
    return (
        <Plan
            fetchPlanList={fetchPlanList}
            fetchPlanById={fetchPlanById}
            fetchCreatePlan={fetchCreatePlan}
            fetchUpdatePlan={fetchUpdatePlan}
            fetchDeletePlan={fetchDeletePlan}
            planList={planList}
            isLoading={isLoading}
            error={error}
            {...props}
        />

    )
}

const selectPlanList = (state) => state.plan.planList;
const selectIsLoading = (state) => state.plan.isLoading;
const selectError = (state) => state.plan.error;


const mapStateToProps = (state) => ({
    planList: selectPlanList(state),
    isLoading: selectIsLoading(state),
    error: selectError(state)
})

const mapDispatchToProps = {
    fetchPlanList,
    fetchPlanById,
    fetchCreatePlan,
    fetchUpdatePlan,
    fetchDeletePlan
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanContainer)