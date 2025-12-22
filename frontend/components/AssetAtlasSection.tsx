
import React from 'react';
import { ArrowRight, Wallet, Gift, DollarSign, CheckCircle } from 'lucide-react';

export const AssetAtlasSection: React.FC = () => {
  const steps = [
    {
      icon: Wallet,
      step: '01',
      title: 'Connect Wallet',
      description: 'Connect your MetaMask wallet to Arbitrum network'
    },
    {
      icon: Gift,
      step: '02',
      title: 'Create Gift Card',
      description: 'Set amount, merchants, and expiry date'
    },
    {
      icon: DollarSign,
      step: '03',
      title: 'Share & Spend',
      description: 'Recipient spends flexibly across merchants'
    },
    {
      icon: CheckCircle,
      step: '04',
      title: 'Auto-Refund',
      description: 'Unused balance returns after expiry'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center px-8 md:px-24 py-32">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-green-500 mb-6">
            <span className="w-12 h-[1px] bg-green-500/50"></span>
            <span className="font-bold">How It Works</span>
            <span className="w-12 h-[1px] bg-green-500/50"></span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Simple. Transparent. Efficient.
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Create and redeem gift cards in 4 easy steps, powered by Stylus smart contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group h-full">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all duration-300">
                  <step.icon className="text-green-500" size={28} />
                </div>
                <div className="text-5xl font-black text-white/5 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="text-green-500/30" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 hover:bg-green-500 hover:text-white inline-flex items-center space-x-3">
            <span>Get Started Now</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
