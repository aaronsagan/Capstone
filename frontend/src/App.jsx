// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// layouts
import PublicLayout from './layouts/PublicLayout';
import CharityLayout from './layouts/CharityLayout';

// auth context & guards
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGate from './components/RoleGate';

// public pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import CharitiesList from './pages/Charities/List';
import CharityDetail from './pages/Charities/Detail';

// auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// donor pages
import DonateForm from './pages/Donate/Form';
import MeDashboard from './pages/Me/Dashboard';

// charity admin pages
import CharityDashboard from './pages/Charity/Dashboard';
import Organization from './pages/Charity/Organization';
import Channels from './pages/Charity/Channels';
import Campaigns from './pages/Charity/Campaigns';
import Inbox from './pages/Charity/Inbox';           // NEW
import FundUsage from './pages/Charity/FundUsage';   // NEW

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public shell (navbar + footer) */}
        <Route element={<PublicLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/charities" element={<CharitiesList />} />
          <Route path="/charities/:id" element={<CharityDetail />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Donor-only */}
          <Route
            path="/donate/:charityId/:campaignId?"
            element={
              <ProtectedRoute>
                <RoleGate allow={['donor']}>
                  <DonateForm />
                </RoleGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <RoleGate allow={['donor']}>
                  <MeDashboard />
                </RoleGate>
              </ProtectedRoute>
            }
          />

          {/* Charity Admin (nested) */}
          <Route
            path="/charity"
            element={
              <ProtectedRoute>
                <RoleGate allow={['charity_admin']}>
                  <CharityLayout />
                </RoleGate>
              </ProtectedRoute>
            }
          >
            <Route index element={<CharityDashboard />} />
            <Route path="organization" element={<Organization />} />
            <Route path="channels" element={<Channels />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="inbox" element={<Inbox />} />                {/* NEW */}
            <Route path="fund-usage" element={<FundUsage />} />       {/* NEW */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-2">404 — Page not found</h3>
      <p className="text-secondary">The page you’re looking for doesn’t exist.</p>
    </div>
  );
}
