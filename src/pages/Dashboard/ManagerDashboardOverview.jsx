import React from 'react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Table from '../../components/Common/Table';

const ManagerDashboardOverview = () => {
    const stats = [
        { icon: 'group', label: 'Total Customers', value: '1,284', change: '+12%', positive: true },
        { icon: 'card_membership', label: 'Active Subscriptions', value: '856', change: '+5.2%', positive: true },
        { icon: 'local_shipping', label: "Today's Deliveries", value: '320', change: '-2.1%', positive: false },
        { icon: 'schedule', label: 'Pending Deliveries', value: '45', change: 'Stable', neutral: true },
    ];

    const recentActivity = [
        {
            customer: 'Jane Cooper',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5y5TdYkbFUqDLsniiT--krmEvVoQL-wqqf-IEPlyeHk7elOBb4vZ_iBD_e4NX09OhfNgOhOy7c_ipL0PCVpgKIey13dN4-DduqvfMYhRwXXAVp8tJuwS5-xGWvWtMF5zroiEqzFK8ig4gVa8EzRFd2deEUzn5fj-6rH6ONgUbN02lPpPhD80-VEZFwUYM1mdm4hzUqU7CfXMLz9ZV8_lWP3nN_WT2i2r-MHnrOZQaabIFHw1xwHwGC_UZUI3mAHw9pBzk-qm8z2A',
            activity: 'Monthly Plan Renewal',
            status: 'Paid',
            time: '2 mins ago',
            statusColor: 'green'
        },
        {
            customer: 'Robert Fox',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXt-xG7LXFg0HjA6-pXfKXSWU_54bL-rBEpbXNLmmanbOfCAn-epYKfYthwTWzVONG8SigVjeU4u18ksB5aCBqs8o4Cc757x6M6_DaLd9topzqRy3Mbvjpmbc2VsR2ECR7tlwcgVBhJlcz-0QLFBQEdQvlsuI_0tJVM9GokMgRnwAutL8ox4XCuCb3m_RCrzMh9ZLdVy4dYSb1ZQu20W5J2OnIem4bFvu0W7gogH-4EeoQmcLDW5q0r7pZjqM1pK4pmlnslH4z_hQ',
            activity: 'Order #8821 Delivered',
            status: 'Complete',
            time: '15 mins ago',
            statusColor: 'blue'
        },
        {
            customer: 'Esther Howard',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYSFcbZiacLScIsbOStNySUELF-1DgYpyiwCpcCzFGS-Haw141DaB6AT4XB44pUKH7gruAtbR5gV3xdMg9cDm161HntJZDmwQuPb9MqzJ4fFb86a3WbJkrNCQTafVt8bEqrDudxVV5DM44ObCxrk7ai_xqNm6gdF85ArRgmy5FKHYvN5K3Ftezl3AXyp963ljmfyuKHSTHwGlloEyvdv8fy-IzyMNTB3wYJdP1BuViDtRgATxPCcFY_tAPEoF1xrqV2RU-ITrtVwQ',
            activity: 'New Subscription Added',
            status: 'Processing',
            time: '45 mins ago',
            statusColor: 'yellow'
        },
        {
            customer: 'Jenny Wilson',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD7gaUcrMWym-m5yC-we-e3NrLLGYUvw95g84m-VWedtUB69-Keg7unx72PWxwRod4fOAWBW25La48kPmrU6hp2tqLMZPaevj1pLT_jXMSOhib9lyvm2_WFE2PVvEKyp9o_rMLuXExRzJBUL48iQcCV5LjhUXfPr_7hHJdwCtoUa35lKwLMkr8CN4j4G5ypv-trXUFu8zYMbg9H21d_R-IOD98mb2Mm_r71byrle6tQGTdOpO7NgjoPINSQ7h-R5JusZTpj8muYDg',
            activity: 'Address Update Requested',
            status: 'Pending',
            time: '1 hour ago',
            statusColor: 'slate'
        }
    ];

    const headers = [
        { label: 'Customer' },
        { label: 'Activity' },
        { label: 'Status' },
        { label: 'Time' },
    ];

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded border border-slate-200 shadow-sm transition-hover hover:shadow-md text-left">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded">{stat.icon}</span>
                            <span className={`text-xs font-bold ${stat.neutral ? 'text-slate-400' : stat.positive ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Trend Chart */}
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-left">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Daily Delivery Trend</h3>
                        <select className="text-xs bg-slate-100 border-none rounded focus:ring-0 p-1 px-2 cursor-pointer">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-64 relative flex items-end justify-between gap-1 pb-6 border-b border-slate-100">
                        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                            <path d="M0 120 Q 50 80, 100 100 T 200 60 T 300 90 T 400 40 V 150 H 0 Z" fill="url(#grad)" fillOpacity="0.1"></path>
                            <path d="M0 120 Q 50 80, 100 100 T 200 60 T 300 90 T 400 40" fill="none" stroke="#2563eb" strokeWidth="3"></path>
                            <defs>
                                <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }}></stop>
                                    <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 0 }}></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
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
                        {[40, 65, 85, 60, 75, 95].map((height, i) => (
                            <div key={i} className="w-full bg-slate-100 rounded-t relative group" style={{ height: `${height}%` }}>
                                <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t transition-all group-hover:bg-primary/80" style={{ height: '100%' }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">Recent Activity</h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <Table headers={headers}>
                        {recentActivity.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img className="size-8 rounded-full object-cover" alt={row.customer} src={row.avatar} />
                                    <span className="font-medium text-slate-900">{row.customer}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{row.activity}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={row.statusColor}>
                                        {row.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs">{row.time}</td>
                            </tr>
                        ))}
                    </Table>
                </div>

                {/* Live Tracking */}
                <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col overflow-hidden text-left">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">Live Tracking</h3>
                        <div className="flex items-center gap-2">
                            <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] relative bg-slate-200">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-70 grayscale"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8XB7KctPJ9Al1hPNR4Oxv-WT1kX8g4SHosIrOWaXJ7joP6ejh0_GyNewSwwmpDmNhGcdaiuI3wOgLuU7wcbERqQht-FF5gi1n0Sl2v3V_C-xD1mPnNwgg4HVhTDHeVtoG08pwKsJiWQVWGrJKjULNOruzD-_DafnCmYa9utPY0LSmto76BQaKqLramX8zzZIDnHHHT03DxmfvI_xGcLe0dEKz-649GgW0BMNLz2pMvl7xccURP2TgTUjCX1vPhllfCdmkbDa5ReI')`
                            }}
                        ></div>
                        {/* Map Pin Overlays */}
                        <div className="absolute top-1/4 left-1/3 text-primary flex flex-col items-center">
                            <span className="material-symbols-outlined text-3xl">location_on</span>
                            <div className="bg-white px-2 py-1 rounded text-[10px] shadow-lg border border-slate-200 -mt-1 font-bold whitespace-nowrap">
                                Driver 12
                            </div>
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 text-green-500 flex flex-col items-center">
                            <span className="material-symbols-outlined text-3xl">location_on</span>
                            <div className="bg-white px-2 py-1 rounded text-[10px] shadow-lg border border-slate-200 -mt-1 font-bold whitespace-nowrap">
                                Delivery 04
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded shadow-lg border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-lg">delivery_dining</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-900">Active Deliveries</p>
                                    <p className="text-[10px] text-slate-500">24 couriers on road</p>
                                </div>
                                <Button size="sm" variant="primary" className="text-[10px] py-1.5 uppercase">
                                    Expand
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboardOverview;
