import React from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/AuthContainer/authSlice';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', allowedRoles: ['admin', 'manager'] },
    { to: '/packing', icon: 'inventory_2', label: 'Packing List', allowedRoles: ['admin', 'packer'] },
    { to: '/plans', icon: 'calendar_month', label: 'Plans', allowedRoles: ['admin', 'manager'] },
    { to: '/customers', icon: 'group', label: 'Customers', allowedRoles: ['admin', 'manager'] },
    { to: '/routes', icon: 'route', label: 'Routes', allowedRoles: ['admin', 'manager'] },
    { to: '/payments', icon: 'payments', label: 'Subscriptions & Payments', allowedRoles: ['admin'] },
    { to: '/reports', icon: 'bar_chart', label: 'Reports', allowedRoles: ['admin', 'manager'] },
    { to: '/users', icon: 'manage_accounts', label: 'Manage Users', allowedRoles: ['admin'] },
    // { to: '/orders', icon: 'shopping_bag', label: 'Orders', allowedRoles: ['admin', 'manager'] },

  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">restaurant</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-slate-900">Tiffin Admin</h1>
          <p className="text-xs text-slate-500">Manage Deliveries</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.filter((item) => item.allowedRoles.includes(user.role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-slate-100'}
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 pb-2 px-3 text-left">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">System</p>
        </div>
        {
          user.role === 'admin' && (
            <NavLink
              to="/settings"
              className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-slate-100'}
          `}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </NavLink>
          )}

        <div className="pt-4 pb-2 px-3 text-left">
          <div className="h-[1px] bg-slate-100 w-full mb-4"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-200 overflow-hidden text-left">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeOnPysLqyGtoA7L4PMu79Z2wli8q5Vs3YYL_0Vh-NA7C4uKTccBrZa2OsJB3XZ3zta0KF5xjc78dnjJG002gyvxWrjx2cijN8MdRuloGsFkVlz3-_JRdjgtSsnXknBAD3YAFnhXwar2a7YNfi6qBK2_FI07pkkWziVY0r2ZE1t8EidVRRh2vWiSihtqRgJEfv6_S_ZoxBTmze_yDlAPGJ4baQNpKe7kp0Zdsx3NmFTG2YNhrb9-upbrfYvoG1DbfnE3-ROqjypTU"
            />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold truncate text-slate-900">{user.username}</p>
            <p className="text-xs text-slate-500 truncate text-left">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
