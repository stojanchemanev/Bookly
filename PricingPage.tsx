
import React from 'react';
import { Check } from 'lucide-react';
import { Navbar } from './Navbar.tsx';
import { Card, Button } from './UIComponents.tsx';

export const PricingPage = () => {
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
      </div>
    </div>
  );
};
