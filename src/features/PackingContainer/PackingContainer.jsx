import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
    fetchPackingListReq,
    updateOrderStatusReq,
    updateRouteStatusReq
} from './PackingSlice'

import PackingPage  from '../../pages/Packing/PackingPage';

const PackingContainer = ({
    fetchPackingListReq,
    packingList,
    updateOrderStatusReq,
    isLoading,
    error,
    message,
    updateRouteStatusReq,
    props
}) => {
    console.log(':: props', props)
    useEffect(() => {
        fetchPackingListReq()
    }, [fetchPackingListReq])

    return (
        <>
            <PackingPage
                packingList={packingList}
                updateOrderStatusReq={updateOrderStatusReq}
                updateRouteStatusReq={updateRouteStatusReq}
                isLoading={isLoading}
                error={error}
                message={message}
                fetchPackingListReq={fetchPackingListReq}
                {...props}
            />
        </>
    )
}

const selectPackingList = (state) => state.packing.packingList;
const selectUser = (state) => state.packing.user;
const selectIsLoading = (state) => state.packing.isLoading;
const selectError = (state) => state.packing.error;
const selectMessage = (state) => state.packing.message;

const mapStateToProps = (state) => ({
    packingList: selectPackingList(state),
    user: selectUser(state),
    isLoading: selectIsLoading(state),
    error: selectError(state),
    message: selectMessage(state)
})

const mapDispatchToProps = {
    fetchPackingListReq,
    updateOrderStatusReq,
    updateRouteStatusReq
}

export default connect(mapStateToProps, mapDispatchToProps)(PackingContainer)