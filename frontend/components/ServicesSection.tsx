
import React from 'react';
import { Gift, Zap, Shield, RefreshCw, Code, BarChart3 } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const features = [
    {
      icon: Gift,
      title: 'Flexible Gift Cards',
      description: 'Create gift cards with USDC that can be spent across multiple merchants. No more brand-locked cards.'
    },
    {
      icon: RefreshCw,
      title: 'Auto-Refund',
      description: 'Unused balances automatically refund to the giver after expiry. Zero waste, complete transparency.'
    },
    {
      icon: Zap,
      title: 'Stylus Contracts',
      description: 'Built with Rust + Stylus for 10x cheaper gas fees and better performance than traditional Solidity.'
    },
    {
      icon: Shield,
      title: 'Arbitrum Security',
      description: 'Secured by Arbitrum L2 with Ethereum-grade security. Your funds are always safe and verifiable.'
    },
    {
      icon: Code,
      title: 'Developer SDK',
      description: 'Easy-to-use TypeScript SDK for integrating FlexiGift into any dApp or application.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track gift card usage, redemption rates, and gas savings with our comprehensive dashboard.'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center px-8 md:px-24 py-32">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-green-500 mb-6">
            <span className="w-12 h-[1px] bg-green-500/50"></span>
            <span className="font-bold">Features</span>
            <span className="w-12 h-[1px] bg-green-500/50"></span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Why FlexiGift?
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Over 20% of gift cards go unused annually. We're solving this with blockchain technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all duration-300">
                <feature.icon className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
