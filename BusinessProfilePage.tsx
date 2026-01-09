
import React, { useState, useMemo } from 'react';
// Fixed: Changed import source from 'react-router-dom' to 'react-router' to resolve missing member error.
import { useParams } from 'react-router';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { format, addHours, isSameDay, addDays } from 'date-fns';
import { Navbar } from './Navbar';
import { MOCK_BUSINESSES, MOCK_EMPLOYEES } from './constants';
import { useNotifications } from './NotificationContext';
import { Card, Button } from './UIComponents';
import { Employee, TimeSlot } from './types';

export const BusinessProfilePage = () => {
  const { id } = useParams();
  const business = MOCK_BUSINESSES.find(b => b.id === id);
  const employees = MOCK_EMPLOYEES.filter(e => e.businessId === id);
  const { addNotification } = useNotifications();
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const slots = useMemo(() => {
    const s: TimeSlot[] = [];
    if (!selectedEmployee) return [];
    for (let i = 0; i < 8; i++) {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const start = addHours(dayStart, 9 + i);
      s.push({
        id: `slot-${i}`,
        employeeId: selectedEmployee.id,
        businessId: id!,
        startTime: start.toISOString(),
        endTime: addHours(start, 1).toISOString(),
        isBooked: i % 3 === 0
      });
    }
    return s;
  }, [selectedEmployee, selectedDate, id]);

  const handleBooking = () => {
    setBookingConfirmed(true);
    addNotification(
      'New Appointment Request!',
      `A new client has requested a session with ${selectedEmployee?.name} on ${format(selectedDate, 'MMM d')}.`,
      'booking'
    );
  };

  if (!business) return <div>Business not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-indigo-600 h-80 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute -bottom-16 left-4 md:left-24 p-1.5 bg-white rounded-3xl shadow-2xl">
          <img src={business.logo} alt={business.name} className="w-40 h-40 rounded-2xl object-cover" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-24 pb-24 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">{business.name}</h1>
            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm"><MapPin className="w-5 h-5 text-indigo-500" /> {business.address}</span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm font-bold text-gray-800"><Star className="w-5 h-5 fill-current text-amber-500" /> {business.rating} Rating</span>
              <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-100 font-bold uppercase tracking-widest text-xs">{business.category}</span>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">{business.description}</p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Select Professional</h2>
              <span className="text-sm text-gray-500 font-medium">{employees.length} professionals</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {employees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`p-6 rounded-2xl border-2 transition-all group ${
                    selectedEmployee?.id === emp.id 
                      ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-50 shadow-xl' 
                      : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-lg'
                  }`}
                >
                  <img src={emp.avatar} alt={emp.name} className="w-24 h-24 rounded-2xl mx-auto object-cover mb-4" />
                  <h4 className="font-bold text-lg">{emp.name}</h4>
                  <p className="text-sm text-indigo-600 font-semibold">{emp.role}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <Card className="sticky top-24 p-8 shadow-2xl border-none ring-1 ring-gray-100">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" /> Quick Book
            </h3>
            {bookingConfirmed ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold">Booking Confirmed!</h4>
                <Button className="w-full mt-6" onClick={() => setBookingConfirmed(false)}>Book Again</Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Available Times</label>
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={handleBooking}
                        className={`p-4 text-sm font-bold rounded-xl border transition-all text-center ${
                          slot.isBooked 
                            ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed' 
                            : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {format(new Date(slot.startTime), 'p')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </aside>
      </main>
    </div>
  );
};