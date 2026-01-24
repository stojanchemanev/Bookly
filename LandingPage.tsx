
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings, Clock } from 'lucide-react';
import { Navbar } from './Navbar.tsx';

export const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold text-red-600 bg-red-50 rounded-full border border-red-100">
        Trusted by 10,000+ businesses worldwide
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
        Your business schedule, <br /><span className="text-red-600 italic">simplified.</span>
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
        Manage staff, availability, and bookings on a high-end platform designed for growth.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/register" className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-red-100">
          Start for free
        </Link>
        <Link to="/browse" className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all shadow-sm">
          Browse services
        </Link>
      </div>

      <div className="mt-32 grid md:grid-cols-3 gap-12 text-left">
        {[
          { title: 'Google-Cal Integration', desc: 'Sync your personal and professional life seamlessly.', icon: Clock },
          { title: 'Employee Portal', desc: 'Custom accounts for your entire team to manage their hours.', icon: Users },
          { title: 'Mac-style Design', desc: 'A beautiful interface that feels right at home on any device.', icon: Settings }
        ].map((feat, i) => (
          <div key={i} className="group p-8 rounded-2xl border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{feat.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </main>
  </div>
);
