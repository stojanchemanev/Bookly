
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.tsx';
import { NotificationProvider } from './NotificationContext.tsx';
import { BookingProvider } from './BookingContext.tsx';
import { UserRole } from './types.ts';

// Page Imports
import { LandingPage } from './LandingPage.tsx';
import { BrowsePage } from './BrowsePage.tsx';
import { PricingPage } from './PricingPage.tsx';
import { LoginPage } from './LoginPage.tsx';
import { RegisterPage } from './RegisterPage.tsx';
import { BusinessProfilePage } from './BusinessProfilePage.tsx';
import { BusinessDashboard } from './BusinessDashboard.tsx';
import { ClientAppointmentsPage } from './ClientAppointmentsPage.tsx';

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
        <BookingProvider>
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
        </BookingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}