
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, Button } from './UIComponents';
import { NotificationBell } from './NotificationBell';

const CalendarView: React.FC = () => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  return (
    <Card className="p-8">
      <div className="grid grid-cols-[100px_1fr] border-b pb-4 mb-4">
        <div className="font-bold text-gray-400">Time</div>
        <div className="font-bold text-gray-900">Schedule</div>
      </div>
      {hours.map(h => (
        <div key={h} className="grid grid-cols-[100px_1fr] border-b border-gray-50 h-20">
          <div className="text-sm font-bold text-gray-400 pt-2">{format(new Date(new Date().setHours(h, 0, 0, 0)), 'h aa')}</div>
          <div className="relative border-l"></div>
        </div>
      ))}
    </Card>
  );
};

const BusinessSettings: React.FC = () => (
  <Card className="p-8">
    <h3 className="text-2xl font-black mb-6">Business Profile</h3>
    <div className="space-y-4">
      <input type="text" placeholder="Business Name" className="w-full p-4 border rounded-2xl font-medium" defaultValue="The Sharp Blade Barbers" />
      <textarea placeholder="Description" className="w-full p-4 border rounded-2xl h-32 font-medium" defaultValue="Premium grooming for the modern gentleman." />
      <Button className="px-8 py-3">Save Settings</Button>
    </div>
  </Card>
);

export const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r hidden lg:block p-8">
        <h2 className="text-2xl font-black text-indigo-600 mb-10">Bookly</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>Overview</button>
          <button onClick={() => setActiveTab('calendar')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>Calendar</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>Settings</button>
        </nav>
      </aside>
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black capitalize">{activeTab}</h1>
          <NotificationBell />
        </header>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-8">
            <Card className="p-8">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Total Bookings</h4>
              <p className="text-4xl font-black">128</p>
            </Card>
            <Card className="p-8">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">New Clients</h4>
              <p className="text-4xl font-black">42</p>
            </Card>
            <Card className="p-8">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Revenue</h4>
              <p className="text-4xl font-black text-green-600">$4,280</p>
            </Card>
          </div>
        )}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'settings' && <BusinessSettings />}
      </main>
    </div>
  );
};
