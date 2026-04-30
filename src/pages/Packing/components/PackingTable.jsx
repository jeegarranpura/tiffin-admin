import React, { useEffect, useState } from 'react';
// import Table from '../../../components/Common/Table';
// import Badge from '../../../components/Common/Badge';
// import Button from '../../../components/Common/Button';

const Table = React.lazy(() => import('../../../components/Common/Table'));
const Badge = React.lazy(() => import('../../../components/Common/Badge'));
const Button = React.lazy(() => import('../../../components/Common/Button'));

const PackingTable = (props) => {
  const { selectedRoute, handleSelectRoute, updateOrderStatusReq, isLoading, error, message } = props;
  const [orders, setOrders] = useState([]);
  console.log('selectedRoute', selectedRoute)
  console.log('orders', orders)
  // const orders = selectedRoute?.Orders ?? [];

  useEffect(() => {
    // if (selectedRoute) {
    setOrders(selectedRoute?.Orders);
    // }
  }, [selectedRoute?.Orders]);

  const handleClickStatusChange = async (orderID) => {
    console.log('orderID', orderID)
    const updatedOrders = selectedRoute?.Orders?.map((order) => {
      if (order.id === orderID) {
        const newOrder = { ...order, status: 'packed' }
        return newOrder
      }
      return order
    })
    const res = await updateOrderStatusReq({ id: orderID, status: 'packed' })
    if (res.payload) {
      setOrders(updatedOrders)
      handleSelectRoute({ ...selectedRoute, Orders: updatedOrders })
    }
    // setOrders(selectedRoute?.Orders)
  }


  const headers = [
    {
      label: 'Customer Details',
      key: 'Customer',
      render: (value, row) => {
        return <span className={`text-sm ${row?.status === 'packed' ? 'line-through' : ''}`}>{value?.name}</span>
      }
    },
    {
      label: 'Plan',
      key: 'Customer',
      render: (value, row) => {
        return <span className={`text-sm ${row?.status === 'packed' ? 'line-through' : ''}`}>{value?.Plan?.name}</span>
      }
    },
    {
      label: "Items",
      key: "Customer",
      render: (value, row) => {
        const items = value?.Plan?.items;
        console.log('items', items)
        return items.map((item) => {
          return <Badge className={`text-sm mr-1 ${row?.status === 'packed' ? 'line-through' : ''}`}>{item}</Badge>
        })
      }
    },
    {
      label: 'Meal Type',
      key: 'mealTime',
      render: (value, row) => {
        return <span className={`text-sm ${row?.status === 'packed' ? 'line-through' : ''}`}>{value}</span>
      }
    },
    // { key: 'Special Instructions', label: 'Special Instructions',  },
    { key: 'status', label: 'Status', render: (value, row) => { return <Badge variant={row?.status === 'packed' ? 'emerald' : 'amber'}>{value}</Badge> } },
    {
      key: 'id', label: 'Action', render: (value, row) => {
        return <Button
          disabled={row?.status === 'packed'}
          variant={row?.status === 'packed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClickStatusChange(value)}
        >Mark Packed</Button>
      }
    },
  ];

  const packingData = [
    {
      id: 1,
      customer: 'James Wilson',
      address: 'Apt 4B, 12th Street',
      mealType: 'Regular Non-Veg',
      mealVariant: 'slate',
      instructions: 'No onions in salad',
      status: 'Pending',
      statusVariant: 'amber',
      isPacked: false,
    },
    {
      id: 2,
      customer: 'Elena Rodriguez',
      address: 'Penthouse 2, Sky Tower',
      mealType: 'Diet Keto Plan',
      mealVariant: 'primary',
      instructions: (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-bold">
          <span className="material-symbols-outlined text-[12px]">warning</span> NUT ALLERGY
        </span>
      ),
      status: 'Pending',
      statusVariant: 'amber',
      isPacked: false,
    },
    {
      id: 3,
      customer: 'Michael Chen',
      address: 'Suite 304, Tech Plaza',
      mealType: 'Regular Veg',
      mealVariant: 'slate',
      instructions: '—',
      status: 'Packed',
      statusVariant: 'emerald',
      isPacked: true,
    },
    {
      id: 4,
      customer: 'Sarah Miller',
      address: '15 Green Lane',
      mealType: 'Gluten-Free Veg',
      mealVariant: 'slate',
      instructions: 'Extra desert cup',
      status: 'Packed',
      statusVariant: 'emerald',
      isPacked: true,
    },
    {
      id: 5,
      customer: 'Robert Taylor',
      address: 'City Hospital, Staff Room',
      mealType: 'Regular Non-Veg',
      mealVariant: 'slate',
      instructions: '—',
      status: 'Pending',
      statusVariant: 'amber',
      isPacked: false,
    },
  ];

  return (
    <Table
      headers={headers}
      tableData={orders}
      footer={
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing 5 of 42 customers in Downtown Route</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Prev</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      }
    >
    </Table>
  );
};

export default PackingTable;
