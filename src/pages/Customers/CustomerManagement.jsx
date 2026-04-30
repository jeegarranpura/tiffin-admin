import React, { useEffect, useState } from 'react';

const Button = React.lazy(() => import('../../components/Common/Button'));
const Badge = React.lazy(() => import('../../components/Common/Badge'));
const Table = React.lazy(() => import('../../components/Common/Table'));
const SlideOver = React.lazy(() => import('../../components/Common/SlideOver'));
const Modal = React.lazy(() => import('../../components/Common/Modal'));
const GoogleMap = React.lazy(() => import('./Components/GoogleMap'));

const CustomerManagement = (props) => {
  const { customerList, isLoading, error, planList } = props;
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [showMapModal, setShowMapModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All');
  const [filteredCustomers, setFilteredCustomers] = useState(customerList);
  const [expiedSubscription, setExpiedSubscription] = useState([]);


  const [inputData, setInputData] = useState({
    name: '',
    phone: '',
    address: '',
    type: '',
    planId: '',
    isActive: false,
    startDate: "",
    endDate: "",
    latitude: "",
    longitude: "",
  })

  useEffect(() => {
    setFilteredCustomers(customerList)
  }, [customerList])

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'isActive') {
      setInputData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    }

    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleAddCustomer = () => {
    setIsEdit(false);
    setInputData({
      name: '',
      phone: '',
      address: '',
      type: '',
      planId: '',
      isActive: true,
      startDate: "",
      endDate: "",
      latitude: "",
      longitude: "",
    })
    setSelectedCustomerId(null);

    setShowAddModal(true);
  }

  const handleCloseModal = () => {
    setShowAddModal(false);
  }

  const handleEditCustomer = (id) => {
    setSelectedCustomerId(id);
    const customer = customerList?.find((customer) => customer.id === id);
    const expiedSubscriptions = customer?.Subscriptions?.filter((subscription) => subscription.status === "expired");
    setExpiedSubscription(expiedSubscriptions);
    const activeSubscription = customer?.Subscriptions?.find((subscription) => subscription.status === "active");
    const startDate = activeSubscription?.startDate
    const endDate = activeSubscription?.endDate
    setIsEdit(true);
    setShowAddModal(true);
    setInputData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      type: customer.type,
      planId: customer.planId,
      isActive: customer.isActive,
      startDate: startDate,
      endDate: endDate,
      latitude: customer.latitude,
      longitude: customer.longitude,
    })
  }


  const onHandleSubmit = async () => {
    const createPayload = {
      name: inputData.name,
      phone: inputData.phone,
      address: inputData.address,
      latitude: inputData.latitude,
      longitude: inputData.longitude,
      type: inputData.type,
      planId: inputData.planId,
      isActive: inputData.isActive,
      startDate: inputData.startDate,
      endDate: inputData.endDate,
    }
    let data;
    if (isEdit) {
      data = await props.fetchUpdateCustomer({ ...createPayload, id: selectedCustomerId })
    } else {
      data = await props.fetchCreateCustomer(createPayload)
    }
    if (data) {
      setShowAddModal(false);
      props.fetchCustomerList();
    }
  }





  const types = ['All', 'Monthly', 'Trial'];
  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'type', label: 'Type' },
    {
      key: 'Plan', label: 'Assigned Plan', render: (value) => {
        return <span className='text-sm'>{value.name}</span>;
      }
    },
    {
      key: 'isActive', label: 'Status', render: (value) => {
        return value ? <Badge variant='success' size='sm'>Active</Badge> : <Badge variant='danger' size='sm'>Inactive</Badge>;
      }
    },
    {
      key: 'id', label: 'Actions', align: 'center', render: (values) => {
        return (
          <div className='flex gap-2'>
            <Button variant="outline" size="sm" icon="edit" onClick={() => { handleEditCustomer(values) }} />
            {/* <Button variant="outline" size="sm" icon="delete" onClick={() => { }} /> */}
          </div>
        )
      },
    }
  ];

  const handleMapSelection = (data) => {
    onHandleInputChange({ target: { name: 'address', value: data.address } })
    onHandleInputChange({ target: { name: 'latitude', value: data.lat } })
    onHandleInputChange({ target: { name: 'longitude', value: data.lng } })
    setShowMapModal(false);
  }

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (type === 'All') {
      setFilteredCustomers(customerList);
    } else {
      const filteredCustomers = customerList?.filter((customer) => customer.type === type?.toLowerCase());
      setFilteredCustomers(filteredCustomers);
    }
  }
  const handleStatusChange = (status) => {
    setActiveStatus(status);
    if (status === 'All Status') {
      setFilteredCustomers(customerList);
    } else {
      const filteredCustomers = customerList?.filter((customer) => customer.isActive === (status === 'Active'));
      setFilteredCustomers(filteredCustomers);
    }
  }


  const MapModel = () => {
    return (
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Map"
        size="lg"
      >
        <GoogleMap
          // onSelect={()}
          defaultAddress={inputData.address}
          defaultLatLng={{ lat: inputData.latitude, lng: inputData.longitude }}
          isEdit={isEdit}
          onSelect={handleMapSelection}
        />
      </Modal>
    )
  }

  return (
    <div className="max-w-6xl mx-auto relative h-full flex flex-col p-6">
      {/* Content Header */}
      <div className="flex items-center justify-between mb-8 text-left">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Customers</h2>
          <p className="text-slate-500 mt-1">Manage and view all your subscribers.</p>
        </div>
        <Button icon="add" onClick={() => handleAddCustomer()}>
          Add Customer
        </Button>
      </div>

      <MapModel />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Type:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeType === type ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Status:</span>
          <select
            className="bg-slate-100 border-none rounded-lg text-sm px-4 py-1.5 focus:ring-primary outline-none cursor-pointer"
            value={activeStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="ml-auto">
          {/* <Button variant="ghost" icon="filter_list">
            Advanced Filters
          </Button> */}
        </div>
      </div>

      {/* Data Table */}
      {filteredCustomers?.length > 0 && (
        <Table
          headers={headers}
          tableData={filteredCustomers}
          loading={isLoading}
        />
      )}

      {/* Add Customer Modal Slide-over */}
      <SlideOver
        isOpen={showAddModal}
        onClose={() => handleCloseModal()}
        title="Add New Customer"
      >
        <div className="p-6 space-y-6 text-left">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Personal Information</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
                placeholder="e.g. John Doe"
                type="text"
                name="name"
                value={inputData.name}
                onChange={onHandleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
                placeholder="+91 00000 00000"
                type="tel"
                name="phone"
                value={inputData.phone}
                onChange={onHandleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Delivery Address </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 bg-slate-50"
                placeholder="Select From Map"
                rows="3"
                name="address"
                value={inputData.address}
                onChange={onHandleInputChange}
                readOnly
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Latitude </label>
                  <input
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-slate-50"
                    name="latitude"
                    value={inputData.latitude}
                    onChange={onHandleInputChange}
                    readOnly
                    type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Longitude</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-slate-50"
                    name="longitude"
                    value={inputData.longitude}
                    readOnly
                    onChange={onHandleInputChange}
                    type="text" />
                </div>
              </div>
              <Button variant="outline" size="sm" icon="map" onClick={() => setShowMapModal(true)}>
                Pick from Map
              </Button>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Subscription Details</h4>
            <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-sm font-medium text-green-700">Active</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Customer Type</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                    name="type"
                    value={inputData.type}
                    onChange={onHandleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Meal Plan</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                    name="planId"
                    value={inputData.planId}
                    onChange={onHandleInputChange}
                  >
                    <option value="">Select Plan</option>
                    {planList.map((plan) => (
                      <option value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    name="startDate"
                    value={inputData.startDate}
                    onChange={onHandleInputChange}
                    type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">End Date</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    name="endDate"
                    value={inputData.endDate}

                    onChange={onHandleInputChange}
                    type="date" />
                </div>
              </div>
            </div>

            {/* <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <input
                defaultChecked
                className="w-4 h-4 rounded text-primary focus:ring-primary border-primary/30"
                type="checkbox"
                name='isActive'
                onChange={onHandleInputChange}
              />
              <label className="text-sm font-medium text-slate-900">Mark as Active</label>
            </div> */}

          </div>
          {expiedSubscription?.map((subscription) => (
            <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
              <div className="text-sm font-medium text-red-700">Expired</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Customer Type</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-not-allowed"
                    name="type"
                    value={subscription.planType}
                    // onChange={onHandleInputChange}
                    disabled
                  >
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Meal Plan</label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-not-allowed"
                    name="planId"
                    value={subscription.planId}
                    // onChange={onHandleInputChange}
                    disabled
                  >
                    <option value="">Select Plan</option>
                    {planList.map((plan) => (
                      <option value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Start Date</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-not-allowed"
                    name="startDate"
                    value={subscription.startDate}
                    // onChange={onHandleInputChange}
                    disabled
                    type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">End Date</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-not-allowed"
                    name="endDate"
                    value={subscription.endDate}
                    disabled
                    // onChange={onHandleInputChange}
                    type="date" />
                </div>
              </div>
            </div>

          ))}
          <div className="flex gap-3 pt-6">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={onHandleSubmit} type="button">Save Customer</Button>
          </div>
        </div>
      </SlideOver>
    </div>
  );
};

export default CustomerManagement;
