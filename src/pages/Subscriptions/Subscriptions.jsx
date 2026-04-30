import React, { useEffect, useState } from 'react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Table from '../../components/Common/Table';
import SlideOver from '../../components/Common/SlideOver';
import Modal from '../../components/Common/Modal';
import Collapse from '../../components/Common/Collapse';

const Subscriptions = (props) => {
    const {
        subscribeList,
        customerList,
        planList,
        isLoading,
        message,
        error,
        fetchSubscribeList,
        fetchCustomerList,
        fetchPlanList,
        fetchCreateSubscribe,
        fetchUpdateSubscribe,
        fetchDeleteSubscribe,
        fetchAddSubscriptionSkip,
        fetchGetSubscriptionSkips,
        skips,
        clearMessage
    } = props;
    const activePlans = planList?.filter(plan => plan.isActive);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSkipModal, setShowSkipModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [skipFormData, setSkipFormData] = useState({
        subscriptionId: '',
        dateOfSkip: new Date().toISOString().split('T')[0],
        reason: ''
    });
    const [formData, setFormData] = useState({
        customerId: '',
        planId: '',
        planType: 'monthly',
        startDate: '',
        endDate: '',
        status: 'active',
        amount: 0,
        paymentMethod: 'cash',
        transactionId: '',
        notes: ''
    });

    useEffect(() => {
        fetchSubscribeList();
        fetchCustomerList();
        fetchPlanList();
        fetchGetSubscriptionSkips();
    }, []);

    useEffect(() => {
        if (message) {
            // notify.success(message);
            fetchSubscribeList();
            setTimeout(() => clearMessage(), 3000);
        }
    }, [message]);

    const filteredList = subscribeList?.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm);

        if (statusFilter === 'All') return matchesSearch;

        // Check if any subscription matches the status filter
        const hasMatchingStatus = item.Subscriptions?.some(sub => sub.status === statusFilter.toLowerCase());
        return matchesSearch && hasMatchingStatus;
    });

    const handleAddClick = () => {
        setFormData({
            customerId: '',
            planId: '',
            planType: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            status: 'active',
            amount: 0,
            paymentMethod: 'cash',
            transactionId: '',
            notes: ''
        });
        setShowAddModal(true);
    };

    const handleSkipClick = (sub) => {
        setSelectedSubscription(sub);
        setSkipFormData({
            subscriptionId: sub.id,
            dateOfSkip: new Date().toISOString().split('T')[0],
            reason: ''
        });
        setShowSkipModal(true);
    };

    const handleEditClick = (sub, customer, payments) => {
        setSelectedSubscription(sub);
        setFormData({
            customerId: customer.id,
            planId: sub.planId,
            planType: sub.planType,
            startDate: sub.startDate,
            endDate: sub.endDate,
            status: sub.status,
            amount: payments[0]?.amount || 0,
            paymentMethod: payments[0]?.paymentMethod || 'cash',
            transactionId: payments[0]?.transactionId || '',
            notes: payments[0]?.notes || ''
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            await fetchDeleteSubscribe(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (showEditModal) {
            await fetchUpdateSubscribe({ id: selectedSubscription.id, data: formData });
            setShowEditModal(false);
        } else {
            await fetchCreateSubscribe(formData);
            setShowAddModal(false);
        }
    };

    const handleSkipSubmit = async (e) => {
        e.preventDefault();
        await fetchAddSubscriptionSkip(skipFormData);
        setShowSkipModal(false);
        fetchGetSubscriptionSkips();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-calculate end date if planId changes and no endDate set
        if (name === 'planId' && value) {
            const plan = activePlans.find(p => p.id === value);
            if (plan && formData.startDate) {
                const start = new Date(formData.startDate);
                const end = new Date(start);
                end.setDate(end.getDate() + (plan.durationDays || 30));
                setFormData(prev => ({ ...prev, endDate: end.toISOString().split('T')[0], amount: plan.price }));
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <Badge variant="success" size="sm">Active</Badge>;
            case 'expired': return <Badge variant="danger" size="sm">Expired</Badge>;
            case 'pending_payment': return <Badge variant="warning" size="sm">Pending Payment</Badge>;
            case 'inactive': return <Badge variant="neutral" size="sm">Inactive</Badge>;
            default: return <Badge size="sm">{status}</Badge>;
        }
    };

    const subHeaders = [
        { key: 'Plan', label: 'Plan', render: (val, row) => row.Plan?.name || 'Custom' },
        { key: 'planType', label: 'Type', render: (val) => <span className="capitalize">{val}</span> },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'status', label: 'Status', render: (val) => getStatusBadge(val) },
        { key: 'amount', label: 'Amount', render: (val, row) => `${row.Payments[0]?.amount || 0}` },
        {
            key: 'id', label: 'Actions', align: 'right', render: (val, row) => (
                row.status === 'active' ? (
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" icon="event_busy" className="text-orange-500 hover:bg-orange-50" onClick={() => handleSkipClick(row)} title="Skip Delivery" />
                        <Button variant="ghost" size="sm" icon="edit" onClick={() => handleEditClick(row, filteredList.find(c => c.Subscriptions.includes(row)), row.Payments)} />
                        <Button variant="ghost" size="sm" icon="delete" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteClick(val)} />
                    </div>
                ) : <span className="text-xs text-slate-400 italic px-2">No actions</span>
            )
        }
    ];

    const skipHeaders = [
        { key: 'dateOfSkip', label: 'Skip Date' },
        { key: 'reason', label: 'Reason' },
        { key: 'createdAt', label: 'Recorded At', render: (val) => new Date(val).toLocaleDateString() },
    ];


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subscriptions</h1>
                    <p className="text-slate-500">Manage customer plans and subscription lifecycles.</p>
                </div>
                <Button icon="add" onClick={handleAddClick} className="shadow-lg shadow-primary/20">
                    Add Subscription
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search by customer name or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    {['All', 'Active', 'Expired', 'Pending_Payment'].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'primary' : 'ghost'}
                            size="sm"
                            className={`!rounded-lg ${statusFilter === status ? 'bg-white !text-primary shadow-sm hover:bg-white' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status.replace('_', ' ')}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Main Content: Expandable Customer List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading subscriptions...</div>
                ) : filteredList?.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                        No customers found matching your filters.
                    </div>
                ) : (
                    filteredList?.map((customer) => (
                        <Collapse
                            key={customer.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            initialCollapsed={true}
                            header={
                                <div className="flex items-center justify-between w-full pr-4 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {customer.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                            <p className="text-xs text-slate-500">{customer.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="danger" className="!text-xs font-medium">
                                                Expired
                                            </Badge>
                                            <p className="font-bold text-slate-900 !text-xs">{customer.Subscriptions?.filter(s => s.status === 'expired')?.length || 0}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="success" className="!text-xs font-medium">
                                                Active
                                            </Badge>
                                            <p className="font-bold text-slate-900 !text-xs">{customer.Subscriptions?.filter(s => s.status === 'active')?.length || 0}</p>

                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <div className="mt-2 space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-2 px-1">Active Subscriptions</h4>
                                    <Table
                                        headers={subHeaders}
                                        tableData={customer.Subscriptions?.slice().sort((a, b) => {
                                            const priority = { 'active': 1, 'pending_payment': 2, 'expired': 3, 'inactive': 4 };
                                            return (priority[a.status] || 99) - (priority[b.status] || 99);
                                        }) || []}
                                        pagination={false}
                                        footer={false}
                                        className="!border-none !shadow-none"
                                    />
                                </div>

                                {skips?.filter(skip => customer.Subscriptions?.some(sub => sub.id === skip.subscriptionId))?.length > 0 && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-700 mb-2 px-1">Skipped Deliveries</h4>
                                        <Table
                                            headers={skipHeaders}
                                            tableData={skips.filter(skip => customer.Subscriptions?.some(sub => sub.id === skip.subscriptionId))}
                                            pagination={false}
                                            footer={false}
                                            className="!border-none !shadow-none"
                                        />
                                    </div>
                                )}

                                <div className="mt-4 flex justify-start">
                                    <Button variant="outline" size="sm" icon="add" onClick={() => {
                                        setFormData(prev => ({ ...prev, customerId: customer.id }));
                                        setShowAddModal(true);
                                    }}>
                                        New Subscription
                                    </Button>
                                </div>
                            </div>
                        </Collapse>
                    ))
                )}
            </div>

            {/* Add/Edit Modal (using SlideOver for better UX) */}
            <SlideOver
                isOpen={showAddModal || showEditModal}
                onClose={() => { setShowAddModal(false); setShowEditModal(false); }}
                title={showEditModal ? 'Edit Subscription' : 'Add New Subscription'}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-6 text-left">
                    {!showEditModal && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Customer</label>
                            <select
                                name="customerId"
                                value={formData.customerId}
                                onChange={onInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="">Select a customer</option>
                                {customerList?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Plan</label>
                            <select
                                name="planId"
                                value={formData.planId}
                                onChange={onInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="">Select a plan</option>
                                {activePlans?.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - {p.pricing}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Type</label>
                            <select
                                name="planType"
                                value={formData.planType}
                                onChange={onInputChange}
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="trial">Trial</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={onInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={onInputChange}
                                required
                                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={onInputChange}
                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="active">Active</option>
                            <option value="pending_payment">Pending Payment</option>
                            <option value="expired">Expired</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* {!showEditModal && ( */}
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-4">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Initial Payment</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-600 font-medium">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={onInputChange}
                                    className="w-full rounded-xl border border-slate-200 p-2 bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-600 font-medium">Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={onInputChange}
                                    className="w-full rounded-xl border border-slate-200 p-2 bg-white"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
                                    <option value="bank-transfer">Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={onInputChange}
                            rows="2"
                            placeholder="Optional notes about this subscription..."
                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</Button>
                        <Button className="flex-1" type="submit">
                            {showEditModal ? 'Update Subscription' : 'Create Subscription'}
                        </Button>
                    </div>
                </form>
            </SlideOver>

            {/* Skip Modal */}
            <Modal
                isOpen={showSkipModal}
                onClose={() => setShowSkipModal(false)}
                title="Skip Subscription Delivery"
            >
                <form onSubmit={handleSkipSubmit} className="p-6 space-y-4 text-left">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Skip Date</label>
                        <input
                            type="date"
                            value={skipFormData.dateOfSkip}
                            onChange={(e) => setSkipFormData(prev => ({ ...prev, dateOfSkip: e.target.value }))}
                            required
                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Reason (Optional)</label>
                        <textarea
                            value={skipFormData.reason}
                            onChange={(e) => setSkipFormData(prev => ({ ...prev, reason: e.target.value }))}
                            rows="3"
                            placeholder="Why is this delivery being skipped?"
                            className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => setShowSkipModal(false)}>Cancel</Button>
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 border-none" type="submit">
                            Confirm Skip
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Subscriptions;