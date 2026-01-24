import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Camera, Upload, CheckCircle, Home, Calendar as CalendarIcon, Settings as SettingsIcon, QrCode, Printer, Share2, ScanLine, Clock, XCircle, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ReactToPrint from 'react-to-print';
import Barcode from 'react-barcode';
import { Card, Button } from './UIComponents.tsx';
import { NotificationBell } from './NotificationBell.tsx';
import { MOCK_BUSINESSES } from './constants.tsx';
import { useBookings } from './BookingContext.tsx';
import { useNotifications } from './NotificationContext.tsx';

// Displays the booking calendar for the current day.
const CalendarView: React.FC = () => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  return (
    <Card className="p-0 border-none">
      <div className="grid grid-cols-[80px_1fr] bg-gray-50/50 border-b border-gray-100">
        <div className="p-4 font-bold text-xs text-gray-400 uppercase tracking-wider text-center">GMT-5</div>
        <div className="p-4 font-bold text-gray-900 border-l border-gray-100">Today • {format(new Date(), 'EEEE, MMM do')}</div>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map(h => (
          <div key={h} className="grid grid-cols-[80px_1fr] border-b border-gray-50 h-24">
            <div className="text-[10px] font-bold text-gray-400 text-right pr-4 pt-2">
              {format(new Date(new Date().setHours(h, 0, 0, 0)), 'h aa')}
            </div>
            <div className="relative border-l border-gray-100 hover:bg-red-50/10 transition-colors"></div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Provides marketing tools like QR code and printable posters.
const MarketingTab: React.FC = () => {
  const business = MOCK_BUSINESSES[0]; // In real app, get from context
  const posterRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  
  const [activeTool, setActiveTool] = useState<'poster' | 'barcode'>('poster');
  const [barcodeValue, setBarcodeValue] = useState('SUMMER-SALE-25');

  const bookingUrl = `${window.location.origin}${window.location.pathname}#/business/${business.id}`;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Marketing Toolkit</h3>
          <p className="text-sm text-gray-500 font-medium">Generate printables to grow your local presence.</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeTool === 'poster' ? 'primary' : 'outline'} 
            onClick={() => setActiveTool('poster')}
            className="text-xs"
          >
            <QrCode className="w-4 h-4" /> Booking Poster
          </Button>
          <Button 
            variant={activeTool === 'barcode' ? 'primary' : 'outline'} 
            onClick={() => setActiveTool('barcode')}
            className="text-xs"
          >
            <ScanLine className="w-4 h-4" /> Coupon Barcode
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {activeTool === 'poster' ? (
          <>
            <div className="space-y-6">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    Booking QR Code
                  </h4>
                  <ReactToPrint
                    trigger={() => (
                      <Button variant="outline" className="h-8 text-xs">
                        <Printer className="w-3 h-3" /> Print
                      </Button>
                    )}
                    content={() => posterRef.current}
                    documentTitle={`${business.name} Booking Poster`}
                  />
               </div>
              <Card className="p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-red-600" /> Direct Link
                </h4>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={bookingUrl} 
                    className="flex-1 p-2 bg-gray-50 border rounded-lg text-xs font-mono text-gray-500 overflow-hidden text-ellipsis"
                  />
                  <Button variant="outline" className="px-3" onClick={() => navigator.clipboard.writeText(bookingUrl)}>Copy</Button>
                </div>
              </Card>

              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h4 className="font-bold text-red-900 mb-2">Pro Tip</h4>
                <p className="text-sm text-red-700 leading-relaxed font-medium">
                  Place this QR code at your checkout counter or on your front window. 
                  Customers can scan it to view your availability and book their next session 
                  without needing to wait or call.
                </p>
              </div>
            </div>

            {/* Printable Poster Preview */}
            <div className="bg-gray-200 p-8 rounded-3xl shadow-inner flex justify-center overflow-hidden">
              <div 
                ref={posterRef}
                className="bg-white w-[400px] h-[560px] shadow-2xl p-10 flex flex-col items-center text-center border-[12px] border-white ring-1 ring-gray-200"
                style={{ printColorAdjust: 'exact' } as React.CSSProperties}
              >
                <div className="flex items-center gap-2 mb-8">
                  <CalendarIcon className="w-6 h-6 text-red-600" />
                  <span className="text-xl font-black text-gray-900 tracking-tight">Meetbe</span>
                </div>
                
                <img src={business.logo} alt="Logo" className="w-20 h-20 rounded-2xl object-cover mb-6 border-2 border-gray-100 shadow-sm" />
                
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{business.name}</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8">Official Booking Partner</p>
                
                <div className="p-6 bg-white border-[8px] border-gray-50 rounded-3xl mb-8 shadow-sm">
                  <QRCodeSVG 
                    value={bookingUrl} 
                    size={180} 
                    level="H" 
                    includeMargin={false}
                    imageSettings={{
                      src: business.logo,
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
                
                <h2 className="text-xl font-black text-red-600 mb-2 tracking-tight">SCAN TO BOOK</h2>
                <p className="text-sm text-gray-500 font-medium">Skip the wait. Schedule your <br/>next appointment instantly.</p>
                
                <div className="mt-auto pt-8 text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">
                  Powered by Meetbe.com
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    Linear Barcode Generator
                  </h4>
                  <ReactToPrint
                    trigger={() => (
                      <Button variant="outline" className="h-8 text-xs">
                        <Printer className="w-3 h-3" /> Print
                      </Button>
                    )}
                    content={() => barcodeRef.current}
                    documentTitle={`${business.name} Barcode`}
                  />
               </div>
              <Card className="p-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Barcode Content</label>
                <input 
                  type="text" 
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  placeholder="e.g. COUPON-123 or MEMBER-ID"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all uppercase"
                  maxLength={20}
                />
                <p className="text-xs text-gray-400 mt-2">Enter text to generate a Code 128 barcode.</p>
              </Card>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Usage Ideas</h4>
                <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4 font-medium">
                  <li>Create discount coupons (e.g., SAVE10)</li>
                  <li>Generate temporary membership cards</li>
                  <li>Label inventory or equipment</li>
                </ul>
              </div>
            </div>

            {/* Barcode Preview */}
            <div className="bg-gray-200 p-8 rounded-3xl shadow-inner flex justify-center items-center overflow-hidden min-h-[500px]">
              <div 
                ref={barcodeRef}
                className="bg-white p-12 shadow-2xl rounded-xl flex flex-col items-center justify-center border-4 border-white ring-1 ring-gray-200 max-w-sm"
                style={{ printColorAdjust: 'exact' } as React.CSSProperties}
              >
                <div className="flex items-center gap-2 mb-6 opacity-50">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-400 tracking-tight">Meetbe</span>
                </div>

                <div className="border-4 border-black p-4 rounded-lg bg-white">
                  <Barcode value={barcodeValue || 'EMPTY'} width={2} height={80} fontSize={16} />
                </div>
                
                <div className="mt-8 text-center">
                  <h3 className="font-black text-gray-900 text-lg uppercase tracking-wider">{business.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Official Voucher</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Allows business owners to update their profile and logo.
const BusinessSettings: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(MOCK_BUSINESSES[0].logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-black mb-8 text-gray-900">Settings</h3>
      <Card className="p-8 space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Store Logo</label>
          <div className="flex items-center gap-6">
            <div 
              className="relative w-24 h-24 rounded-2xl overflow-hidden group cursor-pointer border-2 border-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center"><Upload className="w-6 h-6 text-gray-300" /></div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
            <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Business Name</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all" defaultValue="The Sharp Blade Barbers" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-24 font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none" defaultValue="Premium grooming for the modern gentleman." />
          </div>
        </div>
        <div className="pt-4">
          <Button className="w-full py-4 text-md font-bold rounded-xl shadow-lg shadow-red-100">Save Profile</Button>
        </div>
      </Card>
    </div>
  );
};

// Overview Tab with Pending Request Management
const OverviewTab: React.FC = () => {
  const business = MOCK_BUSINESSES[0];
  const { getBusinessAppointments, updateStatus } = useBookings();
  const { addNotification } = useNotifications();
  
  const appointments = getBusinessAppointments(business.id);
  const pending = appointments.filter(a => a.status === 'PENDING').sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED');

  const handleAction = (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    updateStatus(id, status);
    addNotification(
      status === 'CONFIRMED' ? 'Booking Accepted' : 'Booking Declined',
      `You have ${status.toLowerCase()} the appointment.`,
      'system'
    );
  };

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-none ring-1 ring-gray-100">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</div>
            <div className="text-3xl font-bold">{confirmed.length}</div>
            <div className="mt-4 text-xs font-bold text-red-500">+12% vs last month</div>
          </Card>
          <Card className="p-6 border-none ring-1 ring-gray-100">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Requests</div>
            <div className="text-3xl font-bold text-amber-500">{pending.length}</div>
            <div className="mt-4 text-xs font-bold text-gray-400 italic">Action required</div>
          </Card>
          <Card className="p-6 border-none ring-1 ring-gray-100">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Est. Revenue</div>
            <div className="text-3xl font-bold text-green-600">${confirmed.reduce((acc, curr) => acc + parseInt(curr.price.replace('$','')), 0)}</div>
            <div className="mt-4 text-xs font-bold text-green-600">Payout: Friday</div>
          </Card>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Pending Requests
             </h3>
             {pending.length === 0 ? (
               <Card className="p-12 text-center text-gray-400 border-dashed">
                 <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                 <p className="font-medium">All caught up! No pending requests.</p>
               </Card>
             ) : (
               pending.map(ppt => (
                 <Card key={ppt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-400">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-lg">{ppt.clientName}</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">New</span>
                       </div>
                       <p className="text-sm text-gray-600 font-medium">{ppt.serviceName} • {ppt.duration} mins</p>
                       <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">
                          {format(new Date(ppt.startTime), 'EEEE, MMM do')} at {format(new Date(ppt.startTime), 'h:mm a')}
                       </p>
                       <p className="text-xs text-gray-500 mt-1">with {ppt.employeeName}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                       <Button variant="outline" onClick={() => handleAction(ppt.id, 'CANCELLED')} className="text-red-600 hover:bg-red-50 hover:border-red-200">
                          <XCircle className="w-4 h-4" /> Decline
                       </Button>
                       <Button onClick={() => handleAction(ppt.id, 'CONFIRMED')} className="bg-green-600 hover:bg-green-700 text-white border-none shadow-green-100">
                          <Check className="w-4 h-4" /> Accept
                       </Button>
                    </div>
                 </Card>
               ))
             )}
          </div>
          
          <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Recent Bookings</h3>
              <div className="space-y-3">
                {confirmed.slice(0, 5).map(ppt => (
                  <Card key={ppt.id} className="p-4 border-none ring-1 ring-gray-100">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="font-bold text-sm text-gray-900">{ppt.clientName}</p>
                          <p className="text-xs text-gray-500">{format(new Date(ppt.startTime), 'MMM d, h:mm a')}</p>
                       </div>
                       <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded">Confirmed</span>
                    </div>
                  </Card>
                ))}
                {confirmed.length === 0 && <p className="text-sm text-gray-400 italic">No confirmed bookings yet.</p>}
              </div>
          </div>
       </div>
    </div>
  );
};

// Main layout component for the business owner's dashboard.
export const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'marketing' | 'settings'>('overview');

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'marketing', icon: QrCode, label: 'Marketing' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen no-print">
        <div className="flex items-center gap-2 mb-10 px-2">
          <CalendarIcon className="w-6 h-6 text-red-600" />
          <span className="text-xl font-black tracking-tight">Meetbe</span>
        </div>
        <nav className="space-y-1.5 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-red-50 text-red-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content display area */}
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 no-print">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100">Live</div>
            <NotificationBell />
          </div>
        </header>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'marketing' && <MarketingTab />}
        {activeTab === 'settings' && <BusinessSettings />}
      </main>
    </div>
  );
};