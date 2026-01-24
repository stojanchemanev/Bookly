
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Briefcase, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { UserRole } from './types.ts';
import { Card, Button } from './UIComponents.tsx';

export const RegisterPage = () => {
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
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-red-600 mb-6">
            <Calendar className="w-8 h-8" />
            <span>Meetbe</span>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create your account</h2>
        </div>

        <Card className="p-0 border-none shadow-2xl ring-1 ring-black/5">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-10 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                   <button 
                      type="button" 
                      onClick={() => setRole(UserRole.CLIENT)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        role === UserRole.CLIENT ? 'bg-red-50 border-red-600 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100'
                      }`}
                   >
                     <UserIcon className="w-6 h-6" />
                     <span className="font-bold text-xs uppercase tracking-widest">Client</span>
                   </button>
                   <button 
                      type="button" 
                      onClick={() => setRole(UserRole.BUSINESS)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        role === UserRole.BUSINESS ? 'bg-red-50 border-red-600 text-red-600 shadow-sm' : 'bg-white text-gray-400 border-gray-100'
                      }`}
                   >
                     <Briefcase className="w-6 h-6" />
                     <span className="font-bold text-xs uppercase tracking-widest">Business</span>
                   </button>
                </div>

                <div className="space-y-4">
                  <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium focus:ring-2 focus:ring-red-500" />
                  <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium focus:ring-2 focus:ring-red-500" />
                  <input required type="password" placeholder="Password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium focus:ring-2 focus:ring-red-500" />
                </div>
                <Button type="submit" className="w-full py-4 text-md font-bold rounded-xl shadow-lg shadow-red-100">Get Started</Button>
              </form>
            </div>
            
            <div className="hidden md:flex flex-1 flex-col justify-center p-10 bg-gray-50 border-l border-gray-100">
               <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Always free for clients</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Book unlimited appointments without ever paying service fees.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Powerful business tools</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Manage your team, schedules, and analytics from a clean dashboard.</p>
                    </div>
                 </div>
               </div>
               <div className="mt-12 pt-8 border-t border-gray-200">
                 <p className="text-xs text-center text-gray-400 font-medium italic">Join over 10,000 professional shops worldwide.</p>
               </div>
            </div>
          </div>
        </Card>
        
        <p className="text-center mt-8 text-sm font-medium text-gray-500">
          Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};