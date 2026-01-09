
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Navbar } from './Navbar.tsx';
import { Card } from './UIComponents.tsx';

export const ClientAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const mockAppointments = [
    { id: '1', businessName: 'The Sharp Blade', employeeName: 'James Wilson', time: addDays(new Date(), 2).toISOString(), status: 'CONFIRMED', price: '$45' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-10">My Bookings</h1>
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('upcoming')} className={`px-6 py-3 rounded-2xl font-bold ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Upcoming</button>
          <button onClick={() => setActiveTab('past')} className={`px-6 py-3 rounded-2xl font-bold ${activeTab === 'past' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Past</button>
        </div>
        <div className="space-y-4">
          {mockAppointments.map(app => (
            <Card key={app.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{app.businessName}</h3>
                  <p className="text-gray-500 font-medium">{app.employeeName} • {format(new Date(app.time), 'PPP p')}</p>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">{app.status}</span>
                  <p className="font-black mt-2">{app.price}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
