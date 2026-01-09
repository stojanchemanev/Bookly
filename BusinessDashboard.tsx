
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { Card, Button } from './UIComponents.tsx';
import { NotificationBell } from './NotificationBell.tsx';
import { MOCK_BUSINESSES } from './constants.tsx';

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

const BusinessSettings: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(MOCK_BUSINESSES[0].logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-8">
      <h3 className="text-2xl font-black mb-8">Business Profile</h3>
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Business Logo</label>
          <div className="flex items-center gap-8">
            <div 
              className="relative w-32 h-32 rounded-3xl overflow-hidden group cursor-pointer border-4 border-gray-50 shadow-inner"
              onClick={triggerFileInput}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-4 font-medium">Recommended: Square image, at least 400x400px. Supports PNG, JPG.</p>
              <Button variant="outline" onClick={triggerFileInput} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Change Logo
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Business Name</label>
            <input 
              type="text" 
              placeholder="Business Name" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
              defaultValue="The Sharp Blade Barbers" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
            <textarea 
              placeholder="Tell your clients what you do..." 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-32 font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none" 
              defaultValue="Premium grooming for the modern gentleman." 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="px-12 py-4 text-lg font-black shadow-xl shadow-indigo-100">
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r hidden lg:block p-8">
        <h2 className="text-2xl font-black text-indigo-600 mb-10">Bookly</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-gray-100 text-gray-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('calendar')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-gray-100 text-gray-500'}`}>Calendar</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-gray-100 text-gray-500'}`}>Settings</button>
        </nav>
      </aside>
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black capitalize tracking-tight">{activeTab}</h1>
          <NotificationBell />
        </header>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none shadow-sm ring-1 ring-gray-100">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Total Bookings</h4>
              <p className="text-4xl font-black">128</p>
              <div className="mt-4 text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full inline-block">+12% from last month</div>
            </Card>
            <Card className="p-8 border-none shadow-sm ring-1 ring-gray-100">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">New Clients</h4>
              <p className="text-4xl font-black">42</p>
              <div className="mt-4 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full inline-block">5 new today</div>
            </Card>
            <Card className="p-8 border-none shadow-sm ring-1 ring-gray-100">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Revenue</h4>
              <p className="text-4xl font-black text-green-600">$4,280</p>
              <div className="mt-4 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full inline-block">Estimated payout: Friday</div>
            </Card>
          </div>
        )}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'settings' && <BusinessSettings />}
      </main>
    </div>
  );
};
