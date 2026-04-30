import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
// import MainLayout from './components/Layout/MainLayout';
// import DashboardOverview from './pages/Dashboard/DashboardOverview';
// import PackingPage from './pages/Packing/PackingPage';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

const MainLayout = React.lazy(() => import('./components/Layout/MainLayout'));
const DashboardContainer = React.lazy(() => import('./features/DashboardContainer/DashboardContainer'));

const PackingContainer = React.lazy(() => import('./features/PackingContainer/PackingContainer'));
const ProtectedRoute = React.lazy(() => import('./components/Auth/ProtectedRoute'));
const AuthContainer = React.lazy(() => import('./features/AuthContainer/AuthContainer'))
const PlanContainer = React.lazy(() => import('./features/PlanContainer/PlanContainer'))
const CustomerContainer = React.lazy(() => import('./features/CustomerContainer/CustomerContainer'))
const RouteContainer = React.lazy(() => import('./features/RouteContainer/RouteContainer'))
const SubscribeContainer = React.lazy(() => import('./features/SubscribeContainer/SubscribeContainer'))
const ReportContainer = React.lazy(() => import('./features/ReportContainer/ReportContainer'))
const UserContainer = React.lazy(() => import('./features/UserContainer/UserContainer'))
const LiveTrackingPage = React.lazy(() => import('./pages/LiveTracking/LiveTrackingPage'))

function App() {
  return (

    <Router>
      <Suspense fallback={<div>Loading...</div>}>

        <Routes>
          <Route path="/login" element={<AuthContainer />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardContainer />} />

              <Route path="/plans" element={<PlanContainer />} />
              <Route path="/packing" element={<PackingContainer />} />
              <Route path="/customers" element={<CustomerContainer />} />
              <Route path="/routes" element={<RouteContainer />} />
              <Route path="/payments" element={<SubscribeContainer />} />
              <Route path="/reports" element={<ReportContainer />} />
              <Route path="/users" element={<UserContainer />} />
              <Route path="/live-tracking/:routeId" element={<LiveTrackingPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
