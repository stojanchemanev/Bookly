
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, Briefcase } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-12 shadow-2xl border-none">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900">Secure Login</h2>
          <p className="text-gray-500 font-medium mt-2">Manage your Bookly appointments</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <input 
            required
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" 
          />
          <input 
            required
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" 
          />
          
          <Button type="submit" className="w-full py-5 text-xl font-black shadow-xl">Sign In</Button>
        </form>
        
        <p className="text-center mt-10 text-sm font-medium text-gray-500">
          Need an account? <Link to="/register" className="text-indigo-600 font-black">Register Now</Link>
        </p>
      </Card>
    </div>
  );
};
