
import React, { useState } from 'react';
// Fixed: Changed import source from 'react-router-dom' to 'react-router' to resolve missing member errors.
import { useNavigate, Link } from 'react-router';
import { User as UserIcon, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { UserRole } from './types';
import { Card, Button } from './UIComponents';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-12 shadow-2xl border-none">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-gray-900 mb-8">Join Bookly</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    type="button" 
                    onClick={() => setRole(UserRole.CLIENT)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-3xl border-2 transition-all ${role === UserRole.CLIENT ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white text-gray-400 border-gray-100'}`}
                 >
                   <UserIcon className="w-8 h-8" />
                   <span className="font-bold text-sm">Client</span>
                 </button>
                 <button 
                    type="button" 
                    onClick={() => setRole(UserRole.BUSINESS)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-3xl border-2 transition-all ${role === UserRole.BUSINESS ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white text-gray-400 border-gray-100'}`}
                 >
                   <Briefcase className="w-8 h-8" />
                   <span className="font-bold text-sm">Business</span>
                 </button>
              </div>

              <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none font-bold" />
              <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none font-bold" />
              <input required type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none font-bold" />
              <Button type="submit" className="w-full py-5 text-xl font-black shadow-2xl">Create Account</Button>
            </form>
          </div>
          <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>
          <div className="flex-1 hidden md:flex flex-col justify-center space-y-8">
             <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h4 className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Free for Clients</h4>
                <p className="text-sm text-indigo-600/80">Never pay for booking appointments.</p>
             </div>
             <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pro Scheduling</h4>
                <p className="text-sm text-green-600/80">Tools for business growth and team management.</p>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};