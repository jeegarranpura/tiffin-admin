import React from 'react';
import Badge from '../../components/Common/Badge';
import Table from '../../components/Common/Table';

const ReportComponent = (props) => {
    const { 
        dailyDeliveryReport, 
        customerStats, 
        pendingDeliveries, 
        expiringSubscriptions, 
        isLoading 
    } = props;

    const deliveryHeaders = [
        { label: 'Customer', key: 'Customer', render: (val) => val?.name || 'N/A' },
        { label: 'Route', key: 'Route', render: (val) => val?.name || 'N/A' },
        { label: 'Status', key: 'status', render: (val) => (
            <Badge variant={val === 'delivered' ? 'success' : val === 'failed' ? 'error' : 'warning'}>
                {val}
            </Badge>
        )},
        { label: 'Date', key: 'orderDate' }
    ];

    const pendingHeaders = [
        { label: 'Customer', key: 'Customer', render: (val) => val?.name || 'N/A' },
        { label: 'Phone', key: 'Customer', render: (val) => val?.phone || 'N/A' },
        { label: 'Route', key: 'Route', render: (val) => val?.name || 'N/A' },
        { label: 'Status', key: 'status', render: (val) => <Badge variant="warning">{val}</Badge> }
    ];

    const subscriptionHeaders = [
        { label: 'Customer', key: 'Customer', render: (val) => val?.name || 'N/A' },
        { label: 'Phone', key: 'Customer', render: (val) => val?.phone || 'N/A' },
        { label: 'Expiry Date', key: 'expiryDate', render: (val) => new Date(val).toLocaleDateString() },
        { label: 'Amount', key: 'amount', render: (val) => `₹${val}` }
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Generating reports...</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Operational Reports</h1>
            </div>

            {/* Customer Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
                    <h3 className="text-slate-500 text-sm font-medium">Active Customers</h3>
                    <p className="text-3xl font-bold mt-2 text-primary">{customerStats?.activeCustomers || 0}</p>
                </div>
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
                    <h3 className="text-slate-500 text-sm font-medium">Regular (Monthly)</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">{customerStats?.regularCustomers || 0}</p>
                </div>
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
                    <h3 className="text-slate-500 text-sm font-medium">Trial Users</h3>
                    <p className="text-3xl font-bold mt-2 text-orange-500">{customerStats?.trialCustomers || 0}</p>
                </div>
            </div>

            {/* Daily Delivery Report */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Daily Delivery Summary (Today)</h3>
                    <div className="flex gap-4">
                        <span className="text-xs font-medium text-slate-500">Total: <span className="text-slate-900">{dailyDeliveryReport?.total || 0}</span></span>
                        <span className="text-xs font-medium text-green-600">Delivered: <span>{dailyDeliveryReport?.delivered || 0}</span></span>
                        <span className="text-xs font-medium text-red-600">Failed: <span>{dailyDeliveryReport?.failed || 0}</span></span>
                    </div>
                </div>
                <Table headers={deliveryHeaders} tableData={dailyDeliveryReport?.details?.slice(0, 5) || []} />
                {dailyDeliveryReport?.details?.length > 5 && (
                    <div className="p-4 text-center border-t border-slate-100 text-xs text-slate-500">
                        Showing latest 5 of {dailyDeliveryReport.details.length} deliveries
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                {/* Pending Deliveries */}
                <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Pending / Missed Deliveries</h3>
                    </div>
                    {pendingDeliveries?.length > 0 ? (
                        <Table headers={pendingHeaders} tableData={pendingDeliveries} />
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic text-sm">All deliveries accounted for today.</div>
                    )}
                </div>

                {/* Expiring Subscriptions */}
                <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Expiring Tomorrow</h3>
                    </div>
                    {expiringSubscriptions?.length > 0 ? (
                        <Table headers={subscriptionHeaders} tableData={expiringSubscriptions} />
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic text-sm">No subscriptions expiring tomorrow.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportComponent;