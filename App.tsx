
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Star, 
  Plus, 
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  User as UserIcon,
  ShieldCheck,
  Briefcase,
  History,
  CalendarCheck,
  ChevronLeft,
  CalendarDays,
  MoreVertical,
  Bell,
  CreditCard,
  Check,
  BellRing,
  Mail,
  Smartphone,
  Globe,
  Camera
} from 'lucide-react';
import { User, UserRole, Business, Employee, TimeSlot, Appointment } from './types';
import { MOCK_BUSINESSES, MOCK_EMPLOYEES, CATEGORIES } from './constants';
import { format, addDays, addHours, isSameDay, isPast } from 'date-fns';

// --- Notification Context (Simulating Pusher) ---

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'system' | 'billing';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Bookly',
      message: 'Start by configuring your business profile in settings.',
      time: new Date().toISOString(),
      read: false,
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Simulate Browser/Pusher Notification
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

// --- Auth Context ---

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  register: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bookly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('bookly_user', JSON.stringify(newUser));
  };

  const register = (name: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('bookly_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Components ---

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, variant = 'primary', className = '', onClick, disabled, type = 'button' }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  
  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No notifications yet</div>
              ) : (
                notifications.map(notif => (
                  <button 
                    key={notif.id}
                    onClick={() => { markAsRead(notif.id); setIsOpen(false); }}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                      <div>
                        <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-black">{format(new Date(notif.time), 'p')}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <Link to="/notifications" className="block p-3 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
              View All Notifications
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
          <Calendar className="w-8 h-8" />
          <span>Bookly</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/pricing" className="text-sm font-bold text-gray-600 hover:text-indigo-600 hidden sm:inline">Pricing</Link>
          <Link to="/browse" className="text-sm font-bold text-gray-600 hover:text-indigo-600">Browse</Link>
          {user ? (
            <>
              <NotificationBell />
              {user.role === UserRole.BUSINESS ? (
                <Link to="/dashboard" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">Dashboard</Link>
              ) : (
                <Link to="/my-appointments" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">My Bookings</Link>
              )}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full border border-gray-200">
                <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Pricing Page ---

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for local shops starting out.',
      features: ['Up to 10 clients', 'Basic Calendar', 'Dashboard Analytics', '2 Staff Members'],
      buttonText: 'Start for Free',
      recommended: false
    },
    {
      name: 'Growth',
      price: '$19',
      extra: '+ $1 per extra user',
      description: 'Scale your business with ease.',
      features: ['Unlimited Clients after 10', 'Real-time Notifications', 'Custom Business Page', '5 Staff Members', 'Email Alerts'],
      buttonText: 'Get Started',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For multi-location franchises.',
      features: ['Unlimited Staff', 'Custom Domain', 'SMS Notifications', 'Dedicated Manager', 'API Access', 'SSO Login'],
      buttonText: 'Contact Sales',
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6">Simple, Transparent <br/><span className="text-indigo-600">Pricing for Pro's.</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16 font-medium">Always free for clients. Simple tiered pricing for business owners to scale effortlessly.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={`relative p-8 flex flex-col ${plan.recommended ? 'ring-4 ring-indigo-600 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-xl'}`}>
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Recommended</div>
              )}
              <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-400 font-bold"> /mo</span>
                {plan.extra && <p className="text-xs text-indigo-600 font-bold mt-1">{plan.extra}</p>}
              </div>
              <p className="text-sm text-gray-500 mb-8 font-medium">{plan.description}</p>
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                    <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
              <Button variant={plan.recommended ? 'primary' : 'outline'} className="w-full py-4 text-lg font-black">
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-20 p-8 bg-indigo-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-2xl">
          <div>
            <h4 className="text-2xl font-black mb-2">Are you a customer booking appointments?</h4>
            <p className="text-indigo-200 font-medium">Bookly is 100% free for clients. No hidden fees, just great service.</p>
          </div>
          <Link to="/browse">
            <Button className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 text-lg font-black whitespace-nowrap">Browse Shops</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Business Profile Page ---

const BusinessProfilePage = () => {
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
    // Simulate real-time notification via "Pusher"
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
              <span className="text-sm text-gray-500 font-medium">{employees.length} available professionals</span>
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
                  <div className="relative mb-4">
                    <img src={emp.avatar} alt={emp.name} className="w-24 h-24 rounded-2xl mx-auto object-cover" />
                    {selectedEmployee?.id === emp.id && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full border-2 border-white">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
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
              <Clock className="w-6 h-6 text-indigo-600" />
              Quick Book
            </h3>
            
            {bookingConfirmed ? (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Booking Success!</h4>
                <p className="text-gray-500 mb-8 leading-relaxed">Your appointment with <b>{selectedEmployee?.name}</b> is scheduled for <b>{format(selectedDate, 'MMM do')}</b>.</p>
                <Button variant="outline" className="w-full py-4" onClick={() => setBookingConfirmed(false)}>Book Another Session</Button>
              </div>
            ) : !selectedEmployee ? (
              <div className="text-center py-16 text-gray-500 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p className="font-medium text-gray-400">Choose a professional<br/>to view their schedule</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Choose Date</label>
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => {
                      const date = addDays(new Date(), i);
                      const isSelected = isSameDay(date, selectedDate);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={`flex flex-col items-center min-w-[70px] p-4 rounded-2xl border transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-black tracking-widest mb-1">{format(date, 'EEE')}</span>
                          <span className="text-xl font-black">{format(date, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Available Times</label>
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        className={`p-4 text-sm font-bold rounded-xl border transition-all text-center ${
                          slot.isBooked 
                            ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed line-through' 
                            : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                      >
                        {format(new Date(slot.startTime), 'p')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Price</span>
                      <span className="text-3xl font-black text-gray-900">$45.00</span>
                    </div>
                  </div>
                  <Button className="w-full py-5 text-lg shadow-xl shadow-indigo-100" onClick={handleBooking}>
                    Confirm Appointment
                  </Button>
                  <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-tighter">Pay at the store after your visit</p>
                </div>
              </div>
            )}
          </Card>
        </aside>
      </main>
    </div>
  );
};

// --- Business Settings Component ---

const BusinessSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'The Sharp Blade Barbers',
    description: 'Premium grooming for the modern gentleman. We specialize in classic cuts and hot towel shaves.',
    address: '123 Style Ave, New York, NY',
    category: 'Barber',
    email: 'contact@sharpblade.com',
    phone: '+1 (555) 000-0000',
    website: 'www.sharpbladebarbers.com'
  });

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <Card className="p-8 border-none shadow-lg">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Globe className="w-6 h-6 text-indigo-600" /> Public Profile</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Name</label>
              <input type="text" value={formData.name} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600 appearance-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shop Logo</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden group cursor-pointer relative">
                <img src="https://picsum.photos/seed/barber/200/200" alt="Logo" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                <Camera className="w-6 h-6 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Recommended size: 512x512px.<br/>PNG or JPG.</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600 h-32" value={formData.description}></textarea>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-none shadow-lg">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><MapPin className="w-6 h-6 text-indigo-600" /> Location & Contact</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Address</label>
            <input type="text" value={formData.address} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Work Phone</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={formData.phone} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Website</label>
              <input type="text" value={formData.website} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 pb-12">
        <Button className="px-12 py-4 text-lg font-black shadow-2xl shadow-indigo-200">Save Changes</Button>
      </div>
    </div>
  );
};

const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'staff' | 'availability' | 'settings'>('overview');
  const [showAddSlot, setShowAddSlot] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-3xl text-indigo-600 tracking-tighter">
            <Calendar className="w-10 h-10" />
            <span>Bookly</span>
          </Link>
        </div>
        <nav className="flex-1 px-6 py-4 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Performance' },
            { id: 'calendar', icon: CalendarDays, label: 'Calendar View' },
            { id: 'staff', icon: Users, label: 'Team Members' },
            { id: 'availability', icon: Clock, label: 'Schedule Manager' },
            { id: 'settings', icon: Settings, label: 'Shop Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t bg-gray-50/50">
          <div className="flex items-center gap-3 mb-6 px-4">
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-600 border border-indigo-200">
               {user?.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-gray-500 font-medium">Powering your business operations efficiently.</p>
          </div>
          <div className="flex items-center gap-4">
             <NotificationBell />
             <Button variant="outline" className="px-6 py-3 rounded-xl"><Search className="w-4 h-4" /> History</Button>
             <Button onClick={() => setShowAddSlot(true)} className="px-6 py-3 rounded-xl shadow-xl shadow-indigo-100">
               <Plus className="w-5 h-5" /> Add Slots
             </Button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Bookings', value: '1,284', change: '+12%', color: 'text-indigo-600', icon: Calendar },
                { label: 'Revenue', value: '$12.4k', change: '+8%', color: 'text-green-600', icon: Briefcase },
                { label: 'New Clients', value: '48', change: '+24%', color: 'text-blue-600', icon: Users },
                { label: 'Satisfaction', value: '98%', change: '+0.1', color: 'text-amber-600', icon: Star }
              ].map((stat, i) => (
                <Card key={i} className="p-8 border-none shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className={`text-4xl font-black text-gray-900`}>{stat.value}</h3>
                </Card>
              ))}
            </div>

            <Card className="p-8 border-none shadow-xl">
              <h3 className="text-2xl font-bold mb-8">Daily Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="pb-6">Client Name</th>
                      <th className="pb-6">Professional</th>
                      <th className="pb-6">Service Type</th>
                      <th className="pb-6">Date & Time</th>
                      <th className="pb-6">Status</th>
                      <th className="pb-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {[
                      { name: 'Sarah Connor', pro: 'James Wilson', service: 'Full Grooming', time: '10:30 AM', status: 'CONFIRMED' },
                      { name: 'John Wick', pro: 'Sarah Miller', service: 'Classic Cut', time: '11:45 AM', status: 'CONFIRMED' },
                      { name: 'Bruce Wayne', pro: 'James Wilson', service: 'Hot Shave', time: '02:00 PM', status: 'PENDING' },
                      { name: 'Peter Parker', pro: 'Marcus Kane', service: 'Training', time: '04:15 PM', status: 'CANCELLED' },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-indigo-50/50 transition-all cursor-pointer">
                        <td className="py-6 font-bold text-gray-900">{row.name}</td>
                        <td className="py-6 font-medium text-gray-600">{row.pro}</td>
                        <td className="py-6"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">{row.service}</span></td>
                        <td className="py-6 font-bold text-gray-500">Today, {row.time}</td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                            row.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            row.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>{row.status}</span>
                        </td>
                        <td className="py-6 text-right">
                           <button className="p-2 text-gray-300 hover:text-indigo-600 group-hover:translate-x-1 transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'settings' && <BusinessSettings />}

        {activeTab === 'availability' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <Card className="p-10 border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black mb-4">Master Schedule</h3>
                <p className="text-indigo-100 text-lg mb-10 font-medium">Quickly open new slots for your team members to accept bookings.</p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 opacity-70">Pick Date</label>
                    <input type="date" className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 opacity-70">Start At</label>
                    <input type="time" className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/50" />
                  </div>
                </div>
                <div className="mb-10">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 opacity-70">Assign To Professional</label>
                  <select className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-2 focus:ring-white/50 appearance-none">
                    {MOCK_EMPLOYEES.filter(e => e.businessId === 'b1').map(e => (
                      <option key={e.id} className="text-gray-900">{e.name}</option>
                    ))}
                  </select>
                </div>
                <Button className="w-full py-5 bg-white text-indigo-700 hover:bg-indigo-50 text-xl font-black shadow-2xl">Create Session</Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-10">
              <Card className="p-8 border-none shadow-lg">
                <h4 className="text-xl font-bold mb-8 flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500" /> Active Openings</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all">
                      <div>
                        <p className="font-black text-gray-900 text-lg">Tomorrow at 09:00 AM</p>
                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">James Wilson</p>
                      </div>
                      <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-gray-300" />
                </div>
                <h5 className="text-xl font-bold text-gray-400 mb-2">No More Openings</h5>
                <p className="text-gray-400 max-w-[200px]">All other slots for this week have been filled or are closed.</p>
              </Card>
            </div>
          </div>
        )}
      </main>

      {showAddSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-xl p-10 animate-in zoom-in slide-in-from-bottom-8 duration-500 border-none shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Post Available Slot</h3>
                <p className="text-gray-500 font-medium">This slot will appear live on your booking page.</p>
              </div>
              <button onClick={() => setShowAddSlot(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Professional</label>
                <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                  {MOCK_EMPLOYEES.filter(e => e.businessId === 'b1').map(e => (
                    <option key={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Target Date</label>
                  <input type="date" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Start Time</label>
                  <input type="time" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="pt-6">
                <Button className="w-full py-5 text-xl font-black shadow-xl shadow-indigo-100" onClick={() => setShowAddSlot(false)}>Publish Session</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Calendar View Component (Day Side-by-Side) ---

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const employees = MOCK_EMPLOYEES.filter(e => e.businessId === 'b1');
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const scheduleData = useMemo(() => {
    return employees.map(emp => ({
      employee: emp,
      slots: [
        { time: 9, status: 'BOOKED', client: 'John Doe', service: 'Fade Cut' },
        { time: 10, status: 'BOOKED', client: 'Jane Smith', service: 'Beard Trim' },
        { time: 13, status: 'AVAILABLE' },
        { time: 14, status: 'AVAILABLE' },
        { time: 15, status: 'BOOKED', client: 'Mike Ross', service: 'Full Groom' },
      ]
    }));
  }, [employees]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(addDays(currentDate, -1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl font-black text-gray-900">{format(currentDate, 'MMMM d, yyyy')}</h2>
          <Button variant="outline" className="text-indigo-600 border-indigo-100 bg-indigo-50/50" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="rounded-xl font-bold">Day</Button>
          <Button variant="outline" className="rounded-xl border-none font-bold">Week</Button>
        </div>
      </header>

      <Card className="border-none shadow-xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[100px_repeat(4,1fr)] border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="p-4 bg-gray-50/50"></div>
            {employees.map(emp => (
              <div key={emp.id} className="p-4 border-l border-gray-100 text-center">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full mx-auto mb-2 object-cover border-2 border-white shadow-sm" />
                <h4 className="font-bold text-gray-900 text-sm">{emp.name}</h4>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{emp.role}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[100px_repeat(4,1fr)] border-b border-gray-50 h-24">
                <div className="p-4 text-xs font-black text-gray-400 text-right pr-6 pt-2">
                  {format(new Date(new Date().setHours(hour, 0, 0, 0)), 'h aa')}
                </div>
                {employees.map(emp => {
                  const empSchedule = scheduleData.find(s => s.employee.id === emp.id);
                  const slot = empSchedule?.slots.find(sl => sl.time === hour);
                  
                  return (
                    <div key={emp.id} className="border-l border-gray-50 relative group transition-colors hover:bg-gray-50/50">
                      {slot ? (
                        <div className={`absolute inset-1 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          slot.status === 'BOOKED' 
                          ? 'bg-indigo-600 border-white text-white shadow-lg shadow-indigo-200' 
                          : 'bg-white border-dashed border-indigo-200 text-indigo-600 hover:scale-[1.02]'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                              {slot.status === 'BOOKED' ? slot.service : 'AVAILABLE'}
                            </span>
                          </div>
                          {slot.status === 'BOOKED' && (
                            <p className="text-xs font-bold mt-1 truncate">{slot.client}</p>
                          )}
                          <p className="text-[9px] mt-auto font-medium opacity-70">
                            {format(new Date(new Date().setHours(hour, 0, 0, 0)), 'h:mm aa')}
                          </p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <button className="bg-indigo-600 text-white p-1 rounded-full shadow-lg pointer-events-auto hover:scale-110 transition-transform">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || (user.role === UserRole.BUSINESS ? "/dashboard" : "/browse");
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@user.com', role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border-none">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Secure Login</h2>
          <p className="text-gray-500 font-medium mt-2">Manage your Bookly appointments</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Role Selection</label>
            <div className="grid grid-cols-2 gap-4">
               <button 
                  type="button" 
                  onClick={() => setRole(UserRole.CLIENT)}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${role === UserRole.CLIENT ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white text-gray-500 border-gray-100'}`}
               >
                 <UserIcon className="w-5 h-5" /> Client
               </button>
               <button 
                  type="button" 
                  onClick={() => setRole(UserRole.BUSINESS)}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${role === UserRole.BUSINESS ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white text-gray-500 border-gray-100'}`}
               >
                 <Briefcase className="w-5 h-5" /> Business
               </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900" 
            />
          </div>
          
          <Button type="submit" className="w-full py-5 text-xl font-black shadow-2xl shadow-indigo-100">Sign In to Dashboard</Button>
        </form>
        
        <p className="text-center mt-10 text-sm font-medium text-gray-500">
          Need a workspace? <Link to="/register" className="text-indigo-600 font-black">Register your account</Link>
        </p>
      </Card>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name || 'New User', email || 'demo@user.com', role);
    navigate(role === UserRole.BUSINESS ? '/dashboard' : '/browse');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border-none">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <div className="mb-10">
              <Link to="/" className="inline-flex items-center gap-2 font-bold text-3xl text-indigo-600 tracking-tighter mb-8">
                <Calendar className="w-10 h-10" />
                <span>Bookly</span>
              </Link>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Join the Network</h2>
              <p className="text-gray-500 font-medium mt-4">Start booking or hosting appointments in seconds. Flexible for everyone.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    type="button" 
                    onClick={() => setRole(UserRole.CLIENT)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-3xl border-2 transition-all ${role === UserRole.CLIENT ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100'}`}
                 >
                   <UserIcon className="w-8 h-8" />
                   <span className="font-bold text-sm">I'm a Client</span>
                 </button>
                 <button 
                    type="button" 
                    onClick={() => setRole(UserRole.BUSINESS)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-3xl border-2 transition-all ${role === UserRole.BUSINESS ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100'}`}
                 >
                   <Briefcase className="w-8 h-8" />
                   <span className="font-bold text-sm">I'm a Pro</span>
                 </button>
              </div>

              <div className="space-y-4">
                <input 
                  required
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900" 
                />
                <input 
                  required
                  type="email" 
                  placeholder="Work Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900" 
                />
                <input 
                  required
                  type="password" 
                  placeholder="Create Password" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900" 
                />
              </div>
              
              <Button type="submit" className="w-full py-5 text-xl font-black shadow-2xl">Create Free Account</Button>
            </form>
          </div>
          <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>
          <div className="flex-1 hidden md:flex flex-col justify-center space-y-8">
             <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h4 className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Unlimited Bookings</h4>
                <p className="text-sm text-indigo-600/80">Never worry about limits on how many clients you can serve.</p>
             </div>
             <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Team Sync</h4>
                <p className="text-sm text-green-600/80">Manage multiple employees and locations effortlessly.</p>
             </div>
             <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h4 className="font-bold text-amber-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> No Credit Card</h4>
                <p className="text-sm text-amber-600/80">Start your journey today with no commitment or upfront costs.</p>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

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
