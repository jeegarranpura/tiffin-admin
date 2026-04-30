import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Table from '../../components/Common/Table';

import { 
  exportToExcel, 
  getDailyDeliveryReport, 
  getActiveCustomersReport, 
  getNonRenewedReport, 
  getUpcomingPaymentsReport,
  sendPaymentReminders
} from '../../utils/report-utils';

const DashboardOverview = (props) => {
  const navigate = useNavigate();
  const { stats, recentActivity, deliveryTrend, revenueOverview, isLoading } = props;
  const [reportPreview, setReportPreview] = React.useState({ type: null, data: [], headers: [] });

  const flattenData = (data, type) => {
    if (!data || data.length === 0) return [];
    
    switch (type) {
      case 'daily':
        return data.map(item => ({
          'Order ID': item.id,
          'Customer Name': item.Customer?.name || 'N/A',
          'Route Name': item.Route?.name || 'N/A',
          'Meal Time': item.mealTime,
          'Type': item.type,
          'Status': item.status,
          'Date': item.orderDate
        }));
      case 'active':
        return data.map(item => ({
          'Customer ID': item.id,
          'Name': item.name,
          'Phone': item.phone,
          'Address': item.address,
          'Status': item.isActive ? 'Active' : 'Inactive'
        }));
      case 'non-renewed':
        return data.map(item => ({
          'Customer ID': item.id,
          'Name': item.name,
          'Phone': item.phone,
          'Last Status': 'Expired'
        }));
      case 'upcoming':
        return data.map(item => ({
          'Customer Name': item.Customer?.name || 'N/A',
          'Phone': item.Customer?.phone || 'N/A',
          'Plan Type': item.planType,
          'Expiry Date': item.endDate,
          'Status': item.status
        }));
      default:
        return data;
    }
  };

  const handleDownload = async (reportType) => {
    try {
      let rawData, fileName;
      switch (reportType) {
        case 'daily':
          const dailyRes = await getDailyDeliveryReport();
          rawData = dailyRes.details || [];
          fileName = 'Daily_Delivery_Report';
          break;
        case 'active':
          rawData = await getActiveCustomersReport();
          fileName = 'Active_Customers_Report';
          break;
        case 'non-renewed':
          rawData = await getNonRenewedReport();
          fileName = 'Non_Renewed_Customers_Report';
          break;
        case 'upcoming':
          rawData = await getUpcomingPaymentsReport();
          fileName = 'Upcoming_Payments_Report';
          break;
        default:
          return;
      }
      
      const flatData = flattenData(rawData, reportType);
      exportToExcel(flatData, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report');
    }
  };

  const handleViewReport = async (reportType) => {
    try {
      let rawData, title;
      switch (reportType) {
        case 'daily':
          const dailyRes = await getDailyDeliveryReport();
          rawData = dailyRes.details || [];
          title = 'Daily Delivery Records';
          break;
        case 'active':
          rawData = await getActiveCustomersReport();
          title = 'Active Customer Records';
          break;
        case 'non-renewed':
          rawData = await getNonRenewedReport();
          title = 'Non-Renewed Records';
          break;
        case 'upcoming':
          rawData = await getUpcomingPaymentsReport();
          title = 'Upcoming Payment Records';
          break;
        default:
          return;
      }
      
      const flatData = flattenData(rawData, reportType);
      const headers = flatData.length > 0 ? Object.keys(flatData[0]).map(k => ({ label: k, key: k })) : [];
      setReportPreview({ type: title, data: flatData, headers });
    } catch (error) {
      console.error('Fetch failed:', error);
      alert('Failed to fetch records');
    }
  };

  const handleSendReminders = async () => {
    if (window.confirm('Send payment reminders to all customers whose plan expires tomorrow? (Testing: will send to Mailinator)')) {
      try {
        await sendPaymentReminders(true); // useMailinator = true
        alert('Payment reminders sent successfully! Check Mailinator.');
      } catch (error) {
        console.error('Reminders failed:', error);
        alert('Failed to send reminders');
      }
    }
  };

  const headers = [
    { label: 'Customer', key: 'customer' },
    { label: 'Activity', key: 'activity' },
    { label: 'Status', key: 'status' },
    { label: 'Time', key: 'time', render: (value) => formatTime(value) },
  ];



  // Helper to format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  // Generate SVG path for delivery trend
  const generateTrendPath = (trendData) => {
    if (!trendData || trendData.length === 0) return "";

    const maxVal = Math.max(...trendData.map(d => parseInt(d.count)), 10);
    const width = 400;
    const height = 120;
    const stepX = width / (trendData.length - 1 || 1);

    let path = `M 0 ${height - (parseInt(trendData[0]?.count || 0) / maxVal * height)}`;
    trendData.forEach((d, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = height - (parseInt(d.count) / maxVal * height);
      path += ` L ${x} ${y}`;
    });

    return path;
  };

  const trendPath = generateTrendPath(deliveryTrend);
  const trendAreaPath = trendPath ? `${trendPath} V 150 H 0 Z` : "";

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded border border-slate-200 shadow-sm transition-hover hover:shadow-md text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded">{stat.icon}</span>
              <span className={`text-xs font-bold ${stat.neutral ? 'text-slate-400' : stat.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1 text-slate-900">{isLoading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Reports Management Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 text-left px-1">Reports Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group">
            <div className="size-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Daily Delivery</h4>
              <p className="text-[10px] text-slate-500 mt-1">Today's full status report</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" className="text-[10px] py-1 flex-1" onClick={() => handleDownload('daily')}>
                Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-[10px] py-1 flex-1 border border-slate-100" onClick={() => handleViewReport('daily')}>
                View
              </Button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group">
            <div className="size-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined">person_check</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Active Customers</h4>
              <p className="text-[10px] text-slate-500 mt-1">Current recurring base</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" className="text-[10px] py-1 flex-1" onClick={() => handleDownload('active')}>
                Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-[10px] py-1 flex-1 border border-slate-100" onClick={() => handleViewReport('active')}>
                View
              </Button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group">
            <div className="size-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined">person_off</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Non-Renewed</h4>
              <p className="text-[10px] text-slate-500 mt-1">Action required/Lost</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" className="text-[10px] py-1 flex-1" onClick={() => handleDownload('non-renewed')}>
                Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-[10px] py-1 flex-1 border border-slate-100" onClick={() => handleViewReport('non-renewed')}>
                View
              </Button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group">
            <div className="size-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Upcoming Payments</h4>
              <p className="text-[10px] text-slate-500 mt-1">Forecasted collections</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" className="text-[10px] py-1 flex-1" onClick={() => handleDownload('upcoming')}>
                Excel
              </Button>
              <Button size="sm" variant="ghost" className="text-[10px] py-1 flex-1 border border-slate-100" onClick={() => handleViewReport('upcoming')}>
                View
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 size-20 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Payment Reminders</h4>
              <p className="text-[10px] text-slate-400 mt-1">Automatic email alert</p>
            </div>
            <Button size="sm" variant="primary" className="text-[10px] py-1 mt-auto shadow-none" onClick={handleSendReminders}>
              Send Reminders
            </Button>
          </div>
        </div>

        {/* Report Preview Table */}
        {reportPreview.type && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 text-primary rounded flex items-center justify-center">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <h4 className="font-bold text-slate-800">{reportPreview.type}</h4>
              </div>
              <Button size="sm" variant="ghost" icon="close" onClick={() => setReportPreview({ type: null, data: [], headers: [] })}>
                Close Preview
              </Button>
            </div>
            <div className="max-h-[400px] overflow-auto rounded-lg border border-slate-100">
              {reportPreview.data.length > 0 ? (
                <Table headers={reportPreview.headers} tableData={reportPreview.data} />
              ) : (
                <div className="p-12 text-center text-slate-400 italic bg-slate-50">
                  No records found for this report.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Trend Chart */}
        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Daily Delivery Trend</h3>
            <div className="text-xs text-slate-500">Last 7 days</div>
          </div>
          <div className="h-64 relative flex items-end justify-between gap-1 pb-6 border-b border-slate-100">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading trend data...</div>
            ) : deliveryTrend?.length > 0 ? (
              <>
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                  <path d={trendAreaPath} fill="url(#grad)" fillOpacity="0.1"></path>
                  <path d={trendPath} fill="none" stroke="#2563eb" strokeWidth="3"></path>
                  <defs>
                    <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }}></stop>
                      <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 0 }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No delivery data for the last 7 days</div>
            )}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            {deliveryTrend?.length > 0 ? deliveryTrend.map((d, i) => (
              <span key={i}>{new Date(d.orderDate).toLocaleDateString('en-US', { weekday: 'short' })}</span>
            )) : (
              <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>
            )}
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Revenue Overview</h3>
            <div className="flex gap-2 items-center">
              <span className="size-3 bg-primary rounded-full"></span>
              <span className="text-xs text-slate-500">Subscriptions</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-around gap-4 px-2">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading revenue data...</div>
            ) : revenueOverview?.length > 0 ? (
              revenueOverview.map((rev, i) => {
                const maxRev = Math.max(...revenueOverview.map(r => parseFloat(r.total)), 1000);
                const height = (parseFloat(rev.total) / maxRev) * 100;
                return (
                  <div key={i} className="w-full bg-slate-100 rounded-t relative group" style={{ height: `${Math.max(height, 5)}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t transition-all group-hover:bg-primary/80" style={{ height: '100%' }}></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ₹{parseFloat(rev.total).toLocaleString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No revenue data available</div>
            )}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            {revenueOverview?.length > 0 ? revenueOverview.map((rev, i) => (
              <span key={i}>{new Date(rev.month).toLocaleDateString('en-US', { month: 'short' })}</span>
            )) : (
              <><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>View All</Button>
          </div>
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 italic">Finding latest activity...</div>
          ) : recentActivity?.length > 0 ? (
            <Table headers={headers} tableData={recentActivity}>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400 italic">No recent activity found.</div>
          )}
        </div>

        {/* Live Tracking */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col overflow-hidden text-left">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-800">Live Tracking</h3>
              <p className="text-[10px] text-slate-500 font-medium">Active routes on field</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {props.routeList?.filter(r => r.status === 'in-progress').length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {props.routeList
                    .filter(r => r.status === 'in-progress')
                    .map((route) => (
                      <div key={route.id} className="p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center justify-between gap-3">
                          <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined">delivery</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 truncate">{route.name}</p>
                              <span className="shrink-0 size-1.5 bg-green-500 rounded-full"></span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              Agent: <span className="font-semibold text-slate-700">{route.agent?.username || 'Unassigned'}</span>
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[10px] py-1 border-slate-200 hover:border-primary shrink-0"
                            onClick={() => navigate(`/live-tracking/${route.id}`)}
                          >
                            Track
                          </Button>
                        </div>
                        {/* Status bar/info */}
                        <div className="mt-3 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-slate-400">
                              <span className="material-symbols-outlined text-[12px]">orders</span>
                              {route.Orders?.length || 0} stops
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                              {props.liveLocations?.[route.id] ? 'Active' : 'Awaiting sync'}
                            </span>
                          </div>
                          {props.liveLocations?.[route.id] && (
                            <span className="text-primary font-bold animate-pulse">Live Now</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                  <div className="size-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <span className="material-symbols-outlined text-3xl">pin_road</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">No Active Routes</h4>
                  <p className="text-xs text-slate-500 max-w-[180px]">When agents start delivery, they will appear here for live tracking.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 text-[10px]"
                    onClick={() => navigate('/routes')}
                  >
                    Manage Routes
                  </Button>
                </div>
              )}
            </div>
            {/* Summary footer */}
            {/* <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On-Field Support</p>
                <p className="text-xs font-medium">Contact dispatching for help</p>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="size-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
