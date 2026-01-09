
import React from 'react';
// Fixed: Changed import source from 'react-router-dom' to 'react-router' as core routing members are available there in this environment.
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { UserRole } from './types';

// Page Imports
import { LandingPage } from './LandingPage';
import { BrowsePage } from './BrowsePage';
import { PricingPage } from './PricingPage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { BusinessProfilePage } from './BusinessProfilePage';
import { BusinessDashboard } from './BusinessDashboard';
import { ClientAppointmentsPage } from './ClientAppointmentsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: UserRole }> = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === UserRole.BUSINESS ? "/dashboard" : "/browse"} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/business/:id" element={<BusinessProfilePage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute role={UserRole.BUSINESS}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-appointments" 
                element={
                  <ProtectedRoute role={UserRole.CLIENT}>
                    <ClientAppointmentsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}