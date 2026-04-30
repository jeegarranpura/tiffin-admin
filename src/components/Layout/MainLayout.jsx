import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard Overview';
      case '/plans': return 'Plan Management';
      case '/customers': return 'Customer Management';
      case '/payments': return 'Payments Management';
      case '/packing': return 'Packing List';
      case '/routes': return 'Route Management';
      case '/reports': return 'Operational Reports';
      default: return 'Management';
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getTitle()} />
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
