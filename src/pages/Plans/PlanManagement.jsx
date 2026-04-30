import React, { useState } from 'react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import Table from '../../components/Common/Table';
import SlideOver from '../../components/Common/SlideOver';

const PlanManagement = (props) => {
  const { planList, fetchPlanList, fetchPlanById, fetchCreatePlan, fetchUpdatePlan, fetchDeletePlan, isLoading } = props;
  console.log('props', props)
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('All Plans');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [inputData, setInputData] = useState({
    name: '',
    description: '',
    price: '',
    period: '',
    isActive: true,
  });
  const [features, setFeatures] = useState(['']);
  const [mealTime, setMealTime] = useState('');

  const onInputChanges = (e) => {
    const { name, value } = e.target;
    if (name === 'isActive') {
      console.log('value', e.target)
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
  const onFeaturesChanges = (e) => {
    setFeatures((prev) => [...prev, '']);
  }
  const onFeatureTextChanged = (e, index) => {
    const { name, value } = e.target;
    setFeatures((prev) => {
      const newFeatures = [...prev];
      newFeatures[index] = value;
      return newFeatures;
    });
  }
  const deleteFeature = (index) => {
    const list = features.filter((_, i) => i !== index);
    setFeatures(list)
  }

  const onMealTimeChange = (e) => {
    const { value, checked } = e.target;
    console.log('e.target', checked, value)
    if (value) {
      setMealTime(value);
    } else {
      setMealTime('');
    }
  }

  const updateSelectedPlan = (id) => {
    const plan = planList.find((plan) => plan.id === id);
    setInputData({
      name: plan.name,
      description: plan.description,
      price: plan.pricing,
      duration: plan.durationDays,
      isActive: plan.isActive,
    });
    setFeatures(plan.items);
    setMealTime(plan.mealTime);
    if (plan.items?.length) {
      setFeatures(plan.items);
    } else {
      setFeatures(['']);
    }
    setShowEditModal(true)
    setIsEdit(true);
    setSelectedPlanId(plan.id);
  }

  const plans = [
    {
      id: 1,
      name: 'Trial Pack',
      description: 'Perfect for testing our service quality.',
      price: '20',
      period: 'week',
      type: 'Trial',
      icon: 'timer',
      features: ['5 Days Duration', 'Single Meal (Lunch/Dinner)', 'Standard Packaging'],
      highlight: false,
    },
    {
      id: 2,
      name: 'Basic Plan',
      description: 'The essential choice for office goers.',
      price: '150',
      period: 'month',
      type: 'Active',
      icon: 'restaurant_menu',
      features: ['20 Days Duration', 'Lunch Only (Mon-Fri)', 'Eco-friendly Packaging', 'Free Weekend Pause'],
      highlight: true,
      popular: true,
    },
    {
      id: 3,
      name: 'Premium Plan',
      description: 'Complete nutrition and variety.',
      price: '280',
      period: 'month',
      type: 'Active',
      icon: 'star',
      features: ['30 Days Duration', 'Lunch & Dinner', 'Premium Hot-Case Boxes', 'Daily Dessert Inclusion'],
      highlight: false,
      amber: true,
    },
  ];

  const tabs = ['All Plans'];
  const tableHeaders = [
    { key: 'name', label: 'Plan Name' },
    { key: 'description', label: 'Description' },
    { key: 'pricing', label: 'Price ($)' },
    { key: 'durationDays', label: 'Duration (Days)' },
    { key: 'mealTime', label: 'Meal Time' },
    {
      key: 'isActive', label: 'Status', render: (value) => {
        return value ? <Badge variant='success' size='sm'>Active</Badge> : <Badge variant='danger' size='sm'>Inactive</Badge>;
      }
    },
    {
      key: 'items', label: 'Items', render: (value) => {
        return value.map((items, index) =>

          <div className='inline-flex rounded-md bg-slate-100 m-1 px-2 py-1 text-xs font-medium text-slate-700'>{items}</div>
        )
      }
    },
    {
      key: 'id', label: 'Actions', render: (values) => {
        return (
          <div className='flex gap-2'>
            <Button variant="outline cursor-pointer" size="sm" icon="edit" onClick={() => {
              updateSelectedPlan(values)
            }} />
            <Button variant="outline cursor-pointer" size="sm" icon="delete" onClick={() => { }} />
          </div>
        )
      }
    },


  ];

  const onHandleSubmit = async () => {
    const createPayload = {
      name: inputData.name,
      description: inputData.description,
      pricing: inputData.price,
      durationDays: inputData.duration,
      mealTime: mealTime,
      items: features,
      isActive: inputData.isActive,
    }
    let data;
    if (isEdit) {
      data = await fetchUpdatePlan({ ...createPayload, id: selectedPlanId });
    } else {
      data = await fetchCreatePlan(createPayload);
    }
    console.log('data', data)
    if (data) {
      setShowEditModal(false);
      fetchPlanList();
    }

  }

  const addNewPlan = () => {
    setShowEditModal(true);
    setIsEdit(false);
    setInputData({ name: '', description: '', price: '', duration: '', mealTime: '', isActive: false });
    setSelectedPlanId(null);
    setMealTime('')
    setFeatures([''])
  }

  return (
    <div className="max-w-6xl mx-auto relative h-full overflow-auto p-6">
      {/* Page Action Header */}
      <div className="flex justify-between items-end mb-8 text-left">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-slate-900">Active Plans</h3>
          <p className="text-slate-500 mt-1">Configure and manage subscription packages for your customers.</p>
        </div>
        <Button icon="add" onClick={() => { addNewPlan() }}>
          Add New Plan
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plan Grid */}
      <div className="">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table
            headers={tableHeaders}
            tableData={planList}
            loading={isLoading}

          />
        )}
      </div>

      {/* Edit Plan Modal Overlay */}
      <SlideOver
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={isEdit ? "Edit Plan Details" : "Add Plan Details"}
      >



        <form className="p-8 space-y-6 text-left " onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Plan Name</label>
            <input
              className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              type="text"
              value={inputData.name}
              placeholder='Enter Plan Name'
              name='name'
              onChange={onInputChanges}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Short Description</label>
            <textarea
              className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              rows="3"
              value={inputData.description}
              placeholder='Enter Short Description'
              name='description'
              onChange={onInputChanges}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Price ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  className="w-full pl-8 rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  type="number"
                  value={inputData.price}
                  placeholder='Enter Price'
                  name='price'
                  onChange={onInputChanges}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration (Days)</label>
              <input
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                type="number"
                value={inputData.duration}
                placeholder='Enter Duration'
                name='duration'
                onChange={onInputChanges}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Type</label>
            <select
              className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              name='mealTime'
              value={mealTime}
              onChange={onMealTimeChange}
            >
              <option value="">Select Type</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Items</label>
            {features?.map((feature, index) => (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={feature}
                  placeholder='Enter Items'
                  onChange={(e) => onFeatureTextChanged(e, index)}
                />
                <Button
                  variant="outline"
                  size="md"
                  icon={features.length - 1 === index ? "add" : 'delete'}
                  onClick={() => { features.length - 1 === index ? onFeaturesChanges() : deleteFeature(index) }}
                />
              </div>
            ))}
            {/* <div className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-xl border-slate-200 bg-slate-50 text-base py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                // value={featureText}
                onChange={onFeatureTextChanged()}
              />
              <Button variant="outline" size="md" icon="add" onClick={() => {
                onFeaturesChanges()
              }} />
            </div> */}
          </div>
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <input
              defaultChecked
              className="w-4 h-4 rounded text-primary focus:ring-primary border-primary/30"
              type="checkbox"
              name='isActive'
              onChange={onInputChanges}
            />
            <label className="text-sm font-medium text-slate-900">Mark as Active</label>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="button" className="flex-1" onClick={onHandleSubmit}>Save Changes</Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
};

export default PlanManagement;
