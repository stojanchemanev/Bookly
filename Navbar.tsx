
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { UserRole } from './types.ts';
import { NotificationBell } from './NotificationBell.tsx';

export const Navbar = () => {
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
