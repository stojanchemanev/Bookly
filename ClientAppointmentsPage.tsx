
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Navbar } from './Navbar.tsx';
import { Card } from './UIComponents.tsx';
import { useAuth } from './AuthContext.tsx';
import { useBookings } from './BookingContext.tsx';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const ClientAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const { user } = useAuth();
  const { getClientAppointments } = useBookings();
  
  const allAppointments = user ? getClientAppointments(user.id) : [];

  // Categorize appointments
  const now = new Date();
  const filteredAppointments = allAppointments.filter(app => {
    const appDate = new Date(app.startTime);
    if (app.status === 'CANCELLED') return activeTab === 'cancelled';
    
    if (activeTab === 'upcoming') {
      return (app.status === 'CONFIRMED' || app.status === 'PENDING') && appDate >= now;
    }
    if (activeTab === 'past') {
      return (app.status === 'CONFIRMED') && appDate < now;
    }
    return false;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-green-100"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case 'PENDING':
        return <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100"><Clock className="w-3 h-3" /> Pending Approval</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-red-100"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Bookings</h1>
        <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl inline-flex">
          {(['upcoming', 'past', 'cancelled'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                activeTab === tab ? 'bg-white text-red-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 border-dashed">
              No appointments found in this category
            </div>
          ) : (
            filteredAppointments.map(app => (
              <Card key={app.id} className="p-6 border-none ring-1 ring-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{app.businessName}</h3>
                    <p className="text-sm text-gray-900 font-bold mt-1">{app.serviceName}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{app.employeeName} • {format(new Date(app.startTime), 'PPP p')}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    {getStatusBadge(app.status)}
                    <p className="font-bold text-gray-900">{app.price}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};