
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Calendar, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { UserRole } from './types.ts';
import { Card, Button } from './UIComponents.tsx';

export const LoginPage = () => {
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
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-red-600 mb-6">
            <Calendar className="w-8 h-8" />
            <span>Meetbe</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        </div>

        <Card className="p-8 border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
               <button 
                  type="button" 
                  onClick={() => setRole(UserRole.CLIENT)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-bold text-sm ${role === UserRole.CLIENT ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white text-gray-400 border-gray-100'}`}
               >
                 <UserIcon className="w-4 h-4" /> Client
               </button>
               <button 
                  type="button" 
                  onClick={() => setRole(UserRole.BUSINESS)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-bold text-sm ${role === UserRole.BUSINESS ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white text-gray-400 border-gray-100'}`}
               >
                 <Briefcase className="w-4 h-4" /> Business
               </button>
            </div>

            <div className="space-y-4">
              <input 
                required
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium outline-none focus:ring-2 focus:ring-red-500 transition-all" 
              />
              <input 
                required
                type="password" 
                placeholder="Password" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium outline-none focus:ring-2 focus:ring-red-500 transition-all" 
              />
            </div>
            
            <Button type="submit" className="w-full py-4 text-md font-bold rounded-xl shadow-lg shadow-red-100">Sign In</Button>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-sm font-medium text-gray-500">
          Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Join free</Link>
        </p>
      </div>
    </div>
  );
};