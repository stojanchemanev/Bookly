
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, CheckCircle, Info, X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { Navbar } from './Navbar.tsx';
import { MOCK_BUSINESSES, MOCK_EMPLOYEES, MOCK_SERVICES } from './constants.tsx';
import { useNotifications } from './NotificationContext.tsx';
import { useBookings } from './BookingContext.tsx';
import { useAuth } from './AuthContext.tsx';
import { Card, Button } from './UIComponents.tsx';
import { Employee, TimeSlot, Service, Appointment } from './types.ts';

export const BusinessProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = MOCK_BUSINESSES.find(b => b.id === id);
  const employees = MOCK_EMPLOYEES.filter(e => e.businessId === id);
  const services = MOCK_SERVICES.filter(s => s.businessId === id);
  const { addNotification } = useNotifications();
  const { addAppointment } = useBookings();
  const { user } = useAuth();
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State for the confirmation modal
  const [slotToConfirm, setSlotToConfirm] = useState<TimeSlot | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  // SEO Meta Tags Injection
  useEffect(() => {
    if (business) {
      document.title = `${business.name} | Meetbe`;
      
      const metaTags = [
        { name: 'description', content: business.description },
        { property: 'og:title', content: `${business.name} - Book on Meetbe` },
        { property: 'og:description', content: business.description },
        { property: 'og:image', content: business.logo },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'business.business' },
        { property: 'og:site_name', content: 'Meetbe' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${business.name} - Book on Meetbe` },
        { name: 'twitter:description', content: business.description },
        { name: 'twitter:image', content: business.logo }
      ];

      metaTags.forEach(tag => {
        let element;
        if (tag.name) {
          element = document.querySelector(`meta[name="${tag.name}"]`);
          if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', tag.name);
            document.head.appendChild(element);
          }
        } else if (tag.property) {
          element = document.querySelector(`meta[property="${tag.property}"]`);
          if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', tag.property);
            document.head.appendChild(element);
          }
        }
        element.setAttribute('content', tag.content);
      });

      return () => {
        document.title = 'Meetbe - Smart Appointments';
      };
    }
  }, [business]);

  const slots = useMemo(() => {
    const s: TimeSlot[] = [];
    if (!selectedEmployee || !selectedService) return [];
    
    for (let i = 0; i < 6; i++) {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const simpleStart = addHours(dayStart, 9 + i);

      s.push({
        id: `slot-${i}`,
        employeeId: selectedEmployee.id,
        businessId: id!,
        startTime: simpleStart.toISOString(),
        endTime: addHours(simpleStart, 1).toISOString(),
        isBooked: i % 3 === 0
      });
    }
    return s;
  }, [selectedEmployee, selectedService, selectedDate, id]);

  const initiateBooking = (slot: TimeSlot) => {
    if (!user) {
      // If user is not logged in, redirect to login with return path
      navigate('/login', { state: { from: window.location } });
      return;
    }
    setSlotToConfirm(slot);
  };

  const confirmBooking = () => {
    if (slotToConfirm && selectedEmployee && selectedService && business && user) {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        slotId: slotToConfirm.id,
        clientId: user.id,
        clientName: user.name,
        businessId: business.id,
        businessName: business.name,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        serviceName: selectedService.name,
        startTime: slotToConfirm.startTime,
        duration: selectedService.duration,
        price: selectedService.price,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };

      addAppointment(newAppointment);
      setBookingConfirmed(true);
      
      addNotification(
        'Booking Request Sent',
        `Your request for ${selectedService.name} is pending approval from ${business.name}.`,
        'booking'
      );
      setSlotToConfirm(null);
    }
  };

  const resetSelection = () => {
    setBookingConfirmed(false);
    setSelectedEmployee(null);
    setSelectedService(null);
    setSlotToConfirm(null);
  };

  if (!business) return <div className="p-20 text-center font-bold text-gray-400">Business not found</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <div className="bg-red-600 h-64 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute -bottom-12 left-4 md:left-24 p-1.5 bg-white rounded-2xl shadow-xl">
          <img src={business.logo} alt={business.name} className="w-32 h-32 rounded-xl object-cover" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-20 pb-24 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-gray-900">{business.name}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600 mb-8">
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm text-sm"><MapPin className="w-4 h-4 text-red-500" /> {business.address}</span>
              <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm text-sm font-bold text-gray-800"><Star className="w-4 h-4 fill-current text-amber-500" /> {business.rating} Rating</span>
              <span className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-100 font-bold uppercase tracking-widest text-[10px]">{business.category}</span>
            </div>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl font-medium">{business.description}</p>
          </section>

          {/* Step 1: Employee Selection */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">1. Choose a Professional</h2>
              <span className="text-xs text-gray-400 font-black uppercase tracking-widest">{employees.length} Staff</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {employees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setBookingConfirmed(false); 
                  }}
                  className={`p-6 rounded-xl border-2 transition-all text-center ${
                    selectedEmployee?.id === emp.id 
                      ? 'bg-red-50/50 border-red-600 ring-4 ring-red-50 shadow-lg' 
                      : 'bg-white border-gray-100 hover:border-red-200 hover:shadow-md'
                  }`}
                >
                  <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-xl mx-auto object-cover mb-4" />
                  <h4 className="font-bold text-gray-900">{emp.name}</h4>
                  <p className="text-xs text-red-600 font-black uppercase tracking-widest mt-1">{emp.role}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Service Selection */}
          {selectedEmployee && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">2. Select a Therapy / Service</h2>
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest">{services.length} Available</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                        setSelectedService(service);
                        setBookingConfirmed(false);
                    }}
                    className={`flex items-start justify-between p-5 rounded-xl border-2 transition-all text-left ${
                      selectedService?.id === service.id
                        ? 'bg-red-50/50 border-red-600 shadow-md'
                        : 'bg-white border-gray-100 hover:border-red-200 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{service.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{service.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                         <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{service.duration} mins</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-red-600">{service.price}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <Card className="sticky top-24 p-8 border-none ring-1 ring-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-red-600" /> Book Session
            </h3>
            {bookingConfirmed ? (
              <div className="text-center py-10 animate-in zoom-in duration-300">
                <CheckCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900">Request Sent</h4>
                <p className="text-sm text-gray-500 mt-2">Waiting for approval.</p>
                <div className="bg-amber-50 rounded-lg p-4 mt-6 text-left border border-amber-100">
                    <p className="text-xs text-amber-800 uppercase font-black tracking-widest mb-1">Status</p>
                    <p className="font-bold text-amber-900 text-sm mb-3">Pending Confirmation</p>
                    <p className="text-xs text-amber-800 uppercase font-black tracking-widest mb-1">Service</p>
                    <p className="font-bold text-amber-900 text-sm">{selectedService?.name}</p>
                </div>
                <Button className="w-full mt-8" onClick={resetSelection}>Book Another</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">3. Select Time</label>
                  {!selectedEmployee ? (
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-400 text-center italic">Select a professional first</div>
                  ) : !selectedService ? (
                     <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-400 text-center italic">Select a therapy to see times</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          disabled={slot.isBooked}
                          onClick={() => initiateBooking(slot)}
                          className={`p-3 text-xs font-bold rounded-lg border transition-all text-center ${
                            slot.isBooked 
                              ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed line-through' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-red-600 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          {format(new Date(slot.startTime), 'p')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedService && (
                   <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm mb-2">
                         <span className="text-gray-500 font-medium">Service Total</span>
                         <span className="font-bold text-gray-900">{selectedService.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500 font-medium">Duration</span>
                         <span className="font-bold text-gray-900">{selectedService.duration} min</span>
                      </div>
                   </div>
                )}
              </div>
            )}
          </Card>
        </aside>
      </main>

      {/* Confirmation Popup Modal */}
      {slotToConfirm && selectedEmployee && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-black text-gray-900">Confirm Booking</h3>
                    <button onClick={() => setSlotToConfirm(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4 p-3 bg-red-50 rounded-xl">
                       <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 text-red-600">
                          <CalendarIcon className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-red-500 uppercase tracking-wider mb-1">When</p>
                          <p className="text-sm font-bold text-gray-900">{format(new Date(slotToConfirm.startTime), 'EEEE, MMM do')}</p>
                          <p className="text-sm font-medium text-gray-600">{format(new Date(slotToConfirm.startTime), 'h:mm a')} - {format(new Date(slotToConfirm.endTime), 'h:mm a')}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                       <div className="flex items-center gap-3">
                          <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                             <p className="text-xs font-bold text-gray-900">{selectedEmployee.name}</p>
                             <p className="text-[10px] text-gray-500">{selectedEmployee.role}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                       <div>
                          <p className="text-xs font-bold text-gray-900">{selectedService.name}</p>
                          <p className="text-[10px] text-gray-500">{selectedService.duration} mins</p>
                       </div>
                       <span className="font-black text-gray-900">{selectedService.price}</span>
                    </div>

                    <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        This appointment will be pending until confirmed by the business.
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setSlotToConfirm(null)}>Cancel</Button>
                    <Button onClick={confirmBooking}>Request</Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};