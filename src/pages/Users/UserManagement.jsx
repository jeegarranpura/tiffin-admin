import React, { useEffect, useState } from 'react';

const Button = React.lazy(() => import('../../components/Common/Button'));
const Badge = React.lazy(() => import('../../components/Common/Badge'));
const Table = React.lazy(() => import('../../components/Common/Table'));
const SlideOver = React.lazy(() => import('../../components/Common/SlideOver'));

const UserManagement = (props) => {
    const { userList, isLoading, error } = props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(userList);
    const [activeRole, setActiveRole] = useState('All');

    const [inputData, setInputData] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        role: 'delivery_agent',
    })

    useEffect(() => {
        setFilteredUsers(userList)
    }, [userList])

    const onHandleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleAddUser = () => {
        setIsEdit(false);
        setInputData({
            name: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            role: 'delivery_agent',
        })
        setSelectedUserId(null);
        setShowAddModal(true);
    }

    const handleEditUser = (id) => {
        const user = userList?.find((u) => u.id === id);
        if (!user) return;
        setSelectedUserId(id);
        setIsEdit(true);
        setInputData({
            name: user.name,
            username: user.username,
            password: '', // Don't show password
            email: user.email,
            phone: user.phone,
            role: user.role,
        })
        setShowAddModal(true);
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await props.fetchDeleteUser(id);
        }
    }

    const onHandleSubmit = async () => {
        let success;
        if (isEdit) {
            const payload = { ...inputData, id: selectedUserId };
            if (!payload.password) delete payload.password; // Don't send empty password
            success = await props.fetchUpdateUser(payload);
        } else {
            success = await props.fetchCreateUser(inputData);
        }

        if (success) {
            setShowAddModal(false);
            props.fetchUserList();
        }
    }

    const roles = ['All', 'admin', 'manager', 'packer', 'delivery_agent'];

    const headers = [
        { key: 'name', label: 'Full Name' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'role', label: 'Role', render: (value) => {
                const variants = {
                    admin: 'success',
                    manager: 'warning',
                    packer: 'info',
                    delivery_agent: 'secondary'
                };
                return <Badge variant={variants[value] || 'secondary'} size='sm'>{value.replace('_', ' ')}</Badge>;
            }
        },
        {
            key: 'id', label: 'Actions', align: 'center', render: (id) => {
                return (
                    <div className='flex gap-2 justify-center'>
                        <Button variant="outline" size="sm" icon="edit" onClick={() => handleEditUser(id)} />
                        <Button variant="outline" size="sm" icon="delete" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleDeleteUser(id)} />
                    </div>
                )
            },
        }
    ];

    const handleRoleFilter = (role) => {
        setActiveRole(role);
        if (role === 'All') {
            setFilteredUsers(userList);
        } else {
            setFilteredUsers(userList?.filter((u) => u.role === role));
        }
    }

    return (
        <div className="max-w-6xl mx-auto relative h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-8 text-left">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">User Management</h2>
                    <p className="text-slate-500 mt-1">Manage system users and their roles.</p>
                </div>
                <Button icon="person_add" onClick={handleAddUser}>
                    Add New User
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Filter by Role:</span>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleFilter(role)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeRole === role ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {role === 'All' ? 'All Roles' : role.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <Table
                headers={headers}
                tableData={filteredUsers}
                loading={isLoading}
            />

            {/* Add/Edit User Slide-over */}
            <SlideOver
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={isEdit ? "Edit User" : "Add New User"}
            >
                <div className="p-6 space-y-6 text-left">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="e.g. John Doe"
                                type="text"
                                name="name"
                                value={inputData.name}
                                onChange={onHandleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Username</label>
                            <input
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="johndoe123"
                                type="text"
                                name="username"
                                value={inputData.username}
                                onChange={onHandleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">{isEdit ? "New Password (leave blank to keep current)" : "Password"}</label>
                            <input
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                name="password"
                                value={inputData.password}
                                onChange={onHandleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="john@example.com"
                                type="email"
                                name="email"
                                value={inputData.email}
                                onChange={onHandleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <input
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="+91 00000 00000"
                                type="tel"
                                name="phone"
                                value={inputData.phone}
                                onChange={onHandleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">User Role</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                                name="role"
                                value={inputData.role}
                                onChange={onHandleInputChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="packer">Packer</option>
                                <option value="delivery_agent">Delivery Agent</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={onHandleSubmit} type="button">
                            {isEdit ? "Update User" : "Create User"}
                        </Button>
                    </div>
                </div>
            </SlideOver>
        </div>
    );
};

export default UserManagement;
