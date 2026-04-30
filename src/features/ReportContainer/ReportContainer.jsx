import React, { useEffect, Suspense } from 'react';
import { connect } from 'react-redux';
import { 
    fetchDailyDeliveryReport, 
    fetchCustomerStats, 
    fetchPendingDeliveries, 
    fetchExpiringSubscriptions 
} from './ReportSlice';

const ReportComponent = React.lazy(() => import('../../pages/Reports/ReportComponent'));

const ReportContainer = (props) => {
    const { 
        fetchDailyDeliveryReport, 
        fetchCustomerStats, 
        fetchPendingDeliveries, 
        fetchExpiringSubscriptions,
        reportData 
    } = props;

    useEffect(() => {
        fetchDailyDeliveryReport();
        fetchCustomerStats();
        fetchPendingDeliveries();
        fetchExpiringSubscriptions();
    }, [
        fetchDailyDeliveryReport, 
        fetchCustomerStats, 
        fetchPendingDeliveries, 
        fetchExpiringSubscriptions
    ]);

    return (
        <Suspense fallback={<div>Loading Reports...</div>}>
            <ReportComponent 
                {...props}
                {...reportData}
            />
        </Suspense>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    reportData: {
        dailyDeliveryReport: state.report.dailyDeliveryReport,
        customerStats: state.report.customerStats,
        pendingDeliveries: state.report.pendingDeliveries,
        expiringSubscriptions: state.report.expiringSubscriptions,
        isLoading: state.report.isLoading,
        error: state.report.error
    }
});

const mapDispatchToProps = {
    fetchDailyDeliveryReport,
    fetchCustomerStats,
    fetchPendingDeliveries,
    fetchExpiringSubscriptions
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportContainer);
